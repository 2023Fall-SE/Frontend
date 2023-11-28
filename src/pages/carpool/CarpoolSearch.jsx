import { useState ,useEffect } from 'react';
import {NavLink, Outlet, useLoaderData, Link, Form, useNavigate} from "react-router-dom";
import Carpooljoinevent from './CarpoolJoinEvent';

export const CarpoolSearch = () => {

  const url_join = "http://localhost:8000/join-the-carpool";
  const url_find = "http://localhost:8000/find-carpool";
  const url_user = "http://localhost:8000/get-user-info/"; 

  const navigate = useNavigate();

    // = fetch(url);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isJoinedEventclicked, setisJoinedEventClicked] = useState(false);
  
  const [start, setStart] = useState('');
  const [userdata, setuserdata] = useState([]);
  const [end,setEnd] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  /* 
  User token 
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MDEwOTU5MDN9.BOgYG-Z-S4iiozUzxZ3xsRYQ7g2YuTHseb4ZlyKnl28",
  "token_type": "bearer"
   */
  
  //  input start point and end point to find carpool
  const FindCarpool = async( str1,str2) => {

   
    const urlfindCarpool = url_find + '?startLocation=' + str1 + '&endLocation=' + str2;

    fetch( urlfindCarpool, {
            method: "GET",
            headers: new Headers({
                'Content-Type': 'application/json',
                'accept' :  'application/json',
            })
        })
        .then(res => res.json())
        .then(data => {
           console.log(data);
           setuserdata(data);
           
        })
        .catch(e => {
          alert(e);
          /*When the errors happen*/
        })
    
  }

  
  useEffect(() => {

    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);


  }, []); // Transport one empty tuple as second parameter to insure useEimport Contact, {contactAction} from './page/'ffect as Componet only work once
  
  const formattedDate = currentDate.toLocaleTimeString();

  
  // if click search, then search the carpool
  const onSearchClick = () => {
    // API call
    

    setIsSearchClicked(true);
    FindCarpool(start,end);
    //JoinTheCarpoolLoader();
  }
  
  // if click Joined event then set state  ture
  const onJoinClick =() => {

    setisJoinedEventClicked(true);
  }

  

  const renderSearchResult = () => {

    // output drive_attribute
    function printSelfDrive(drive){
      if(drive){
        return "自行駕駛";
      }else{
        return "Uber駕駛";
      }
    }

    // let route add arrow sign 
    function routelist(routearray){
      
      routearray = routearray.substr(1, routearray.length-2);
      
      routearray = routearray.replace(/,/g,"->");
      
      return routearray;
  }

    // print correct time and date format 
    function RouteTimePrint(route){
      
    }
    
    
    
   
    return userdata.map((item) => {
      
      return (
        <div key={item.id}>
          <p>發起人：{item.initiator}</p>
          <p>目前共乘人數：{item.available_seats}</p>
          <p>共乘方式： { printSelfDrive(item.is_self_drive) }</p>
          <p>共乘時間：{item.start_time}</p>
          <p>共乘路線：{routelist(item.location)}</p>
          <p>共乘ID:{item.id}</p>
          <button onClick = {onJoinClick}> 加入共乘</button>
          {isJoinedEventclicked && <p>確定加入</p> && navigate("/" + item.id ,{replace : true})} 
          <hr />
        </div>
      );
    });
    
  }

  return (
    <div>
      <h1>搜尋共乘</h1>
      <hr />
      <p>目前時間 :{formattedDate}</p>
      <label for="startLocation">上車地點：</label>
      <input type="text" id="startLocation" name="startLoca rtion" placeholder="請輸入上車地點"
        value={start}
        onChange={(e) => setStart(e.target.value)}/>
      <br/>
      <br />
      <label for="endLocation">下車地點：</label>
      <input type="text" id="endLocation" name="endLocation" placeholder="請輸入下車地點"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button onClick={onSearchClick}>搜尋</button><br />
      <br />
      <hr />
      <h2>搜尋結果</h2>
      { isSearchClicked && userdata.result === 'None'  && <p>查無符合結果</p>}
      { isSearchClicked && userdata.length > 0 && (renderSearchResult())}
      <script>
      </script>
      <Outlet />
    </div>
  );
};



export default CarpoolSearch;
