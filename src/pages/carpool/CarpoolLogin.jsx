import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Link as MuiLink,
} from '@mui/material';

export const CarpoolLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { userToken, login } = useAuth();
  
  useEffect( () => {
    if(userToken !== null)
      navigate('/user');
  });
  
  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate('/search');
    } catch (error) {
      console.error('Error during login:', error);
      navigate('/Login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Carpol Service System
        </Typography>
        <Box mt={3}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={4}>
          <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
            Sign in
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Typography>
            If you are not a member, please{' '}
            <MuiLink component={Link} to="/loginstate/ended" color="secondary">
              REGISTER HERE
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CarpoolLogin;
