import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card, CardContent, Checkbox,
  Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Divider, FormControlLabel,
  Grid, TextField,
  Typography,
} from '@mui/material';
import Carpooljoinevent from "./CarpoolJoinEvent";
import {useAuth} from "../../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {Nav} from "react-bootstrap";
import dayjs from "dayjs";

const CarpoolCard = ({item, cardType, selectedCarpool, onSelect}) => {
  const {userToken} = useAuth();
  const navigate = useNavigate();
  
  const [payable, setPayable] = useState(-1);
  const [wallet, setWallet] = useState(-1);
  const [useCarpoolMoney, setUseCarpoolMoney] = useState(false);
  // Depends to show Confirm Dialog
  const [dismissConfirm, setDismissConfirm] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [payConfirm, setPayConfirm] = useState(false);
  
  const url = 'http://127.0.0.1:8080';
  const urlDismiss = url+'/dismiss-the-carpool';
  const urlEnd = url+'/end-the-carpool';
  const urlLeave = url+'/leave-the-carpool';
  const urlPayable = url+`/payable`;
  const urlPayment = url+`/payment/${userToken.user_id}?eventid=${item.id}`;
  
  useEffect(() => {
    if( item.status === "end" ){
      fetchPayable();
    }
  }, []);
  
  function fetchPayable() {
    fetch(urlPayment, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.hasOwnProperty('payable')) {
          setPayable(responseText.payable);
          setWallet(responseText.carpool_money);
        } else {
          switch (responseText.detail) {
            case "無此共乘事件":
              alert("無法載入共乘資料：無此共乘事件");
              break;
            case "使用者無此權限":
              alert("使用者沒有查詢其他人payment權限");
              break;
            case "無此使用者":
              alert("無用戶資料，請重新登入");
              navigate('/ended');
              break;
            case "無此付款欄位":
              setWallet('無此付款欄位');
              break;
            default:
              alert("CarpoolEnd fetchWallet error");
          }
        }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
  }
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
            case "":
              alert(`responseText.detail:${responseText.detail}`);
              navigate('/ended');
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

  function handlePay() {
    fetch(urlPayable+`/?userid=${userToken.user_id}&eventid=${item.id}&useCarpoolmoney=${useCarpoolMoney}` , {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'userid':userToken.user_id,
        'eventid': item.id,
        'useCarpoolmoney': useCarpoolMoney,
      }),
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.payment_url) {
          window.location.replace(responseText.payment_url);
        } else {
          switch (responseText.detail) {
            case "使用者無此權限":
              alert("使用者沒有payable權限");
              break;
            case "無此使用者":
              alert("無用戶資料，請重新登入");
              navigate('/ended');
              break;
            case "無此共乘事件":
              alert("無法載入共乘資料：無此共乘事件");
              break;
            case "無此付款欄位":
              alert("無此付款欄位");
              break;
            case "此用戶已完成付款":
              alert("此用戶已完成付款");
              break;
            case "此用戶有未繳清款項":
              alert("此用戶有未繳清款項");
              break;
          }
        }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
    setPayConfirm(false);
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
                <Button variant="contained" color="primary">
                  共乘聊天室
                </Button>
              </Grid>
                { item.initiator == userToken.user_id? (
                  <React.Fragment>
                    {!dayjs(item.time).isBefore(dayjs()) && (
                      <Grid item>
                        <Button
                          variant="contained"
                          color="warning"
                          disabled={dayjs(item.time).isBefore(dayjs())}
                          onClick={() => setDismissConfirm(true)}
                        >
                          解散共乘
                        </Button>
                      </Grid>
                    )}
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
                    { dayjs(item.time).isBefore(dayjs()) && (
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          disabled={!dayjs(item.time).isBefore(dayjs())}
                          onClick={() => setEndConfirm(true)}
                        >
                          結束共乘
                        </Button>
                      </Grid>
                    )}
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
        if (item.status === "end")
          return (
            <Box p={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => setPayConfirm(true)}>
                    我要付款共乘
                  </Button>
                  <Dialog
                    open={payConfirm}
                    onClose={() => setLeaveConfirm(false)}
                    aria-labelledby="alert-leave-title"
                  >
                    <DialogTitle id="alert-leave-title">
                      {"確定付款共乘"}
                    </DialogTitle>
                    <DialogContent>
                      <Typography>
                        預計付款金額：{useCarpoolMoney?payable-wallet:payable}
                      </Typography>
                      <FormControlLabel
                        label="使用 Carpool-Money"
                        control={
                        <Checkbox
                          checked={useCarpoolMoney}
                          onChange={(e) => {setUseCarpoolMoney(e.target.checked);}}
                        />
                      } 
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setPayConfirm(false)}>取消</Button>
                      <Button onClick={handlePay} autoFocus>
                        確定
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item>
                  <Typography sx={{color: 'red'}}>
                    共乘費用(Carpool-Money): {payable}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          );
        else if (item.status === "dismiss")
          return (
            <Box p={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Typography sx={{color: 'red'}}>
                    此共乘已解散
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
              <Typography>{`目前共乘人數: （${item.num-item.available_seats}/${item.num}）`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{`共乘方式: ${item.carpool_attribute}`}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>{`共乘時間: ${(item.time)}`}</Typography>
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
