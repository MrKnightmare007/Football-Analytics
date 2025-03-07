from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import time
from werkzeug.utils import secure_filename
import threading
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder
UPLOAD_FOLDER = 'input_videos'
OUTPUT_FOLDER = 'output_videos'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max upload size

# Store processing status
processing_jobs = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_video(input_path, job_id):
    try:
        processing_jobs[job_id]['status'] = 'processing'
        
        # Print the command being run for debugging
        print(f"Running: python main.py {input_path}")
        
        # Run the main.py script with the uploaded video
        result = subprocess.run(['python', 'main.py', input_path], 
                               capture_output=True, text=True)
        
        # Log the output for debugging
        print(f"Command output: {result.stdout}")
        print(f"Command error: {result.stderr}")
        
        if result.returncode == 0:
            # Get the base name of the input file
            base_name = os.path.basename(input_path).rsplit('.', 1)[0]
            # Construct the output path exactly as main.py does
            output_path = os.path.join(OUTPUT_FOLDER, f"{base_name}_output.avi")
            
            # Check if the file actually exists
            if os.path.exists(output_path):
                processing_jobs[job_id]['status'] = 'completed'
                processing_jobs[job_id]['output_path'] = output_path
                print(f"Output file found at: {output_path}")
            else:
                # Try to find the output file with a similar name
                print(f"Output file not found at expected path: {output_path}")
                print(f"Searching for similar files in {OUTPUT_FOLDER}...")
                
                # List all files in the output directory
                all_files = os.listdir(OUTPUT_FOLDER)
                print(f"Files in output directory: {all_files}")
                
                possible_files = [f for f in all_files if base_name in f]
                print(f"Possible matching files: {possible_files}")
                
                if possible_files:
                    # Use the first matching file
                    output_path = os.path.join(OUTPUT_FOLDER, possible_files[0])
                    processing_jobs[job_id]['status'] = 'completed'
                    processing_jobs[job_id]['output_path'] = output_path
                    print(f"Using alternative file: {output_path}")
                else:
                    processing_jobs[job_id]['status'] = 'failed'
                    processing_jobs[job_id]['error'] = f"Output file not found: {output_path}"
                    print(f"No matching output files found")
        else:
            processing_jobs[job_id]['status'] = 'failed'
            processing_jobs[job_id]['error'] = result.stderr
            print(f"Process failed with return code: {result.returncode}")
    except Exception as e:
        processing_jobs[job_id]['status'] = 'failed'
        processing_jobs[job_id]['error'] = str(e)
        print(f"Exception during processing: {str(e)}")

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{int(time.time())}_{filename}"
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(input_path)
        
        # Generate a job ID
        job_id = str(uuid.uuid4())
        
        # Create a job entry
        processing_jobs[job_id] = {
            'input_path': input_path,
            'status': 'queued',
            'timestamp': time.time()
        }
        
        # Start processing in a separate thread
        thread = threading.Thread(target=process_video, args=(input_path, job_id))
        thread.start()
        
        return jsonify({
            'job_id': job_id,
            'filename': unique_filename,
            'status': 'queued'
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/status/<job_id>', methods=['GET'])
def get_status(job_id):
    if job_id not in processing_jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify(processing_jobs[job_id])

@app.route('/api/video/<job_id>', methods=['GET'])
def get_video(job_id):
    if job_id not in processing_jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    job = processing_jobs[job_id]
    
    if job['status'] != 'completed':
        return jsonify({'error': 'Video processing not completed'}), 400
    
    try:
        # Check if file exists before sending
        if not os.path.exists(job['output_path']):
            return jsonify({'error': f"File not found: {job['output_path']}"}), 404
            
        return send_file(job['output_path'], as_attachment=True)
    except Exception as e:
        return jsonify({'error': f"Error sending file: {str(e)}"}), 500

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    return jsonify(processing_jobs)

if __name__ == '__main__':
    app.run(debug=True, port=5000)