import React from 'react';
import { Box } from '@mui/material';

const FootballFieldBackground = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: 'linear-gradient(to bottom, #4caf50, #388e3c)',
        backgroundSize: 'cover',
        minHeight: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          zIndex: 1,
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: 2,
          padding: 3,
          margin: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default FootballFieldBackground;