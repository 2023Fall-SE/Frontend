import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter , useLocation } from 'react-router-dom';


export const Carpooljoinevent = ({ itemid , userid}) => {

    const url_get_usr_info = "http://localhost:8000/get-user-info/";
    const url_join_the_carpool = "http://localhost:8000/join-the-carpool"
    //loader function 
    const [JoinedEvent, setJoinedevent] = useState(false);
    const [Event, setEvent] =  useState(false);
    const [EventStart, setEventstart] = useState();
    const [Eventdata,setEventdata] = useState([]);
    const [BadEventData,setBadEventdata] = useState([]);
    const [Successfuldata,setSuccesfuldata] = useState([]);

    useEffect(() => {

        JoinTheCarpoolLoader();
    
    }, []); 
    
    const location = useLocation();
    
    

    const JoinTheCarpoolLoader = () => {

        const target = {
        "eventForm": {
          "event_id": itemid
        },
        "user": {
          "user_id": userid
        }
        }

         
      fetch(url_join_the_carpool,{
            method : 'POST' ,
            headers: new Headers({
                'accept' :  'application/json',
                'Content-Type' : 'application/json' // <-- Specifying the Content-Type
            }),body : JSON.stringify(target)
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

    const Eventhandle = () =>{
        

        return(
            <dev>
                {Eventdata.detail === "位子不夠" &&  <h2>位子不夠:無法加入行程</h2>}
                {Eventdata.detail === "無此Event" && <h2>找不到行程</h2>}
                
                {Eventdata.detail === "使用者已在此Event" && <h2> 已加入Carpool行程</h2>}
                {Eventdata.result === "success" &&  <h2>成功加入行程</h2>}
            </dev>
        );
    }
    

    
    

    return ( 
        <dev>
            <hr />
            <br />
            <h2>加入結果</h2>
            <br />
            {Event && (Eventhandle())}
            <p></p>
        </dev>
        
    );
}
 
export default Carpooljoinevent;