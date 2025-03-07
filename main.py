from utils import read_video, save_video
from trackers import Tracker
import cv2
import numpy as np
from team_assigner import TeamAssigner
from player_ball_assigner import PlayerBallAssigner
from camera_movement_estimator import CameraMovementEstimator
from view_transformer import ViewTransformer
from speed_and_distance_estimator import SpeedAndDistance_Estimator
import traceback
import time
import sys
import os


def main(input_video_path=None):
    try:
        print("Starting video processing...")
        
        # Read Video
        print("Reading video...")
        video_path = input_video_path if input_video_path else 'input_videos/test4.mp4'
        video_frames = read_video(video_path)
        print(f"Loaded {len(video_frames)} frames")

        # Check if we have frames to process
        if len(video_frames) == 0:
            print("Error: No frames were loaded from the video. The file may be corrupted or in an unsupported format.")
            return False

        # Get output path
        if input_video_path:
            base_name = os.path.basename(input_video_path).rsplit('.', 1)[0]
            output_path = f'output_videos/{base_name}_output.avi'
        else:
            output_path = 'output_videos/output_video.avi'

        # Initialize Tracker
        print("Initializing tracker...")
        tracker = Tracker('models/best.pt')

        print("Getting object tracks...")
        # Set read_from_stub to False for new videos that don't match the stub data
        tracks = tracker.get_object_tracks(video_frames,
                                        read_from_stub=False,
                                        stub_path='stubs/track_stubs.pkl')
        
        # Get object positions 
        print("Adding positions to tracks...")
        tracker.add_position_to_tracks(tracks)

        # camera movement estimator
        camera_movement_estimator = CameraMovementEstimator(video_frames[0])
        camera_movement_per_frame = camera_movement_estimator.get_camera_movement(video_frames,
                                                                                read_from_stub=False,
                                                                                stub_path='stubs/camera_movement_stub.pkl')
        camera_movement_estimator.add_adjust_positions_to_tracks(tracks,camera_movement_per_frame)


        # View Trasnformer
        view_transformer = ViewTransformer()
        view_transformer.add_transformed_position_to_tracks(tracks)

        # Interpolate Ball Positions
        tracks["ball"] = tracker.interpolate_ball_positions(tracks["ball"])

        # Speed and distance estimator
        speed_and_distance_estimator = SpeedAndDistance_Estimator()
        speed_and_distance_estimator.add_speed_and_distance_to_tracks(tracks)

        # Assign Player Teams
        team_assigner = TeamAssigner()
        team_assigner.assign_team_color(video_frames[0], 
                                        tracks['players'][0])
        
        for frame_num, player_track in enumerate(tracks['players']):
            for player_id, track in player_track.items():
                team = team_assigner.get_player_team(video_frames[frame_num],   
                                                     track['bbox'],
                                                     player_id)
                tracks['players'][frame_num][player_id]['team'] = team 
                tracks['players'][frame_num][player_id]['team_color'] = team_assigner.team_colors[team]

        
        # Assign Ball Aquisition
        player_assigner = PlayerBallAssigner()
        team_ball_control = []
        for frame_num, player_track in enumerate(tracks['players']):
            ball_bbox = tracks['ball'][frame_num][1]['bbox']
            assigned_player = player_assigner.assign_ball_to_player(player_track, ball_bbox)

            if assigned_player != -1:
                tracks['players'][frame_num][assigned_player]['has_ball'] = True
                team_ball_control.append(tracks['players'][frame_num][assigned_player]['team'])
            else:
                if not team_ball_control:  # Handle first frame with no assignment
                    team_ball_control.append(1)  # Default to team 1
                else:
                    team_ball_control.append(team_ball_control[-1])
        team_ball_control = np.array(team_ball_control)


        # Draw output 
        ## Draw object Tracks
        output_video_frames = tracker.draw_annotations(video_frames, tracks, team_ball_control)

        ## Draw Camera movement
        output_video_frames = camera_movement_estimator.draw_camera_movement(output_video_frames, camera_movement_per_frame)

        ## Draw Speed and Distance
        speed_and_distance_estimator.draw_speed_and_distance(output_video_frames, tracks)

        # Save video
        save_video(output_video_frames, output_path)
        print(f"Processing complete! Video saved to {output_path}")
        return True
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Traceback:")
        traceback.print_exc()
        return False

if __name__ == '__main__':
    # Check if input video path is provided as command line argument
    input_video_path = sys.argv[1] if len(sys.argv) > 1 else None
    success = main(input_video_path)
    
    if not input_video_path:
        # Only wait for input if running directly (not from API)
        print("\nPress Enter to exit...")
        input()