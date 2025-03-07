import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  uploadVideo: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  getJobStatus: (jobId) => {
    return axios.get(`${API_URL}/status/${jobId}`);
  },
  
  getAllJobs: () => {
    return axios.get(`${API_URL}/jobs`);
  },
  
  getVideoUrl: (jobId) => {
    return `${API_URL}/video/${jobId}`;
  }
};

export default api;