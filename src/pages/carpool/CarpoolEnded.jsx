
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';



export const CarpoolEnded = () => {
  const [EndedSearchClicked, SetEndedSearchclicked] = useState(false);
  const [Endedresult,SetEndedresult] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDate(new Date());
      }, 1000);
  
      
      return () => clearInterval(intervalId);
    }, []); // Transport one empty tuple as second parameter to insure useEffect as Componet only work once
    
  const formattedDate = currentDate.toLocaleTimeString();


  return (
    <div>
      <h1>已結束的共乘</h1>
      <p>現在時間 : {formattedDate}</p>
      <hr />
      <br />
    </div>
  );
};

export default CarpoolEnded;
