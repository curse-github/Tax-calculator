import React, { useEffect, useRef, useState } from 'react';
import {
  useSearchParams
} from "react-router-dom";
import './App.css';
import Month from "./Month"
import TaxCalculator from "./TaxCalculator"

const curMonth = ((new Date()).toDateString()).split(" ")[1];
const Map = {
  Jan:["Dec",0 ,"Feb"], Feb:["Jan",1 ,"Mar"],
  Mar:["Feb",2 ,"Apr"], Apr:["Mar",3 ,"May"],
  May:["Apr",4 ,"Jun"], Jun:["May",5 ,"Jul"],
  Jul:["Jun",6 ,"Aug"], Aug:["Jul",7 ,"Sep"],
  Sep:["Aug",8 ,"Oct"], Oct:["Sep",9 ,"Nov"],
  Nov:["Oct",10,"Dec"], Dec:["Nov",11,"Jan"],
}
function getMonthData(strName) {//console.log(strName)
  const daysInLastMonth = new Date((new Date()).getFullYear(), Map[strName][1], 0).getDate();
  const daysBefore      = new Date((new Date()).getFullYear(), Map[strName][1], 1).getDay();
  const daysInMonth     = new Date((new Date()).getFullYear(), Map[strName][1]+1, 0).getDate();
  return [daysInLastMonth,daysBefore,daysInMonth]
}


function App() {
  const [month, setMonth] = useState(curMonth);
  const [searchParams, setSearchParams] = useSearchParams();
  const monthRef = useRef();
  function IncrementButton({ increment }) {
    return <input type="button" onClick={()=>{ setMonth(Map[month][1+increment]);UpdateLink(setSearchParams); }} value={(increment>0?">":"<")}></input>
  }
  function MonthSelector({setSearchParams}) {
    let mon = window.location.search.replace("?","").split("&").filter((ele)=>ele.split("=")[0]==="mon")
    if (mon.length > 0) { mon = mon[0].split("="); } else {mon=[];}
    if (mon.length > 0) { mon = mon[1]; } else {mon=null;}
    if (mon === null || mon === undefined || mon === month) { mon=month }
    
    useEffect(()=>{ setMonth(mon); });
    return (<select ref={monthRef} onChange={()=>{setMonth(monthRef.current.value);UpdateLink(setSearchParams);}} name="Month" id="Month" value={mon}>
      <option value="Jan">Jan</option>
      <option value="Feb">Feb</option>
      <option value="Mar">Mar</option>
      <option value="Apr">Apr</option>
      <option value="May">May</option>
      <option value="Jun">Jun</option>
      <option value="Jul">Jul</option>
      <option value="Aug">Aug</option>
      <option value="Sep">Sep</option>
      <option value="Oct">Oct</option>
      <option value="Nov">Nov</option>
      <option value="Dec">Dec</option>
    </select>)
  }
  function UpdateLink(setSearchParams) {
    let params = Object.fromEntries((()=>{var a=window.location.search.replace("?","").split("&").map((ent)=>ent.split("="));return a[0][0]!==""?a:[]})());
    params["mon"]=month;
    setSearchParams(params);
  }
  return (
            <div>
              <div>
                <div>
                  <IncrementButton increment={-1}/>
                  <MonthSelector setSearchParams={setSearchParams}/>
                  <IncrementButton increment={1}/>
                </div>
                <h1>{month + " " + (new Date()).getFullYear()}</h1>
                <Month mon={getMonthData(month)} searchParams={searchParams} setSearchParams={setSearchParams}/>
              </div>
              <TaxCalculator rate={searchParams.get("rate")||15}/>
            </div>
  );
}

export default App;
