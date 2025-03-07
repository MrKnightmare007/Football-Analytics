import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, mt: 'auto' }}>
      <Typography variant="body2" align="center">
        {'© '}
        {new Date().getFullYear()}
        {' Football Analytics. All rights reserved. '}
        <Link color="inherit" href="https://github.com">
          GitHub
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;