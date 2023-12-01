import { useEffect,useState } from "react";
import {NavLink, Outlet, useLoaderData, Link, Form, useNavigate} from "react-router-dom";
// 下拉式選單 人數 , 共乘方式

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
export const CarpoolLaunch = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [launchCarpool,setlaunchCarpool] = useState(false);
  const [launchresult,setlaunchresult] = useState('');
  const [numberOfPeople, setnumberOfPeople] = useState('');
  const [isSelfDrive,setisSelfFrive] = useState(true);
  const [ start,SetStart] = useState('');
  const [ end, SetEnd] = useState('');
  const [ otherlocate,setOtherlocate] = useState('');
  const [ otherlocations, setOtherlocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const url_initiate_carpool = "http://localhost:8000/initiate-carpool-event-ui"



  const PrintOtherLocation=() =>{

    return otherlocations.map((item) => {
      
      return (
        <div key={item.place}>
          <p> 地點：{item.place}</p>
          <hr />
        </div>
      );
    });
  }

  const HandleLaunchclick = () =>{

    var target = {
      "user_id": 1,
      "start_time": selectedDate,
      "self_drive_or_not": true,
      "number_of_people": 6,
      "start_location": "台北",
      "end_location": "桃園",
      "other_location": [
        ""
      ]

    }
    fetch(url_initiate_carpool,{

      method : 'POST' ,
      headers: new Headers({
          'accept' :  'application/json',
          'Content-Type' : 'application/json' // <-- Specifying the Content-Type
      }),body : JSON.stringify(target)
      }) // <-- Post Parameters
      .then((response) => response.json())
      .then((responseText) => {
          //console.log(responseText);
          setlaunchresult(responseText);
          //setEventdata(responseText);
          console.log(responseText);
          
          //alert(responseText);
      })
      .catch((error) => {
          
          console.error(error);
      });

  }


  // store the Otherlocations by click button
  const HandleOtherLocation = () => {

      setOtherlocations([ ...otherlocations,{ place : otherlocate}]);

      console.log(selectedDate);
  }

  useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDate(new Date());
      }, 1000);
  
      
      return () => clearInterval(intervalId);
    }, []); // Transport one empty tuple as second parameter to insure useEffect as Componet only work once
    
  const formattedDate = currentDate.toLocaleTimeString();

  return (

    
    <div>
      <h1>發起共乘</h1>
      <p>現在時間 :{formattedDate}</p>
      <h2>Select Date and Time</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="Pp"
      />
      <hr />
      <label for="number_of_people">共乘人數：</label> 
      <input type="text" id="number_of_people" name="number_of_people" placeholder="請輸入共乘人數"
        value={numberOfPeople}
        onChange={(e) => setnumberOfPeople(e.target.value)}
        />
      <br />
      <label for="">共乘方式：</label> 
      <input type="is_self_drive" id="" name="is_self_drive" placeholder="請輸入共乘方式"
        onChange={(e) => setisSelfFrive(e.target.value)}/>
      <br />
      <label for="start_loc">起始地點：</label> 
      <input type="text" id="start_loc" name="start_loc" placeholder="輸入起始地點"
        value= {start}
        onChange={(e) => SetStart(e.target.value)}
      />
      <br />
      <label for="end_loc">下車地點：</label> 
      <input type="text" id="end_loc" name="end_loc" placeholder="輸入結束地點"
        onChange={(e) => SetEnd(e.target.value)}/>
      <button onClick={HandleLaunchclick}>確認</button>
      <hr />
      <br />
      <h5>提醒：請根據您行使的路線依序新增停靠站</h5>
      <br />
      <label for="end_loc">新增中間上下車地點：</label> 
      <input type="text" id="other_loc" name="other_loc" placeholder="輸入中途地點"
        onChange={(e) => setOtherlocate(e.target.value)}
      />
      <button onClick={HandleOtherLocation}>確認</button>
      <br />
      <label for="end_loc">已新增中間上下車地點：</label> 
      {PrintOtherLocation()}
    </div>
     
  );
};

export default CarpoolLaunch;
