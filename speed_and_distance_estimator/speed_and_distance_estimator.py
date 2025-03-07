import cv2
import numpy as np
import sys 
sys.path.append('../')
from utils import measure_distance ,get_foot_position

class SpeedAndDistance_Estimator():
    def __init__(self):
        self.frame_window=5
        self.frame_rate=24
        self.pixels_to_meters = 0.1  # Conversion factor from pixels to meters
    
    def add_speed_and_distance_to_tracks(self, tracks):
        # Add distance and speed to each player
        for object_type, object_tracks in tracks.items():
            for frame_num in range(1, len(object_tracks)):
                for track_id, track_info in object_tracks[frame_num].items():
                    # Check if the track_id exists in the previous frame
                    if track_id in object_tracks[frame_num-1]:
                        # Get the current and previous positions
                        current_position = track_info.get('adjusted_position', track_info.get('position', None))
                        previous_position = object_tracks[frame_num-1][track_id].get('adjusted_position', 
                                                                                   object_tracks[frame_num-1][track_id].get('position', None))
                        
                        # Calculate distance if both positions exist
                        if current_position is not None and previous_position is not None:
                            # Calculate distance in pixels
                            distance_pixels = np.sqrt((current_position[0] - previous_position[0])**2 + 
                                                     (current_position[1] - previous_position[1])**2)
                            
                            # Convert to meters
                            distance_meters = distance_pixels * self.pixels_to_meters
                            
                            # Calculate time elapsed (assuming 25 fps)
                            time_elapsed = 1/25  # 0.04 seconds between frames
                            
                            # Prevent division by zero
                            if time_elapsed > 0:
                                # Calculate speed in meters per second
                                speed_meters_per_second = distance_meters/time_elapsed
                            else:
                                speed_meters_per_second = 0
                            
                            # Convert to km/h
                            speed_kmh = speed_meters_per_second * 3.6
                            
                            # Add to track info
                            tracks[object_type][frame_num][track_id]['distance'] = distance_meters
                            tracks[object_type][frame_num][track_id]['speed'] = speed_kmh
                        else:
                            # Set default values if positions are missing
                            tracks[object_type][frame_num][track_id]['distance'] = 0
                            tracks[object_type][frame_num][track_id]['speed'] = 0
                    else:
                        # Set default values for new tracks
                        tracks[object_type][frame_num][track_id]['distance'] = 0
                        tracks[object_type][frame_num][track_id]['speed'] = 0
    
    def draw_speed_and_distance(self,frames,tracks):
        output_frames = []
        for frame_num, frame in enumerate(frames):
            for object, object_tracks in tracks.items():
                if object == "ball" or object == "referees":
                    continue 
                for _, track_info in object_tracks[frame_num].items():
                   if "speed" in track_info:
                       speed = track_info.get('speed',None)
                       distance = track_info.get('distance',None)
                       if speed is None or distance is None:
                           continue
                       
                       bbox = track_info['bbox']
                       position = get_foot_position(bbox)
                       position = list(position)
                       position[1]+=40

                       position = tuple(map(int,position))
                       cv2.putText(frame, f"{speed:.2f} km/h",position,cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),2)
                       cv2.putText(frame, f"{distance:.2f} m",(position[0],position[1]+20),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),2)
            output_frames.append(frame)
        
        return output_frames