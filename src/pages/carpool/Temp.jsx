import React, {useEffect, useState} from 'react';
import {Outlet} from "react-router-dom";
import Carpooljoinevent from './CarpoolJoinEvent';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Input,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import CarpoolCard from "./CarpoolCard";
import { useAuth } from "../../auth/AuthContext";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { useAutocomplete } from '@mui/base/useAutocomplete';
import dayjs from "dayjs";


export const Temp = () => {

  const url_join = "http://localhost:8000/join-the-carpool";
  const url_user = "http://localhost:8000/get-user-info/";

  const { isLoaded, userToken} = useAuth();
  
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isJoinedEventclicked, setisJoinedEventClicked] = useState([]);
  const [selectedCarpool, setSelectedCarpool] = useState(null);

  const [start, setStart] = useState('');
  const [userdata, setuserdata] = useState([]);
  const [end, setEnd] = useState('');
  const [currentDate, setCurrentDate] = useState(dayjs());

  /* 
  User token 
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MDEwOTU5MDN9.BOgYG-Z-S4iiozUzxZ3xsRYQ7g2YuTHseb4ZlyKnl28",
  "token_type": "bearer"
   */

  // let route add arrow sign 
  function routelist(routearray) {
    routearray = routearray.slice(1, -1);
    routearray = routearray.split(',');

    return routearray;
  }

  //  input start point and end point to find carpool
  const FindCarpool = (str1, str2) => {
    const url_find = "http://localhost:8000/find-carpool";
    const urlfindCarpool = url_find + '?startLocation=' + str1 + '&endLocation=' + str2;
    
    fetch(urlfindCarpool, {
      method: "GET",
      headers: new Headers({
        'Content-Type': 'application/json',
        'accept': 'application/json',
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.result !== "None" && Object.keys(data).length > 0) {
          const formattedData = data.map(item => ({
            id: item.id,
            launcher: item.initiator,
            route: routelist(item.location),
            location: item.location,
            num: item.number_of_people,
            time: item.start_time,
            start_time: item.start_time,
            is_ended: item.end_time != null,
            carpool_attribute: item.is_self_drive ? "發起人自駕" : "非自駕",
            accounts_payable: item.accounts_payable,
            available_seats: item.available_seats,
            "共乘費用": item.id * 30,
          })).filter((item) => dayjs(item.time).isAfter(currentDate));
          console.log(formattedData);
          setuserdata(formattedData);
        } else {
          setuserdata(data);
        }
      })
      .catch(e => {
        alert(e);
        /*When the errors happen*/
      })

  }
  

  // if click search, then search the carpool
  const onSearchClick = () => {
    // API call
    setIsSearchClicked(true);
    FindCarpool(start, end, currentDate);
  }

  const renderSearchResult = () => {
    //{isJoinedEventclicked && <p>確定加入</p> && navigate("/" + item.id + "," + item.initiator  ,{replace : true})}
    return userdata.map((item) => (
      <Box key={item.id} mt={1}>
        <Stack>
          <CarpoolCard 
            item={item} 
            cardType="Active"
            selectedCarpool={selectedCarpool}
            onSelect={() => setSelectedCarpool(item)}
          ></CarpoolCard>
          
        </Stack>
      </Box>
    ));
  }

  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} className="search-container" style={{padding: 20}}>
        <Typography variant="h4" style={{marginBottom: 20}}>
          搜尋共乘
          user_id: {userToken ? userToken.user_id : "未登入"}
        </Typography>
        <Divider/>
        <Grid container spacing={2} className="search-form">
          <Grid item xs={12} md={6}>
            <Input
              fullWidth
              placeholder="上車地點"
              onChange={(e) => setStart(e.target.value)}
              inputProps={{ autoComplete: 'off' }}
              startAdornment={<InputAdornment position="start">🚗</InputAdornment>}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              fullWidth
              placeholder="下車地點"
              onChange={(e) => setEnd(e.target.value)}
              inputProps={{ autoComplete: 'off' }}
              startAdornment={<InputAdornment position="start">🚕</InputAdornment>}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="日期和時間"
                value={currentDate}
                onChange={(date) => setCurrentDate(date)}
                renderInput={(props) => (
                  <Input
                    {...props}
                    fullWidth
                    placeholder="日期和時間"
                    startAdornment={<InputAdornment position="start">📅</InputAdornment>}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onSearchClick}
            >
              搜尋
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <Box mt={3}>
          <Typography variant="h5">搜尋結果</Typography>
        </Box>
        {isSearchClicked && userdata.result === 'None' && (
          <Typography>沒有搜尋結果</Typography>
        )}
        {isSearchClicked && userdata.length > 0 && renderSearchResult()}
      </Paper>
    </Container>
  );
};


export default Temp;