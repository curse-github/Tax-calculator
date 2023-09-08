import { useSearchParams } from "react-router-dom";
import Day from "./Day"
import './Month.css';
function clear(setSearchParams) {
    let oldParams = Object.fromEntries(window.location.search.replace("?","").split("&").map(el=>el.split("=")))
    var params = {}
    if (oldParams.mon != null) params["mon"]=oldParams.mon
    if (oldParams.rate != null) params["rate"]=oldParams.rate
    setSearchParams(params);
}
function Month({mon}) {
    const [searchParams, setSearchParams] = useSearchParams();
    var thing = [];
    for (let i=mon[1];i>0;i--) {
        thing.push(<div key={"d1-"+i} className="day dark">{mon[0]-i+1}</div>);
    }
    for (let i=0;i<mon[2];i++) {
        thing.push(<Day key={"d-"+i} day={i+1} value={(()=>{const thing = Number(searchParams.get(String(i+1))); return (thing != null)?thing:0; })()} searchParams={searchParams} setSearchParams={setSearchParams}/>);
    }
    for (let i=0;i<7-((mon[1]+mon[2])%7);i++) {
        thing.push(<div key={"d2-"+i} className="day dark">{i+1}</div>);
    }
    return (<>
        <div className="monthlist">
            <div className="weekday">Sunday</div>
            <div className="weekday">Monday</div>
            <div className="weekday">Tuesday</div>
            <div className="weekday">Wednesday</div>
            <div className="weekday">Thursday</div>
            <div className="weekday">Friday</div>
            <div className="weekday">Saturday</div>
        </div>
        <div className="monthlist">{thing}</div>
        <input type="button" onClick={()=>{clear(setSearchParams);}} value={"Clear"}/>
        <input type="button" onClick={()=>{navigator.clipboard.writeText(window.location.href);console.log("copied: "+window.location.href)}} value={"Copy link"}/>
    </>)
}
export default Month;