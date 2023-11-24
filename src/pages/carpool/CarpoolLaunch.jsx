import { useEffect,useState } from "react";


export const CarpoolLaunch = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [launchCarpool,setlaunchCarpool] = useState(false);
  const [launchresult,setlaunchresult] = useState([]);

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
      <hr />
      <label for="number_of_people">共乘人數：</label> 
      <input type="text" id="number_of_people" name="number_of_people" placeholder="請輸入共乘人數"/>
      <br />
      <label for="">共乘方式：</label> 
      <input type="is_self_drive" id="" name="is_self_drive" placeholder="請輸入共乘方式"/>
      <br />
      <hr />
      <label for="start_loc">起始地點：</label> 
      <input type="text" id="start_loc" name="start_loc" placeholder="輸入起始地點"/>
      <br />
      <label for="end_loc">下車地點：</label> 
      <input type="text" id="end_loc" name="end_loc" placeholder="輸入結束地點"/>
      <hr />
      <br />
      <h5>提醒：請根據您行使的路線依序新增停靠站</h5>
      <br />
      <label for="end_loc">新增中間上下車地點：</label> 
      <input type="text" id="other_loc" name="other_loc" placeholder="輸入上下車地點"/>
      <br />
      <label for="end_loc">已新增中間上下車地點：</label> 
      
    </div>
     
  );
};

export default CarpoolLaunch;
