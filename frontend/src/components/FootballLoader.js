import React from 'react';
import { Box, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import footballAnimation from '../assets/football-animation.json';

const FootballLoader = ({ message = "Loading..." }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 4
      }}
    >
      <Box sx={{ width: 200, height: 200 }}>
        <Lottie 
          animationData={footballAnimation} 
          loop={true} 
          autoplay={true}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default FootballLoader;