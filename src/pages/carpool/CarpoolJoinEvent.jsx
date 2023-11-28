import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter , useLocation } from 'react-router-dom';


export const Carpooljoinevent = ({ id }) => {

    const url_get_usr_info = "http://localhost:8000/get-user-info/";
    const url_join_the_carpool = "http://localhost:8000/join-the-carpool"
    //loader function 
    const [JoinedEvent, setJoinedevent] = useState(false);
    const [BadEvent, setBadEvent] =  useState(false);
    const [BadEventdata,setBadEventdata] = useState([]);
    const [Successfuldata,setSuccesfuldata] = useState([]);

    useEffect(() => {

        //JoinTheCarpoolLoader();
    
    }, []); 
    

    

    const JoinTheCarpoolLoader = () => {

        const target = {
        "eventForm": {
          "event_id": 1
        },
        "user": {
          "user_id": 1
        }
        }

     
      
      fetch(url_join_the_carpool,{
            method : 'POST' ,
            headers: new Headers({
                'accept' :  'application/json',
                'Content-Type' : 'application/json' // <-- Specifying the Content-Type
            }),body : JSON.stringify(target)
            }) // <-- Post Parameters
            .then((response) => {
                return response.text();
            })
            .then((responseText) => {
                setBadEvent(true);
                setBadEventdata(responseText);
                //alert(responseText);
            })
            .catch((error) => {
                setBadEvent(true);
                setBadEventdata(error);
                console.error(error);
            });
    
    }

    const Badeventhandle = () =>{
        return(
            <dev>
                <h2>{BadEventdata}</h2>
            </dev>
        );
    }
    const Successfulhandle = () => {
        return(
            <dev>
                <h2>{Successfuldata}</h2>
            </dev>
        )
    }

    const location = useLocation();
    

    return ( 
        <dev>
            <h1>已成功加入共乘</h1>
            <hr />
            <br />
            <h2>加入結果</h2>
            <br />
            {(JoinTheCarpoolLoader())}
            {BadEvent && Badeventhandle()}
            {!BadEvent && Successfulhandle()}
            <p></p>
        </dev>
        
    );
}
 
export default Carpooljoinevent;