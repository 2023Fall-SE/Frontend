import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from "../../auth/AuthContext";
import {
  Typography,
  TextField,
  Button,
  Container,
  FormControl,
  Input,
  Select,
  MenuItem,
  Grid,
  Box, Paper, Divider, InputAdornment, InputLabel,
} from '@mui/material';
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const CarpoolLaunch = () => {
  const { isLoaded, userToken} = useAuth();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [launchCarpool, setLaunchCarpool] = useState(false);
  const [launchResult, setLaunchResult] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [isSelfDrive, setIsSelfDrive] = useState(true);
  const driveOptions = [
    { value: true, label: '發起人自駕' },
    { value: false, label: '非自駕' },
  ];
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [otherLocate, setOtherLocate] = useState('');
  const [otherLocations, setOtherLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/';
  const urlInitiateCarpool = url + '/initiate-carpool-event';

  const printOtherLocations = () => {
    return otherLocations.map((item) => (
      <div key={item}>
        <p>地點：{item}</p>
      </div>
    ));
  };

  const handleLaunchClick = () => {
    const target = {
      user_id: userToken.user_id,
      start_time: selectedDate,
      self_drive_or_not: isSelfDrive,
      number_of_people: numberOfPeople,
      start_location: start,
      end_location: end,
      other_location: otherLocations,
    };

    fetch(urlInitiateCarpool, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(target),
    })
      .then((response) => response.json())
      .then((responseText) => {
        setLaunchResult(responseText);
        console.log(responseText);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOtherLocation = () => {
    if (otherLocate.trim() === '')
      alert('欄位不可為空');
    else if (otherLocations.includes(otherLocate)) 
      alert('已存在此地點');
    else {
      setOtherLocations([...otherLocations, otherLocate]);
      setOtherLocate("");
    }
  };  
  const HandleResultOfReturn= () => {
  
    return(
      <dev>
        {launchResult.detail === '無駕照' && <p>您還沒認證駕照,請改用非自駕或認證駕照</p>}
        { launchResult.event_id && <p>發起成功 行程id為 : { launchResult.event_id } </p>}
      </dev>
    )
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(dayjs());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDate.format('A HH:mm:ss').replace('AM', '上午').replace('PM', '下午');;

  return (
    <Container style={{ marginTop: 20 }}>
      <Paper elevation={3} className="search-container" style={{ padding: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          發起共乘
          user_id: {userToken ? userToken.user_id : "未登入"}
        </Typography>
        <Typography margin-bottom="10px">現在時間: {formattedDate}</Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Add your form submission logic here
            handleLaunchClick();
          }}
          autoComplete="on"
        >
          <hr />
          <Box mt={3}>
            <Typography variant="h5">Select Date and Time</Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="日期和時間"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(props) => (
                <TextField
                  {...props}
                  fullWidth
                  placeholder="日期和時間"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">📅</InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </LocalizationProvider>
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="輸入起始地點"
                variant="outlined"
                fullWidth
                margin="normal"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="輸入結束地點"
                variant="outlined"
                fullWidth
                margin="normal"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="請輸入共乘人數"
                variant="outlined"
                fullWidth
                margin="normal"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
              >
                {
                  [2,3,4,5,6,7].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))
                }
              </TextField>
              
                
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="請輸入共乘方式"
                variant="outlined"
                fullWidth
                margin="normal"
                value={isSelfDrive}
                onChange={(e) => setIsSelfDrive(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🚗</InputAdornment>
                  ),
                }}
              >
                {driveOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          
          <hr />
          <Typography>提醒：請根據您行使的路線依序新增停靠站</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Input
                  id="other_loc"
                  placeholder="輸入中途地點"
                  value={otherLocate}
                  onChange={(e) => setOtherLocate(e.target.value)}
                  startAdornment={<InputAdornment position="start">🚕</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleOtherLocation}>
                新增
              </Button>
            </Grid>
          </Grid>
          <Typography>已新增中間上下車地點：</Typography>
          {printOtherLocations()}
          <hr />
          <Button variant="contained" color="primary" type="submit">
            發起共乘
          </Button>
        </form>
      </Paper>
      {HandleResultOfReturn()}
    </Container>
  )
};

export default CarpoolLaunch;