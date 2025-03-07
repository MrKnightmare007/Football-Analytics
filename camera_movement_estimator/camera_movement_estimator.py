import pickle
import cv2
import numpy as np
import os
import sys 
sys.path.append('../')
from utils import measure_distance,measure_xy_distance

class CameraMovementEstimator():
    def __init__(self,frame):
        self.minimum_distance = 5

        self.lk_params = dict(
            winSize = (15,15),
            maxLevel = 2,
            criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT,10,0.03)
        )
    
        first_frame_grayscale = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
        mask_features = np.zeros_like(first_frame_grayscale)
        mask_features[:,0:20] = 1
        mask_features[:,900:1050] = 1
    
        # Rename this to feature_params to match what's used in get_camera_movement
        self.feature_params = dict(
            maxCorners = 100,
            qualityLevel = 0.3,
            minDistance =3,
            blockSize = 7,
            mask = mask_features
        )

    def add_adjust_positions_to_tracks(self,tracks, camera_movement_per_frame):
        for object, object_tracks in tracks.items():
            for frame_num, track in enumerate(object_tracks):
                for track_id, track_info in track.items():
                    position = track_info['position']
                    camera_movement = camera_movement_per_frame[frame_num]
                    position_adjusted = (position[0]-camera_movement[0],position[1]-camera_movement[1])
                    tracks[object][frame_num][track_id]['position_adjusted'] = position_adjusted
                    


    def get_camera_movement(self,frames,read_from_stub=False, stub_path=None):
        if read_from_stub and stub_path is not None and os.path.exists(stub_path):
            with open(stub_path, 'rb') as f:
                camera_movement_per_frame = pickle.load(f)
            return camera_movement_per_frame
    
        camera_movement_per_frame = []
        
        # Convert first frame to grayscale
        old_frame = frames[0]
        old_gray = cv2.cvtColor(old_frame, cv2.COLOR_BGR2GRAY)
        
        # Get good features to track - remove the mask=None parameter
        old_features = cv2.goodFeaturesToTrack(old_gray, **self.feature_params)
        
        # Check if we have any features to track
        if old_features is None or len(old_features) == 0:
            print("Warning: No features found in the first frame. Using default camera movement.")
            # Return zero movement for all frames
            return np.zeros((len(frames), 2))
        
        # Create a mask image for drawing purposes
        mask = np.zeros_like(old_frame)
        
        # Store camera movement for each frame
        camera_movement_per_frame.append([0, 0])  # First frame has no movement
        
        for i in range(1, len(frames)):
            frame = frames[i]
            frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            try:
                # Calculate optical flow
                new_features, status, _ = cv2.calcOpticalFlowPyrLK(old_gray, frame_gray, old_features, None, **self.lk_params)
                
                # Select good points
                if new_features is not None and status is not None:
                    good_old = old_features[status == 1]
                    good_new = new_features[status == 1]
                    
                    # Check if we have enough good points
                    if len(good_old) > 0 and len(good_new) > 0:
                        # Calculate the average movement
                        movement = np.mean(good_new - good_old, axis=0)
                        camera_movement_per_frame.append(movement.tolist())
                    else:
                        # Not enough good points, use previous movement
                        camera_movement_per_frame.append(camera_movement_per_frame[-1])
                else:
                    # No features tracked, use previous movement
                    camera_movement_per_frame.append(camera_movement_per_frame[-1])
                
                # Update the previous frame and features
                old_gray = frame_gray.copy()
                old_features = cv2.goodFeaturesToTrack(old_gray, mask=None, **self.feature_params)
                
                # If no features found, use the previous ones
                if old_features is None or len(old_features) == 0:
                    print(f"Warning: No features found in frame {i}. Using previous features.")
                    # Create dummy features in the center of the frame
                    h, w = old_gray.shape
                    old_features = np.array([[[w/2, h/2]]], dtype=np.float32)
                    
            except Exception as e:
                print(f"Error processing frame {i}: {str(e)}")
                # Use previous movement in case of error
                camera_movement_per_frame.append(camera_movement_per_frame[-1])
        
        if stub_path is not None:
            with open(stub_path, 'wb') as f:
                pickle.dump(camera_movement_per_frame, f)
    
        return camera_movement_per_frame
    
    def draw_camera_movement(self,frames, camera_movement_per_frame):
        output_frames=[]

        for frame_num, frame in enumerate(frames):
            frame= frame.copy()

            overlay = frame.copy()
            cv2.rectangle(overlay,(0,0),(500,100),(255,255,255),-1)
            alpha =0.6
            cv2.addWeighted(overlay,alpha,frame,1-alpha,0,frame)

            x_movement, y_movement = camera_movement_per_frame[frame_num]
            frame = cv2.putText(frame,f"Camera Movement X: {x_movement:.2f}",(10,30), cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,0),3)
            frame = cv2.putText(frame,f"Camera Movement Y: {y_movement:.2f}",(10,60), cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,0),3)

            output_frames.append(frame) 

        return output_frames