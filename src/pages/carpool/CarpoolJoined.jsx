
import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter ,Link } from 'react-router-dom';


export const CarpoolJoined = () => {
  const [JoinedSearchClicked, setJoinedSearchclicked] = useState(false);
  const [Joinedresult, setJoinedresult] = useState([]);
  
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDate(new Date());
      }, 1000);
  
      
      return () => clearInterval(intervalId);
    }, []); // Transport one empty tuple as second parameter to insure useEffect as Componet only work once
    
  const formattedDate = currentDate.toLocaleTimeString();

  

  const onJoinClick = () => {
    // API call
    const api = [
      {
        id: 1,
        launcher: 'John',
        route: '台北',
        time: '2021/08/01 12:00',
        num: 3,
        cost: 500,
        carpool_attribute: "發起人自駕",
      },
      {
        id: 2,
        launcher: 'John',
        route: '台北',
        time: '2021/08/01 12:00',
        num: 4,
        cost: 1000,
        carpool_attribute: "發起人自駕",
      },
    ];
    setJoinedSearchclicked(true);
    setJoinedresult(api);
  }

  const renderJoinedResult = () => {
    return Joinedresult.map((item) => {
      return (
        <div key={item.id}>
          <p>發起人：{item.launcher}</p>
          <p>目前共乘人數：{item.num}</p>
          <p>共乘方式：{item.carpool_attribute}</p>
          <p>共乘時間：{item.time}</p>
          <p>共乘路線：{item.route}</p>
          <p>共乘ID:{item.id}</p>
          <hr />
        </div>
      );
    });
  }


  /*      <button onClick={onJoinClick()}>搜尋</button>
      { JoinedSearchClicked && Joinedresult.length === 0 && (<p>沒有搜尋結果</p>) }
      { JoinedSearchClicked && Joinedresult.length > 0 && (renderJoinedResult())}*/
  return (
    <div>
      <h1>已加入的共乘</h1>
      <hr />
      <p>目前時間 :{formattedDate} </p>
      <br />
      <hr />
      <button onClick={onJoinClick}>顯示已加入的共乘</button>
      { JoinedSearchClicked && Joinedresult.length === 0 && (<p>沒有搜尋結果</p>) }
      { JoinedSearchClicked && Joinedresult.length > 0 && (renderJoinedResult())}  
    </div>
    
    
  );
};

export default CarpoolJoined;
