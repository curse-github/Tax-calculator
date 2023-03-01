import React, { useRef, useState } from 'react';
const FitWh=[
    [0   ,580 ,0 ],
    [580 ,595 ,1 ],
    [595 ,610 ,3 ],
    [610 ,625 ,4 ],
    [625 ,640 ,6 ],
    [640 ,655 ,7 ],
    [655 ,670 ,9 ],
    [670 ,685 ,10],
    [685 ,700 ,12],
    [700 ,715 ,13],
    [715 ,730 ,15],
    [730 ,745 ,16],
    [745 ,760 ,18],
    [760 ,775 ,19],
    [775 ,790 ,21],
    [790 ,805 ,22],
    [805 ,820 ,24],
    [820 ,835 ,25],
    [835 ,850 ,27],
    [850 ,865 ,28],
    [865 ,880 ,30],
    [880 ,895 ,31],
    [895 ,910 ,33],
    [910 ,925 ,34],
    [925 ,940 ,36],
    [940 ,955 ,37],
    [955 ,970 ,39],
    [970 ,985 ,40],
    [985 ,1000,42],
    [1000,1015,43],
    [1015,1030,45],
    [1030,1045,46],
    [1045,1060,48],
    [1060,1075,50],
    [1075,1090,51],
    [1090,1105,53],
    [1105,1120,55]
]
const OkWh = [
    [0  , 265, 0   , 0   ],
    [265, 306, 0   , 0.25],
    [306, 369, 0.10, 0.75],
    [369, 421, 0.57, 1.75],
    [421, 469, 1.48, 2.75],
    [469, 565, 2.80, 3.75]
    //[565, inf, 6.40, 4.75]

]
function TaxCalculator({sum}) {
    const dphRef = useRef();
    const [dph, setDph] = useState(15);
    const beforeTax = sum*dph;
    const Fit = (()=>{
        for(var i=0;i<FitWh.length;i++) {
            const tx = FitWh[i];
            if (beforeTax >= tx[0] && beforeTax < tx[1]) return tx;
        }
        return [0,0,0];
    })();
    const Ok = (()=>{
        for(var i=0;i<OkWh.length;i++) {
            const tx = OkWh[i];
            if (beforeTax >= tx[0] && beforeTax < tx[1]) return [tx[0],tx[1],tx[2],tx[3],tx[2]+((beforeTax-tx[0])*(tx[3]/100))];
        }
        return [565,"∞",6.40,4.75,6.40+((beforeTax-565)*0.0475)];
    })();
    const final = beforeTax-Fit[2]-Ok[4]-(beforeTax*0.0765);
    return (<div className="TaxCalculator">
        <div>{sum+" hours total"}</div>
        <div className="input">
            <label>$/hr:</label>
            <input ref={dphRef} type="number" onChange={()=>{setDph(Number(dphRef.current.value))}} value={dph}></input>
        </div>
        <div>{"(" + sum + " hours)*(" + dph + " $/hr) = $" + beforeTax + " before tax"}</div>
        <div>{"Ok between $" + Ok[0] + " and $" + Ok[1] + ":"}</div><div>{"$" + Ok[2] + " + (" + Ok[3] + "% of ($" + beforeTax + " - $" + Ok[0] + ")) = $" + Ok[4]}</div><br/>
        <div>{"Fit between $" + Fit[0] + " and $" + Fit[1] + ": $" + Fit[2]}</div>
        <div>{"Med: 1.45% of $" + beforeTax + ": $" + Math.floor(beforeTax*0.0145*100)/100}</div>
        <div>{"Soc: 6.2% of $" + beforeTax + ": $" + Math.floor(beforeTax*0.062*100)/100}</div>
        <div>{"Final: $" + beforeTax + " - $" + Fit[2] + " - $" + Ok[4] + " - $" + beforeTax*0.0145 + " - $" + beforeTax*0.062 + ":"}</div>
        <div className="final">{"$" + Math.floor(final*100)/100}</div>
    </div>)
}
export default TaxCalculator;