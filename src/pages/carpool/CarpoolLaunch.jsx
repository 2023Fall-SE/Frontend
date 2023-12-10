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
  Box, Paper, Divider, InputAdornment, InputLabel, Alert,
} from '@mui/material';
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import 'dayjs/locale/zh-tw';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

export const CarpoolLaunch = () => {
  const { isLoaded, userToken} = useAuth();
  const [currentDate, setCurrentDate] = useState(dayjs());
  //const [launchCarpool, setLaunchCarpool] = useState(false);
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
  const [acc_payable, setAcc_Payable] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    date.tz("Asia/Taipei");
    setSelectedDate(date);
  };

  const url = 'http://127.0.0.1:8080';
  const urlInitiateCarpool = url + '/initiate-carpool-event';

  const handleLaunchClick = () => {
    console.log(selectedDate.tz("Asia/Taipei").toLocaleString());
    const target = {
      user_id: userToken.user_id,
      start_time: selectedDate.format(),
      self_drive_or_not: isSelfDrive,
      number_of_people: numberOfPeople,
      start_location: start,
      end_location: end,
      other_location: otherLocations,
    };
    if (acc_payable === '') 
      target.acc_payable = acc_payable;

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
        
        if (responseText.event_id) {
          console.log(`發起成功，id=${responseText.event_id}`);
          
        } else  {
          console.log(responseText);
          switch (responseText.detail) {
            case "無駕照":
              alert("您還沒認證駕照,請改用非自駕或認證駕照");
              break;
            case "日期輸入錯誤":
              alert("日期輸入錯誤, 請重新選取");
              break;
            case "地點不可重複":
              alert("地點不可重複");
              break;
            case "此用戶有未繳清款項":
              alert("用戶有未繳清款項");
              break;
          }
          
        }
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
  
  const onClearClick = () => {
    setSelectedDate(dayjs());
    setStart('');
    setEnd('');
    setNumberOfPeople('');
    setIsSelfDrive(true);
    setLaunchResult('');
    setOtherLocations([]);
  };

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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5">Select Date and Time</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
                <DateTimePicker
                  label="選擇日期和時間"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e)}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required={true}
              label="輸入共乘金額"
              variant="outlined"
              fullWidth
              margin="normal"
              value={acc_payable}
              onChange={(e) => setAcc_Payable(e.target.value)}
            />
          </Grid>
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required={true}
                aria-required={true}
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
                required={true}
                aria-required={true}
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
                required={true}
                aria-required={true}
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
          { otherLocations.length === 0 &&  <div>無中途點</div>}
          { otherLocations.length !== 0 && (
            otherLocations.map((item) => (
              <div key={item}>
                <p>地點：{item}</p>
              </div>
            ))
          )}
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button disabled={launchResult.hasOwnProperty("event_id")} variant="contained" color="primary" type="submit">
                發起共乘
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button 
                onClick={onClearClick} 
                color="secondary" 
                variant="contained" 
              >
                清除表單
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {launchResult.detail === '無駕照' && <p>您還沒認證駕照,請改用非自駕或認證駕照</p>}
              { launchResult.detail === '日期輸入錯誤' && <p> 日期輸入錯誤, 請重新選取</p>}
              { launchResult.event_id &&
                <Alert severity="success">
                  發起成功 行程id為 : { launchResult.event_id }
                </Alert>
              }
            </Grid>
          </Grid>
        </form>
        
      </Paper>
    </Container>
  )
};

export default CarpoolLaunch;