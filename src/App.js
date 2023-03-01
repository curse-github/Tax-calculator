import React, { useRef, useState, createContext } from 'react';
import './App.css';
import Month from "./Month"
import TaxCalculator from "./TaxCalculator"


function App() {
  const curMonth = ((new Date()).toDateString()).split(" ")[1];
  var Map = {
    Jan:["Dec",0 ,"Feb"], Feb:["Jan",1 ,"Mar"],
    Mar:["Feb",2 ,"Apr"], Apr:["Mar",3 ,"May"],
    May:["Apr",4 ,"Jun"], Jun:["May",5 ,"Jul"],
    Jul:["Jun",6 ,"Aug"], Aug:["Jul",7 ,"Sep"],
    Sep:["Aug",8 ,"Oct"], Oct:["Sep",9 ,"Nov"],
    Nov:["Oct",10,"Dec"], Dec:["Nov",11,"Jan"],
  }
  function getMonthData(strName) {
    const daysInLastMonth = new Date((new Date()).getFullYear(), Map[strName][1], 0).getDate();
    const daysBefore      = new Date((new Date()).getFullYear(), Map[strName][1], 1).getDay();
    const daysInMonth     = new Date((new Date()).getFullYear(), Map[strName][1]+1, 0).getDate();
    return [daysInLastMonth,daysBefore,daysInMonth]
  }
  function updateMonth(value) {
    if (value != month) setMonth(value);
    var daything = getMonthData(value)[2];
    for(var i = daything+1; i < days.length; i++) {
      days[i] = 0;
    }
  }
	const [month, setMonth] = useState(curMonth);
	const [days, setDays] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

	const monthRef = useRef();
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            <input type="button" onClick={()=>{ setMonth(Map[month][0]); }} value="<"></input>
            <select ref={monthRef} onChange={()=>{updateMonth(monthRef.current.value)}} name="Month" id="Month" value={month}>
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
            </select>
            <input type="button" onClick={()=>{ setMonth(Map[month][2]); }} value=">"></input>
          </div>
          <h1>{month + " " + (new Date()).getFullYear()}</h1>
          
          <Month mon={getMonthData(month)} days={days} setDays={setDays}/>
        </div>
        <TaxCalculator sum={(()=>{var sum=0;for(var i=0;i<days.length;i++){sum+=days[i];}return sum; })()}/>
      </header>
    </div>
  );
}

export default App;
