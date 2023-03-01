import Day from "./Day"
import './Month.css';

function Month({mon,days,setDays}) {
    var thing = [];
    for (let i = mon[1]; i > 0; i--) {
        thing.push(<div className="day dark">{mon[0]-i+1}</div>);
    }
    for (let i = 0; i < mon[2]; i++) {
        thing.push(<Day days={days} setDays={setDays} day={i+1} value={days[i]}/>);
    }
    for (let i = 0; i < 7-((mon[1]+mon[2])%7); i++) {
        thing.push(<div className="day dark">{i+1}</div>);
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
    </>)
}
export default Month;