import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card, CardContent,
  Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import Carpooljoinevent from "./CarpoolJoinEvent";
import {useAuth} from "../../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {Nav} from "react-bootstrap";

const CarpoolCard = ({item, cardType, selectedCarpool, onSelect}) => {
  const {userToken} = useAuth();
  const navigate = useNavigate();
  
  // Depends to show Confirm Dialog
  const [dismissConfirm, setDismissConfirm] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  
  const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app';
  const urlDismiss = url+'/dismiss-the-carpool';
  const urlEnd = url+'/end-the-carpool';
  const urlLeave = url+'/leave-the-carpool';
  
  useEffect(() => {
    // console.log(item);  
  }, []);
  function handleDismiss() {
    fetch(urlDismiss, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'event_id': item.id}),
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.result) {
          alert(`解散成功，${responseText.result}`);
          navigate('/ended');
        } else {
          switch (responseText.detail) {
            case "Event已結束":
              alert("此共乘行程已經結束");
              break;
            case "使用者無此權限":
              alert("您不是此共乘發起者，無法取消共乘");
              break;
          }
        }
      }).catch((error) => {
        alert(error);
        console.error(error);
      });
    setDismissConfirm(false);
  }

  function handleEnd() {
    fetch(urlEnd, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'event_id': item.id}),
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.result) {
          alert(`共乘結束成功，${responseText.result}`);
          navigate('/ended');
        } else {
          switch (responseText.detail) {
            case "Event已結束":
              alert("此共乘行程已經結束");
              break;
            case "使用者無此權限":
              alert("您不是此共乘發起者，無法取消共乘");
              break;
          }
        }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
    setEndConfirm(false);
  }

  function handleLeave() {
    fetch(urlLeave, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'event_id': item.id, 'user_id': userToken.user_id}),
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.result) {
          alert(`退出成功，${responseText.result}`);
          navigate('/ended');
        } else {
          switch (responseText.detail) {
            case "Event已結束":
              alert("此共乘行程已經結束");
              break;
            case "使用者無此權限":
              alert("您不是此共乘發起者，無法取消共乘");
              break;
            case "此user不在event":
              alert("您不在此共乘裡");
              break;
          }
        }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
    setLeaveConfirm(false);
  }

  const renderActionButton = () => {
    switch (cardType) {
      case 'Active':
        return (
          <Box p={2}>
            <Grid container spacing={2} alignItems="center" marginBottom='20px'>
              <Grid item>
                <Button variant="contained" color="primary" onClick={onSelect}>
                  加入共乘
                </Button>
              </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={2} alignItems="center" marginTop='1px'>
              <Grid item>
                {selectedCarpool && selectedCarpool.id === item.id && (
                  <Carpooljoinevent
                    itemid={item.id}
                    userid={item.initiator}
                    route={item.route}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        );
      case 'Joined':
        return (
          <Box p={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button onClick = { navigate('/chatroom') } variant="contained" color="primary">
                  共乘聊天室
                </Button>
              </Grid>
                { item.initiator == userToken.user_id? (
                  <React.Fragment>
                    <Grid item>
                      <Button variant="contained" color="warning" onClick={() => setDismissConfirm(true)}>
                        解散共乘
                      </Button>
                    </Grid>
                    <Dialog
                      open={dismissConfirm}
                      onClose={() => setDismissConfirm(false)}
                      aria-labelledby="alert-dismiss-title"
                    >
                      <DialogTitle id="alert-dismiss-title">
                        {"確定解散共乘"}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={() => setDismissConfirm(false)}>取消</Button>
                        <Button onClick={handleDismiss} autoFocus>
                          確定
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Grid item>
                      <Button variant="contained" color="error" onClick={() => setEndConfirm(true)}>
                        結束共乘
                      </Button>
                    </Grid>
                    <Dialog
                      open={endConfirm}
                      onClose={() => setEndConfirm(false)}
                      aria-labelledby="alert-end-title"
                    >
                      <DialogTitle id="alert-end-title">
                        {"確定結束共乘"}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={() => setEndConfirm(false)}>取消</Button>
                        <Button onClick={handleEnd} autoFocus>
                          確定
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </React.Fragment>
                  ):(
                    <React.Fragment>
                      <Grid item>
                        <Button variant="contained" color="error" onClick={() => setLeaveConfirm(true)}>
                          退出共乘
                        </Button>
                      </Grid>
                      <Dialog
                        open={leaveConfirm}
                        onClose={() => setLeaveConfirm(false)}
                        aria-labelledby="alert-leave-title"
                      >
                        <DialogTitle id="alert-leave-title">
                          {"確定結束共乘"}
                        </DialogTitle>
                        <DialogActions>
                          <Button onClick={() => setLeaveConfirm(false)}>取消</Button>
                          <Button onClick={handleLeave} autoFocus>
                            確定
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </React.Fragment>
                  )
                }
            </Grid>
          </Box>
        );
      case 'Ended':
        return (
          <Box p={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button variant="contained" color="primary">
                  我要付款共乘
                </Button>
              </Grid>
              <Grid item>
                <Typography sx={{color: 'red'}}>
                  共乘費用(Carpool-Money): {item["共乘費用"]}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Card key={item.id} variant="outlined" className="result-card">
      <CardContent>
        <Box display="flex">
          <Grid container spacing={2} sx={{flex: '30%'}}>
            <Grid item xs={12}>
              <Typography>{`發起人: ${item.initiator}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`剩餘位置: ${item.available_seats}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`共乘方式: ${item.carpool_attribute}`}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>{`共乘時間: ${item.time}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`共乘路線: ${item.route.join('->')}`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`共乘ID: ${item.id}`}</Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Divider/>
      {renderActionButton()}
    </Card>
  );
};

export default CarpoolCard;
