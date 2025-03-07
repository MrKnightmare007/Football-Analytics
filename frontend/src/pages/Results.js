import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Alert, 
  Card, 
  CardContent,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import FootballLoader from '../components/FootballLoader';

const Results = () => {
  const { jobId } = useParams();
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/status/${jobId}`);
        setJobStatus(response.data);
        setLoading(false);

        // If job is still processing, poll for updates
        if (response.data.status === 'processing' || response.data.status === 'queued') {
          setTimeout(fetchStatus, 5000); // Poll every 5 seconds
        }
      } catch (err) {
        console.error('Error fetching job status:', err);
        setError('Failed to fetch job status');
        setLoading(false);
      }
    };

    fetchStatus();
  }, [jobId]);

  const handleDownload = () => {
    window.open(`http://localhost:5000/api/video/${jobId}`, '_blank');
  };

  if (loading) {
    return <FootballLoader message="Loading job status..." />;
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
        Video Processing Results
      </Typography>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Card sx={{ mb: 4, overflow: 'hidden' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Job Status: {jobStatus.status.charAt(0).toUpperCase() + jobStatus.status.slice(1)}
            </Typography>
            
            {jobStatus.status === 'queued' && (
              <Alert severity="info">
                Your video is in the processing queue. Please wait...
              </Alert>
            )}
            
            {jobStatus.status === 'processing' && (
              <Box sx={{ mt: 2 }}>
                <FootballLoader message="Your video is being processed. This may take several minutes depending on the video length." />
              </Box>
            )}
            
            {jobStatus.status === 'completed' && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Video processing completed successfully!
                </Alert>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{ borderRadius: 4, py: 1.5, px: 3 }}
                >
                  Download Processed Video
                </Button>
                
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  The processed video includes player tracking, team assignments, ball possession statistics, and more.
                </Typography>
              </Box>
            )}
            
            {jobStatus.status === 'failed' && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Video processing failed. Please try again or contact support.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Results;