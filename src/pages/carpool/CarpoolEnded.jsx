import React, { useEffect, useState } from "react";
import {Box, Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import CarpoolCard from './CarpoolCard';

export const CarpoolEnded = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [carpoolMoney, setCarpoolMoney] = useState(0);

  const mockResult = [
    {
      id: 1,
      launcher: 'John',
      route : ["台北","桃園","新竹"],
      num : 3,
      time: '2021/08/01 12:00',
      carpool_attribute: "Uber",
      "共乘費用": 30,
    },
    {
      id: 2,
      launcher: 'Selina',
      route : ["台北","桃園","新竹"],
      num: 2,
      time: '2022/09/01 12:00',
      carpool_attribute: "Uber",
      "共乘費用": 70,
    },
    {
      id: 3,
      launcher: '',
      route : ["淡水","北車","古亭","公館","新店"],
      num : 3,
      time: '2021/08/01 12:00',
      carpool_attribute: "發起人自駕",
      "共乘費用": 60,
    },
  ];
  
  const fetchJoinedEvents = async (prop) => {
    try {
      const userID = prop==null?1:prop;
      const searchJoinedEvent=`http://127.0.0.1:8000/search-joined-event?user_id=${userID}`;
      const response = await fetch(searchJoinedEvent);
      const data = await response.json();

      if (data.result !== "None" && Object.keys(data).length > 0) {
        const formattedData = data.map(item => ({
          id: item.id,
          launcher: item.initiator.toString(),
          route: item.location.split(',').filter(part => part.trim() !== ''),
          num: item.number_of_people,
          time: item.start_time,
          carpool_attribute: item.is_self_drive ? "發起人自駕" : "非自駕",
          "共乘費用": item.id * 30,
        }));
        setJoinedEvents(formattedData);
      } else {
        setJoinedEvents(mockResult);
      }
    } catch (error) {
      console.error('Error fetching event information:', error);
      // Handle error here, set joinedEvents to empty or show a message
      setJoinedEvents([]);
    }
  };

  useEffect(() => {
    setCarpoolMoney(100);
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // get Event Data
    fetchJoinedEvents();
    return () => clearInterval(intervalId);
    }, []); // Transport one empty tuple as second parameter to insure useEffect as Component only work once
    
  const formattedDate = currentDate.toLocaleTimeString();

  return (
    <Container style={{ marginTop: 20 }}>
      <Paper elevation={3} className="search-container" style={{padding: 20 }}>
        <Typography variant="h4" className="search-title">
          已結束的共乘
        </Typography>
        <Box mt={3} sx={{ marginLeft: 2 }}>
          <Grid container>
            <Grid item>
              <Typography variant="h5">我的Carpool-Money: {carpoolMoney}</Typography>
              <Button variant="contained" color="secondary" onClick={() => fetchJoinedEvents(1)}>
                重新載入
              </Button>
              <Button variant="contained" color="success" onClick={() => fetchJoinedEvents(2)}>
                重新載入
              </Button>
              <Button variant="contained" color="inherit" onClick={() => fetchJoinedEvents(3)}>
                載入測試資料
              </Button>
              <Button variant="contained" color="warning" onClick={() => setJoinedEvents([])}>
                清空
              </Button>
              <Button variant="contained" color="error" onClick={() => setJoinedEvents([])}>
                清空
              </Button>
              <Button variant="contained" color="info" onClick={() => setJoinedEvents([])}>
                清空
              </Button>
              <Button variant="text" color="warning" onClick={() => setJoinedEvents([])}>
                清空
              </Button>
              <Button variant="outlined" color="warning" onClick={() => setJoinedEvents([])}>
                清空
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Divider />

        {joinedEvents.length === 0 && (
          <Typography>沒有搜尋結果</Typography>
        )}
        {joinedEvents.length > 0 && joinedEvents.map((item) => (
          <Box key={item.id} mt={1}>
            <CarpoolCard key={item.id} item={item} cardType="Ended" />
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default CarpoolEnded;
