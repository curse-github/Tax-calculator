import React, { useEffect, useRef, useState } from 'react';
import {
  useSearchParams
} from "react-router-dom";
import './App.css';
import Month from "./Month"
import TaxCalculator from "./TaxCalculator"

const curMonth = ((new Date()).toDateString()).split(" ")[1];
const months = [
  "Jan", "Feb",
  "Mar", "Apr",
  "May", "Jun",
  "Jul", "Aug",
  "Sep", "Oct",
  "Nov", "Dec"
]
function getMonthData(strName) {// console.log(strName)
  const daysInLastMonth = new Date((new Date()).getFullYear(), months.indexOf(strName), 0).getDate();
  const daysBefore      = new Date((new Date()).getFullYear(), months.indexOf(strName), 1).getDay();
  const daysInMonth     = new Date((new Date()).getFullYear(), months.indexOf(strName)+1, 0).getDate();
  return [daysInLastMonth,daysBefore,daysInMonth]
}

function App() {
  var month = curMonth;
  const [searchParams, setSearchParams] = useSearchParams();
  const monthRef = useRef();
  function IncrementButton({ increment }) {
    return <input type="button" onClick={()=>{
      month=months[(months.indexOf(month)+increment+12)%12];
      UpdateLink(setSearchParams);
    }} value={(increment>0?">":"<")}></input>
  }
  function MonthSelector({setSearchParams}) {
    let mon = window.location.search.replace("?","").split("&").filter((ele)=>ele.split("=")[0]==="mon")
    if (mon.length > 0) { mon = mon[0].split("="); } else {mon=[];}
    if (mon.length > 0) { mon = mon[1]; } else {mon=null;}
    if (mon === null || mon === undefined || mon === month) { mon=month; }
    useEffect(()=>{ month=mon; });
    return (<select ref={monthRef} onChange={()=>{month=monthRef.current.value; UpdateLink(setSearchParams);}} name="Month" id="Month" value={mon}>
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
