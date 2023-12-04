import React, {useEffect, useState} from "react";
import {Box, Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import CarpoolCard from './CarpoolCard';
import {useAuth} from "../../auth/AuthContext";


export const CarpoolEnded = () => {
  const {isLoading, userToken} = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endedEvents, setEndedEvents] = useState([]);
  const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/';
  // const url = 'http://127.0.0.1:8000';

  const [carpoolMoney, setCarpoolMoney] = useState(null);

  const mockResult = [
    {
      id: 1,
      launcher: '測試資料一',
      route: ["台北", "桃園", "新竹"],
      num: 3,
      time: '2021/08/01 12:00',
      is_ended: true,
      carpool_attribute: "Uber",
      available_seats: 99,
      "共乘費用": 30,
    },
    {
      id: 2,
      launcher: '測試資料二',
      route: ["台北", "桃園", "新竹"],
      num: 2,
      time: '2022/09/01 12:00',
      is_ended: true,
      carpool_attribute: "Uber",
      available_seats: 99,
      "共乘費用": 70,
    },
    {
      id: 3,
      launcher: '測試資料三',
      route: ["淡水", "北車", "古亭", "公館", "新店"],
      num: 3,
      time: '2021/08/01 12:00',
      is_ended: true,
      carpool_attribute: "發起人自駕",
      available_seats: 99,
      "共乘費用": 60,
    },
  ];

  const fetchEndedEvents = async () => {
    if (!isLoading && userToken) {
      try {
        const userID = userToken.user_id;
        const searchEndedEvent = url+`/search-joined-event?user_id=${userID}`;
        const response = await fetch(searchEndedEvent, {
          method: 'get',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            'Authorization': `Bearer ${userToken.access_token}`,
          })
        });
        const data = await response.json();

        if (data.result !== "None" && Object.keys(data).length > 0) {
          const formattedData = data.map(item => ({
            id: item.id,
            launcher: item.initiator.toString(),
            route: item.location.split(',').filter(part => part.trim() !== ''),
            num: item.number_of_people,
            time: item.start_time,
            is_ended: item.end_time != null,
            carpool_attribute: item.is_self_drive ? "發起人自駕" : "非自駕",
            "共乘費用": item.id * 30,
          }));
          setEndedEvents(formattedData);
        } else if (data.result === "None") {
          setEndedEvents([]);
        } else {
          setEndedEvents(mockResult);
        }
      } catch (error) {
        console.error('Error fetching event information:', error);
        // Handle error here, set endedEvents to empty or show a message
        setEndedEvents([]);
      }
    }
  };

  const fetchBalance = async () => {
    if (!isLoading && userToken) {
      try {
        const userID = userToken.user_id;
        const searchBalance = url+`/payment/${userID}`;
        const response = await fetch(searchBalance, {
          method: 'get',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            'Authorization': `Bearer ${userToken.access_token}`,
            'Content-Type': 'application/json'
          }),
        });
        const data = await response.json();

        if (Object.keys(data).length > 0) {
          setCarpoolMoney(data.account);
          return data.user_id;
        } else {
          setCarpoolMoney("null")
          return 0;
        }
      } catch (error) {
        console.error('Error fetching event information:', error);
        // Handle error here, set endedEvents to empty or show a message
        setCarpoolMoney("尚未登入")
        return -1;
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // get Event Data
    if (!isLoading && userToken) {
      fetchEndedEvents();
      fetchBalance();
    }
    if (!isLoading && userToken == null) {
      setCarpoolMoney("尚未登入")
      setEndedEvents([])
    }

    return () => clearInterval(intervalId);
  }, [isLoading, userToken]); // Transport one empty tuple as second parameter to insure useEffect as Component only work once

  const formattedDate = currentDate.toLocaleTimeString();


  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} className="search-container" style={{padding: 20}}>
        <Typography variant="h4" className="search-title" style={{marginBottom: 20}}>
          已結束的共乘
        </Typography>
        <hr />

        <Box mt={3} sx={{marginLeft: 2}}>
          <Grid container>
            <Grid item>
              <Typography variant="h5">我的Carpool-Money: {carpoolMoney}</Typography>
            </Grid>
          </Grid>
        </Box>

        {endedEvents.length === 0 && (
          <Typography>沒有搜尋結果</Typography>
        )}
        {endedEvents.length > 0 && endedEvents.map((item) => (
          item.is_ended == true &&
          <Box key={item.id} mt={1}>
            <CarpoolCard key={item.id} item={item} cardType="Ended"/>
          </Box>

        ))}
      </Paper>
      <Box mt={3} sx={{marginLeft: 2}}>
        <Grid container>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => fetchEndedEvents()}>
              重新載入
            </Button>
            <Button variant="contained" color="success" onClick={() => fetchEndedEvents()}>
              重新載入
            </Button>
            <Button variant="contained" color="inherit" onClick={() => setEndedEvents(mockResult)}>
              載入測試資料
            </Button>
            <Button variant="contained" color="warning">
              清空
            </Button>
            <Button variant="contained" color="error">
              清空
            </Button>
            <Button variant="contained" color="info">
              清空
            </Button>
            <Button variant="text" color="warning">
              清空
            </Button>
            <Button variant="outlined" color="warning">
              清空
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CarpoolEnded;
