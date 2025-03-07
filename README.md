# Football Analysis Project

## Introduction
This project delivers a comprehensive football video analysis system that leverages advanced computer vision and machine learning techniques to extract valuable insights from match footage. At its core, the system employs YOLO (You Only Look Once), a state-of-the-art object detection model, to identify and track players, referees, and the ball with high precision throughout the video.

The analysis pipeline includes sophisticated team assignment using K-means clustering to segment and classify players based on jersey colors, enabling accurate team-based statistics. Our implementation of optical flow algorithms compensates for camera movement between frames, ensuring reliable player tracking regardless of camera panning or zooming.

A key innovation is the integration of perspective transformation, which converts pixel-based measurements to real-world distances, allowing for precise calculation of player movement in meters rather than screen coordinates. This enables accurate speed calculations and distance coverage metrics for each player throughout the match.

The system culminates in a modern, intuitive web interface built with React and Material-UI, providing users with an elegant dashboard to upload videos, monitor processing status, and explore the resulting analytics. Interactive visualizations display player tracking, possession statistics, and movement patterns, making complex data accessible to coaches, analysts, and football enthusiasts.

This project bridges sophisticated computer vision algorithms with practical sports analytics, offering valuable tools for performance analysis while serving as an educational resource for those interested in applied machine learning and computer vision.

![Screenshot](https://i.ibb.co/HTTNzBRH/Screenshot-2025-03-07-220838.png)

## Modules Used
The following modules are used in this project:
- YOLO: AI object detection model
- Kmeans: Pixel segmentation and clustering to detect t-shirt color
- Optical Flow: Measure camera movement
- Perspective Transformation: Represent scene depth and perspective
- Speed and distance calculation per player

## Frontend
The project includes a modern, responsive web interface built with:
- React.js
- Material-UI components
- Interactive data visualizations
- Video playback with tracking overlays
- Football-themed UI elements and animations

![Screenshot](https://i.ibb.co/d0fK3NP5/Screenshot-2025-03-07-224229.png)
![Screenshot](https://i.ibb.co/99cz39bd/Screenshot-2025-03-07-224239.png)
![Screenshot](https://i.ibb.co/20mPw2QY/Screenshot-2025-03-07-224254.png)
![Screenshot](https://i.ibb.co/hRWnvRkV/Screenshot-2025-03-07-224035.png)
## Trained Models
- [Trained Yolo v5](https://drive.google.com/file/d/1DC2kCygbBWUKheQ_9cFziCsYVSRw6axK/view?usp=sharing)

## Sample video
-  [Sample input video](https://drive.google.com/file/d/1t6agoqggZKx6thamUuPAIdN_1zR9v9S_/view?usp=sharing)

## Requirements
To run this project, you need to have the following requirements installed:
- Python 3.x
- ultralytics
- supervision
- OpenCV
- NumPy
- Matplotlib
- Pandas