import React, { useRef, useContext } from 'react';
function Day({day, days, setDays, value}) {
    const textRef = useRef();
    return (
        <div className="day">
            {day}
            <input tabIndex={day} ref={textRef} onChange={()=>{var tmp = [...days]; tmp[day-1] = Number(textRef.current.value); setDays(tmp); console.clear();console.log(tmp);}} type="number" value={Number(value)}></input>
        </div>
    )
}
export default Day;