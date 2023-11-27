import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
  Box,
  Container,
  Divider,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

export const CarpoolSearch = () => {
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  const onSearchClick = () => {
    // Simulating API call
    const apiResult = [
      {
        id: 1,
        launcher: 'John',
        route : ["台北","桃園","新竹"],
        num : 3,
        time: '2021/08/01 12:00',
        carpool_attribute: "Uber",
      },
      {
        id: 2,
        launcher: 'Selina',
        route : ["台北","桃園","新竹"],
        num: 2,
        time: '2022/09/01 12:00',
        carpool_attribute: "Uber",
      },
      {
        id: 3,
        launcher: '',
        route : ["淡水","北車","古亭","公館","新店"],
        num : 3,
        time: '2021/08/01 12:00',
        carpool_attribute: "發起人自駕",
      },
    ];
    setIsSearchClicked(true);
    setSearchResult(apiResult);
  };

  const renderSearchResult = () => {
    return searchResult.map((item) => (
      <Card key={item.id} variant="outlined" className="result-card">
        <CardContent>
          <Typography variant="h6">{item.launcher}</Typography>
          <Typography>{`路線: ${item.route.join(' -> ')}`}</Typography>
          <Typography>{`人數: ${item.num}`}</Typography>
          <Typography>{`時間: ${item.time}`}</Typography>
          <Typography>{`屬性: ${item.carpool_attribute}`}</Typography>
        </CardContent>
        <Divider />
        <Box p={2}>
          <Button variant="contained" color="primary">
            加入共乘
          </Button>
        </Box>
      </Card>
    ));
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Paper elevation={3} className="search-container" style={{padding: 20 }}>
        <Typography variant="h4" className="search-title">
          搜尋共乘
        </Typography>
        <Divider />
        <Grid container spacing={2} className="search-form">
          <Grid item xs={12} md={6}>
            <TextField
              label="上車地點"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="下車地點"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="日期和時間"
                value={currentDate}
                onChange={(date) => setCurrentDate(date)}
                renderInput={(props) => (
                  <TextField {...props} variant="outlined" fullWidth />
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
          {isSearchClicked && searchResult.length === 0 && (
            <Typography>沒有搜尋結果</Typography>
          )}
          {isSearchClicked && searchResult.length > 0 && renderSearchResult()}
        </Box>
      </Paper>
    </Container>
  );
};

export default CarpoolSearch;
