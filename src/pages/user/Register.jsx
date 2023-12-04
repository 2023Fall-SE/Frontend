import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../auth/AuthContext';
import {Box, Button, Container, Link as MuiLink, Paper, TextField, Typography,} from '@mui/material';

export const Register = () => {
  const url="https://carpool-service-test-cvklf2agbq-de.a.run.app/"
  const url_register = url+"/user"
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [display_name, setDisplay_Name] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const navigate = useNavigate();

  const {isLoading, userToken} = useAuth();

  useEffect(() => {
    if (userToken !== null)
      navigate('/user');
  }, [isLoading]);

  const handleRegister = async () => {
    try {
      let  target = {
        "username": username,
        "password": password,
        "display_name": display_name,
        "phone": phone,
        "mail": mail,
      }
      const response = await fetch(url_register, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: new Headers({
          'accept': 'application/json',
          'Content-Type': 'application/json' // <-- Specifying the Content-Type
        }),
        body: JSON.stringify(target),
      });
      const data = await response.json();
      console.log(data);
      if(response.ok) {
        alert("Register Success!");
        navigate('/Login');
      } else {
        const detail = data.detail;
        if (typeof detail === 'string') {
          alert(`Register Failed:\n${detail}`);
        } else if (Array.isArray(detail)) {
          const errorLines = detail.map(item => `${item.type}: ${item.msg}`)
          alert(`Register Failed: ${response.status}\n` + errorLines.join('\n'));
        } else {
          alert(detail);
        }
      }
    } catch (error) {
      console.log(error);
      alert(error);
      navigate('/register');
    }
  };

  return (
    <Container maxWidth="sm" sx={{marginTop: 8}}>
      <Paper elevation={3} sx={{padding: 4}}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <hr />
        <Box mt={3}>
          <TextField
            fullWidth
            required={true}
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
            required={true}
            aria-required={true}
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            required={true}
            aria-required={true}
            label="display_name"
            type="display_name"
            value={display_name}
            onChange={(e) => setDisplay_Name(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            required={true}
            aria-required={true}
            label="phone"
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            required={true}
            aria-required={true}
            label="mail"
            type="mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={4}>
          <Button fullWidth variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Typography>
            
            <MuiLink component={Link} to="/Login" color="secondary">
              back to login
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
