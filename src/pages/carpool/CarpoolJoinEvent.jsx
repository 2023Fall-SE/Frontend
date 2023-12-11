import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useAuth} from "../../auth/AuthContext";


export const Carpooljoinevent = ({itemid, initiatorID, route}) => {
  

  const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  //const url = 'http://127.0.0.1:8080';
  const url_get_usr_info = url+"/get-user-info/";
  const url_join_the_carpool = url+"/join-the-carpool"
  // const url_get_usr_info = "http://localhost:8000/get-user-info/";
  // const url_join_the_carpool = "http://localhost:8000/join-the-carpool"

  //loader function 
  const {userToken, isLoading} = useAuth();
  const [JoinedEvent, setJoinedevent] = useState(false);
  const [Event, setEvent] = useState(false);
  const [EventStart, setEventstart] = useState();
  const [Eventdata, setEventdata] = useState([]);
  const [BadEventData, setBadEventdata] = useState([]);
  const [Successfuldata, setSuccesfuldata] = useState([]);

  useEffect(() => {

    JoinTheCarpoolLoader();

  }, []);

  const location = useLocation();

  const JoinTheCarpoolLoader = () => {

    const target = {
      "event_id": itemid,
      "user_id": userToken.user_id,
      "start_loc": route[0],
      "end_loc": route[route.length-1],
    }
    console.log(target);

    fetch(url_join_the_carpool, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: new Headers({
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json' // <-- Specifying the Content-Type
      }), 
      body: JSON.stringify(target),
    }) // <-- Post Parameters
      .then((response) => response.json())
      .then((responseText) => {
        //console.log(responseText);
        setEvent(true);
        setEventdata(responseText);
        console.log(responseText);

        //alert(responseText);
      })
      .catch((error) => {

        setBadEventdata(error);
        console.log(error);
        console.error(error);
      });

  }

  const Eventhandle = () => {

    return (
      <div>
        {Eventdata.detail === "位子不夠" && <h2>位子不夠:無法加入行程</h2>}
        {Eventdata.detail === "此用戶有未繳清款項" && <h2>用戶有未繳清款項:無法加入行程</h2>}
        {Eventdata.detail === "無此Event" && <h2>找不到此行程</h2>}

        {Eventdata.detail === "使用者已在此Event" && <h2> 您已在此Carpool行程</h2>}
        {Eventdata.result === "success" && <h2>成功加入行程</h2>}
      </div>
    );
  }
  

  return (
    <div>
      <h2>加入結果</h2>
      <br/>
      {Event && (Eventhandle())}
      <p></p>
    </div>

  );
}

export default Carpooljoinevent;