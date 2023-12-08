import React, {useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthContext";
import {Box, Container, Divider, Paper, Typography, Button} from "@mui/material";
import CarpoolCard from "./CarpoolCard";

export const CarpoolJoined = () => {
  const {isLoading, userToken} = useAuth();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const url = 'http://127.0.0.1:8080';
  // const url = 'http://127.0.0.1:8000';

  const mockResult = [
    {
      id: 1,
      initiator: 'John',
      route: ["台北", "桃園", "新竹"],
      num: 3,
      time: '2021/08/01 12:00',
      is_ended: true,
      carpool_attribute: "Uber",
      "共乘費用": 30,
    },
    {
      id: 2,
      initiator: 'Selina',
      route: ["台北", "桃園", "新竹"],
      num: 2,
      time: '2022/09/01 12:00',
      is_ended: true,
      carpool_attribute: "Uber",
      "共乘費用": 70,
    },
    {
      id: 3,
      initiator: '',
      route: ["淡水", "北車", "古亭", "公館", "新店"],
      num: 3,
      time: '2021/08/01 12:00',
      is_ended: true,
      carpool_attribute: "發起人自駕",
      "共乘費用": 60,
    },
  ];

  const fetchJoinedEvents = async () => {
    if (!isLoading && userToken) {
      try {
        const userID = userToken.user_id;
        const searchJoinedEvent = url+`/search-joined-event?user_id=${userID}`;
        const response = await fetch(searchJoinedEvent, {
          method: 'get',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            'Authorization': `Bearer ${userToken.access_token}`,
          })
        });
        const data = await response.json();
        console.log(data);
        if (data.result !== "None" && Object.keys(data).length > 0) {
          const formattedData = data.map(item => ({
            id: item.id,
            initiator: item.initiator.toString(),
            route: item.location.split(',').filter(part => part.trim() !== ''),
            joiner: item.joiner,
            num: item.number_of_people,
            time: item.start_time,
            is_ended: item.end_time != null,
            available_seats: item.available_seats,
            carpool_attribute: item.is_self_drive ? "發起人自駕" : "非自駕",
            status: item.status,
          }));
          setJoinedEvents(formattedData);
        } else {
          // setJoinedEvents(mockResult);
          setJoinedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching event information:', error);
        // Handle error here, set joinedEvents to empty or show a message
        setJoinedEvents([]);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    fetchJoinedEvents();
    return () => clearInterval(intervalId);
  }, [userToken]); // Transport one empty tuple as second parameter to insure useEffect as Componet only work once

  const formattedDate = currentDate.toLocaleTimeString();

  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} className="search-container" style={{padding: 20}}>
        <Typography variant="h4" className="search-title" style={{marginBottom: 20}}>
          已加入的共乘
        </Typography>
        <hr />
        <Box style={{marginTop: 10}}>
          {joinedEvents.filter(item => !item.is_ended).length === 0 && (
            <Typography>沒有搜尋結果</Typography>
          )}
          {joinedEvents.length > 0 && joinedEvents.map((item) => (
            item.is_ended === false &&
            <Box key={item.id} mt={1}>
              <CarpoolCard key={item.id} item={item} cardType="Joined"/>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CarpoolJoined;
