import React, { useRef, useState } from 'react';
import { useSearchParams } from "react-router-dom";
//2024 tables
const FitWh2024=[// https://www.irs.gov/pub/irs-prior/p15t--2024.pdf
    [ 0     , 6000  , 0  ],// page 11
    [ 6000  , 17600 , 10 ],
    [ 17600 , 53150 , 12 ],
    [ 53150 , 106525, 22 ],
    [ 106525, 197950, 24 ],
    [ 197950, 249725, 32 ],
    [ 249725, 615350, 35 ],
    [ 615350, 0.1   , 37 ]
]
const OkWh2024 = [// https://oklahoma.gov/content/dam/ok/en/tax/documents/resources/publications/businesses/withholding-tables/WHTables-2024.pdf
    [0    , 6350 , 0    , 0   ],// page 8
    [6350 , 7350 , 0    , 0.25],
    [7350 , 8850 , 2.5  , 0.75],
    [8850 , 10100, 13.75, 1.75],
    [10100, 11250, 35.63, 2.75],
    [11250, 13550, 67.25, 3.75],
    [13550, 0.1  , 153.5, 4.75]
]
function roundToCents(num){if (typeof num === "string")return num;else return Math.floor(num*100)/100;}
function TaxCalculator({rate,payPers}) {
    const searchParams = useSearchParams()[0];
    const setSearchParams = useSearchParams()[1];
    let sum=0;
    for(let i=0;i<31;i++){
        const thing = Number(searchParams.get(String(i+1)));
        if (thing!=null) sum+=thing;
    }
    const dphRef = useRef();
    const [dph, setDph] = useState(rate);
    const ppPyRef = useRef();
    const [ppPy, setPpPy] = useState(payPers);

    const beforeTax = sum*dph;
    const Ok = (()=>{
        for(var i=0;i<OkWh2024.length-1;i++) {
            const tx = OkWh2024[i];
            const greaterThan = tx[0]/ppPy;
            const lessThan = tx[1]/ppPy;
            const base = tx[2]/ppPy
            const percent = tx[3];
            if (beforeTax >= greaterThan && beforeTax < lessThan) {
                const amount=base+((beforeTax-greaterThan)*(percent/100));
                return [greaterThan,lessThan,base,amount];
            }
        }
        const tx = OkWh2024[OkWh2024.length-1];// the amount between 615350 to infinity
        const greaterThan = tx[0]/ppPy;
        const base = tx[2]/ppPy
        const percent = tx[3];
        const amount=base+((beforeTax-greaterThan)*(percent/100));
        return [greaterThan,"∞",base,percent,amount];
    })();
    const Fit = (()=>{
        for(var i=0;i<FitWh2024.length-1;i++) {
            const tx = FitWh2024[i];
            const greaterThan = tx[0]/ppPy;
            const lessThan = tx[1]/ppPy;
            const percent = tx[2];
            if (beforeTax >= greaterThan && beforeTax < lessThan) {
                const amount=((beforeTax-greaterThan)*(percent/100));
                return [greaterThan,lessThan,percent,amount];
            }
        }
        const tx = FitWh2024[FitWh2024.length-1];
        const greaterThan = tx[0]/ppPy;
        const percent = tx[2];
        const amount=((beforeTax-greaterThan)*(percent/100));
        return [greaterThan,"∞",percent,amount];// the amount between 13550 to infinity
    })();
    const final = beforeTax*(1-(0.0145+0.062))-Ok[4]-Fit[3];
    return (<div className="TaxCalculator">
        <div>{sum+" hours total"}</div>
        <div className="input">
            <label>$/hr:</label>
            <input ref={dphRef} type="number" onChange={()=>{
                setDph(Number(dphRef.current.value));
                let params = Object.fromEntries((()=>{var a=window.location.search.replace("?","").split("&").map((ent)=>ent.split("="));return a[0][0]!==""?a:[]})());
                params["rate"]=dphRef.current.value;
                //console.log(dphRef.current.value);
                setSearchParams(params);
            }} value={dph}></input>
        </div>
        <div className="input">
            <label>Pay periods per year:</label>
            <input ref={ppPyRef} type="number" onChange={()=>{
                setPpPy(Number(ppPyRef.current.value));
                let params = Object.fromEntries((()=>{var a=window.location.search.replace("?","").split("&").map((ent)=>ent.split("="));return a[0][0]!==""?a:[]})());
                params["pppy"]=ppPyRef.current.value;
                //console.log(ppPyRef.current.value);
                setSearchParams(params);
            }} value={ppPy}></input>
        </div>
        <br></br>
        <div>{"(" + sum + " hours)*(" + dph + " $/hr) = $" + beforeTax + " before tax"}</div>
        <div>{"Ok between $" + roundToCents(Ok[0]) + " and $" + roundToCents(Ok[1]) + ":"}</div><div>{"$" + roundToCents(Ok[2]) + " + (" + Ok[3] + "% of ($" + beforeTax + " - $" + roundToCents(Ok[0]) + ")) = $" + Ok[4]}</div><br/>
        <div>{"Fit between $" + roundToCents(Fit[0]) + " and $" + roundToCents(Fit[1]) + ":"}</div><div>{"$(" + Fit[2] + "% of ($" + beforeTax + " - $" + roundToCents(Fit[0]) + ")) = $" + Fit[3]}</div><br/>
        <div>{"Med: 1.45% of $" + beforeTax + ": $" + roundToCents(beforeTax*0.0145)}</div>
        <div>{"Soc: 6.2% of $" + beforeTax + ": $" + roundToCents(beforeTax*0.062)}</div>
        <div>{"Final: $" + beforeTax + " - $" + Fit[3] + " - $" + Ok[4] + " - $" + beforeTax*0.0145 + " - $" + beforeTax*0.062 + ":"}</div>
        <div className="final">{"$" + roundToCents(final)}</div>
    </div>)
}
export default TaxCalculator;