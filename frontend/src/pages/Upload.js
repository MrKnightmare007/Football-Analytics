import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Typography, 
  Button, 
  Box, 
  Paper, 
  LinearProgress, 
  Alert 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import axios from 'axios';
import FootballLoader from '../components/FootballLoader';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    // Only accept one file
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov']
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // Navigate to results page with the job ID
      navigate(`/results/${response.data.job_id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'An error occurred during upload');
      setUploading(false);
    }
  };

  return (
    <div>
      <Typography variant="h3" component="h1" className="page-title">
        Upload Football Video
      </Typography>

      <Box className="upload-container">
        <Paper 
          {...getRootProps()} 
          className="dropzone"
          elevation={3}
          sx={{
            bgcolor: isDragActive ? 'rgba(67, 160, 71, 0.1)' : 'white',
            border: '2px dashed',
            borderColor: isDragActive ? 'secondary.main' : 'primary.main',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': isDragActive ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'repeating-linear-gradient(45deg, rgba(67, 160, 71, 0.1), rgba(67, 160, 71, 0.1) 10px, rgba(255, 255, 255, 0.5) 10px, rgba(255, 255, 255, 0.5) 20px)',
              zIndex: 0,
            } : {}
          }}
        >
          <input {...getInputProps()} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <SportsSoccerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                {isDragActive ? 'Drop the video here...' : 'Drag & drop a football video here'}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                or click to select a file (MP4, AVI, MOV)
              </Typography>
              {file && (
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {uploading ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" gutterBottom>
              Uploading: {uploadProgress}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  backgroundImage: 'linear-gradient(45deg, #43a047 25%, #66bb6a 25%, #66bb6a 50%, #43a047 50%, #43a047 75%, #66bb6a 75%, #66bb6a 100%)',
                  backgroundSize: '20px 20px',
                  animation: 'progress-animation 1s linear infinite'
                }
              }}
            />
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <FootballLoader message="Processing your video..." />
            </Box>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={!file}
            sx={{ 
              mt: 3, 
              py: 1.5, 
              px: 4, 
              borderRadius: 4,
              background: file ? 'linear-gradient(45deg, #1e88e5, #42a5f5)' : undefined,
              '&:hover': {
                background: file ? 'linear-gradient(45deg, #1976d2, #1e88e5)' : undefined,
              }
            }}
          >
            Upload Video
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 6, p: 3, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          What happens after upload?
        </Typography>
        <Typography variant="body1" paragraph>
          Our AI system will analyze your football video to:
        </Typography>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Track all players and the ball</li>
          <li>Assign players to teams based on jersey colors</li>
          <li>Calculate player speeds and distances</li>
          <li>Analyze ball possession</li>
          <li>Generate comprehensive match statistics</li>
        </ul>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Processing time depends on video length and quality. You'll be redirected to the results page when complete.
        </Typography>
      </Box>
    </div>
  );
};

export default Upload;