import { useState ,useEffect} from 'react';

export const CarpoolSearch = () => {

  let url = "http://localhost:8000";
  // print  
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [routeprint,setrouteprint] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    
    return () => clearInterval(intervalId);
  }, []); // Transport one empty tuple as second parameter to insure useEffect as Componet only work once
  
  const formattedDate = currentDate.toLocaleTimeString();
  function routelist(routearray){
    let text = ""
    for(let i = 0; i < routearray.length; i++){
      if(i  != routearray.length-1)
        text += routearray[i] + '->';
      else
        text += routearray[i];
    }
    return text;
  }
  
  

  const onSearchClick = () => {
    // API call
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
  }

  const renderSearchResult = () => {
    return searchResult.map((item) => {
      return (
        <div key={item.id}>
          <p>發起人：{item.launcher}</p>
          <p>目前共乘人數：{item.num}</p>
          <p>共乘方式：{item.carpool_attribute}</p>
          <p>共乘時間：{item.time}</p>
          <p>共乘路線：{routelist(item.route)}</p>
          <p>共乘ID:{item.id}</p>
          <button>加入共乘</button>
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
      <input type="text" id="startLocation" name="startLocation" placeholder="請輸入上車地點"/>
      <br/>
      <br />
      <label for="endLocation">下車地點：</label>
      <input type="text" id="endLocation" name="endLocation" placeholder="請輸入下車地點" />
      <button onClick={onSearchClick}>搜尋</button><br />
      <br />
      <hr />
      <h2>搜尋結果</h2>
      { isSearchClicked && searchResult.length === 0 && (<p>沒有搜尋結果</p>) }
      { isSearchClicked && searchResult.length > 0 && (renderSearchResult())}
    </div>
  );
};

export default CarpoolSearch;
