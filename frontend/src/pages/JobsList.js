import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Grid,
  Divider,
  Alert
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import FootballLoader from '../components/FootballLoader';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'queued':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <FootballLoader message="Loading jobs..." />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h3" component="h1" className="page-title">
        Your Processing Jobs
      </Typography>

      {jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4, p: 4, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
          <SportsSoccerIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} className="football-icon" />
          <Typography variant="h5" gutterBottom>
            No jobs found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't uploaded any videos for processing yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/upload"
            sx={{ mt: 2, borderRadius: 4 }}
          >
            Upload a Video
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <Card 
                className="team-card"
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: job.status === 'completed' 
                      ? 'linear-gradient(90deg, #43a047, #66bb6a)' 
                      : job.status === 'processing'
                        ? 'linear-gradient(90deg, #1e88e5, #42a5f5)'
                        : job.status === 'queued'
                          ? 'linear-gradient(90deg, #fb8c00, #ffa726)'
                          : 'linear-gradient(90deg, #e53935, #ef5350)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {job.filename || `Job #${job.id}`}
                    </Typography>
                    <Chip 
                      label={job.status.toUpperCase()} 
                      color={getStatusColor(job.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Submitted: {formatDate(job.created_at)}
                  </Typography>
                  
                  {job.completed_at && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Completed: {formatDate(job.completed_at)}
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      component={RouterLink}
                      to={`/results/${job.id}`}
                      sx={{ borderRadius: 4 }}
                    >
                      View Results
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default JobsList;