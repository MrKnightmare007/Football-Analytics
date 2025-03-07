import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';
import JobsList from './pages/JobsList';
import FootballFieldBackground from './components/FootballFieldBackground';
import './App.css';

// Create a theme with football colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5', // Blue for team 1
    },
    secondary: {
      main: '#e53935', // Red for team 2
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    field: {
      main: '#4caf50', // Green for football field
      dark: '#388e3c',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <FootballFieldBackground>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/results/:jobId" element={<Results />} />
                <Route path="/jobs" element={<JobsList />} />
              </Routes>
            </FootballFieldBackground>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;