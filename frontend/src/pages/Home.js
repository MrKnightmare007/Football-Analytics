import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box 
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Home = () => {
  return (
    <div>
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 6, 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(30, 136, 229, 0.8), rgba(67, 160, 71, 0.8))',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/football-pattern.png)',
            backgroundSize: '200px 200px',
            opacity: 0.1,
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <SportsSoccerIcon sx={{ fontSize: 80, mb: 2 }} className="football-icon" />
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Football Video Analytics
          </Typography>
          <Typography variant="h5" paragraph sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            Upload your football match videos and get advanced analytics including player tracking, 
            team assignment, ball possession, and more.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink} 
            to="/upload"
            startIcon={<UploadFileIcon />}
            sx={{ 
              mt: 2, 
              py: 1.5, 
              px: 4, 
              borderRadius: 4,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Upload Video
          </Button>
        </Box>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        What Our System Can Do
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card className="team-card" sx={{ height: '100%', borderRadius: 3 }}>
          <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <GroupsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom align="center">
                Player Tracking
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our AI system automatically detects and tracks all players on the field throughout the entire match. Each player is assigned a unique ID to maintain consistent tracking.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="team-card" sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SportsSoccerIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom align="center">
                Ball Possession
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track ball possession throughout the match. Our system identifies which player has the ball and calculates possession statistics for each team.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="team-card" sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SpeedIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" component="h3" gutterBottom align="center">
                Speed & Distance
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Calculate player speeds and total distance covered during the match. Identify sprints, average speeds, and compare player movement patterns.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          How It Works
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="center" sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              1. Upload Your Video
            </Typography>
            <Typography variant="body1" paragraph>
              Simply upload your football match video through our easy-to-use interface. We accept MP4, AVI, and MOV formats.
            </Typography>
            
            <Typography variant="h5" component="h3" gutterBottom>
              2. AI Processing
            </Typography>
            <Typography variant="body1" paragraph>
              Our advanced AI system processes your video using:
            </Typography>
            <ul>
              <li>YOLO object detection for players and ball tracking</li>
              <li>K-means clustering for team jersey color identification</li>
              <li>Optical flow for camera movement compensation</li>
              <li>Perspective transformation for accurate distance measurements</li>
            </ul>
            
            <Typography variant="h5" component="h3" gutterBottom>
              3. View Results
            </Typography>
            <Typography variant="body1">
              Once processing is complete, view your enhanced video with player tracking, team assignments, and detailed statistics.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 4, 
              overflow: 'hidden',
              position: 'relative',
              height: 400,
              background: 'linear-gradient(135deg, #43a047, #1e88e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }}
            className="field-pattern"
          >
            <Box 
              sx={{ 
                width: '80%', 
                height: '70%', 
                border: '2px solid rgba(255,255,255,0.7)',
                borderRadius: 2,
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  width: '20%',
                  height: '40%',
                  border: '2px solid rgba(255,255,255,0.7)',
                  left: 0,
                  top: '30%'
                }}
                className="goal-post-left"
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  width: '20%',
                  height: '40%',
                  border: '2px solid rgba(255,255,255,0.7)',
                  right: 0,
                  top: '30%'
                }}
                className="goal-post-right"
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Player dots */}
              {[...Array(10)].map((_, i) => (
                <Box 
                  key={i}
                  sx={{ 
                    position: 'absolute',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: i < 5 ? 'primary.main' : 'secondary.main',
                    top: `${20 + Math.random() * 60}%`,
                    left: `${10 + Math.random() * 80}%`,
                    boxShadow: '0 0 0 2px rgba(255,255,255,0.5)'
                  }}
                />
              ))}
              
              {/* Ball */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  top: '45%',
                  left: '60%',
                  boxShadow: '0 0 0 2px rgba(0,0,0,0.2)'
                }}
                className="football-spin"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box 
        sx={{ 
          textAlign: 'center', 
          mt: 6, 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(67, 160, 71, 0.9), rgba(30, 136, 229, 0.9))',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Analyze Your Football Match?
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          component={RouterLink} 
          to="/upload"
          startIcon={<UploadFileIcon />}
          sx={{ 
            mt: 2, 
            py: 1.5, 
            px: 4, 
            borderRadius: 4,
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            }
          }}
        >
          Upload Now
        </Button>
      </Box>
    </div>
  );
};

export default Home;