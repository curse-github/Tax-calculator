import React, { useRef } from 'react';
function Day({day, value, searchParams, setSearchParams}) {
    const textRef = useRef();
    function setDay() {
        var params = Object.fromEntries((()=>{var a=window.location.search.replace("?","").split("&").map((ent)=>ent.split("="));return a[0][0]!==""?a:[]})());
        params[String(day)] = Number(textRef.current.value);
        //console.log(params)
        setSearchParams(params);
    }
    return (
        <div className="day">
            {day}
            <input tabIndex={day} ref={textRef} onChange={setDay} type="number" value={Number(value)}></input>
        </div>
    )
}
export default Day;