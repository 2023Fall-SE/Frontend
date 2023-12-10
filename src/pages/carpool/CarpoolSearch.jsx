import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CarpoolCard from "./CarpoolCard";
import { useAuth } from "../../auth/AuthContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const CarpoolSearch = () => {
  const { isLoaded, userToken } = useAuth();
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedCarpool, setSelectedCarpool] = useState(null);

  const [start, setStart] = useState('');
  const [userdata, setuserdata] = useState([]);
  const [end, setEnd] = useState('');
  const [currentDate, setCurrentDate] = useState(dayjs());

  function routelist(routearray) {
    routearray = routearray.slice(1, -1);
    routearray = routearray.split(',');

    return routearray;
  }

  const FindCarpool = (str1, str2) => {
    const url = "https://carpool-service-test-cvklf2agbq-de.a.run.app/";
    const url_find = url + "find-carpool";
    const urlfindCarpool =
      url_find + '?startLocation=' + str1 + '&endLocation=' + str2;

    fetch(urlfindCarpool, {
      method: "GET",
      headers: new Headers({
        'Authorization': `Bearer ${userToken.access_token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.result !== "None" && Object.keys(data).length > 0) {
          const formattedData = data.map((item) => ({
            id: item.id,
            initiator: item.initiator,
            route: routelist(item.location),
            location: item.location,
            num: item.number_of_people,
            time: item.start_time,
            start_time: item.start_time,
            is_ended: item.end_time != null,
            carpool_attribute: item.is_self_drive
              ? "發起人自駕"
              : "非自駕",
            accounts_payable: item.accounts_payable,
            available_seats: item.available_seats,
            "共乘費用": item.id * 30,
          })).filter((item) =>
            dayjs(item.time).isAfter(currentDate)
          );
          console.log(formattedData);
          setuserdata(formattedData);
        } else {
          setuserdata(data);
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const onSearchClick = () => {
    setIsSearchClicked(true);
    FindCarpool(start, end, currentDate);
  };

  const renderSearchResult = () => {
    const ongoingEvent =userdata.filter(item => item.is_ended===false)
    return ongoingEvent.map((item) => (
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
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Paper elevation={3} className="search-container" style={{ padding: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          搜尋共乘
          User : {userToken ? userToken.user_display_name : "未登入"}
        </Typography>
        <Divider />
        <Grid container spacing={2} className="search-form">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="上車地點"
              onChange={(e) => setStart(e.target.value)}
              InputProps={{
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position="start">🚗</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="下車地點"
              onChange={(e) => setEnd(e.target.value)}
              InputProps={{
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position="start">🚕</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="日期和時間"
                value={currentDate}
                onChange={(date) => setCurrentDate(date)}
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
        <hr />
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

export default CarpoolSearch;
