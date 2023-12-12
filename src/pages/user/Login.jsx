import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../auth/AuthContext';
import {Box, Button, Container, Link as MuiLink, Paper, TextField, Typography,} from '@mui/material';
import { pusher } from "../../pusher_util";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const {isLoading, userToken, login} = useAuth();

  useEffect(() => {
    if (userToken !== null)
      navigate('/user');
  }, [isLoading]);

  const handleLogin = async () => {
    try {
      await login(username, password);
      //Activate pusher 
      pusher(username);
      navigate('/search');
    } catch (error) {
      alert(error);
      navigate('/Login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{marginTop: 8}}>
      <Paper elevation={3} sx={{padding: 4}}>
        <Typography variant="h4" gutterBottom>
          Welcome to Carpool Service System
        </Typography>
        <hr />
        <Box mt={3}>
          <TextField
            fullWidth
            aria-required={true}
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
            aria-required={true}
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
            <MuiLink component={Link} to="/Register" color="secondary">
              REGISTER HERE
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
