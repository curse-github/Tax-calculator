import React, { useRef, useState } from 'react';
import { useSearchParams } from "react-router-dom";
//2024 tables
const FitWh2024 = [// https://www.irs.gov/pub/irs-prior/p15t--2024.pdf, page 11
    [ 0     , 6000  , 0        , 0  ],
    [ 6000  , 17600 , 0        , 10 ],
    [ 17600 , 53150 , 1160     , 12 ],
    [ 53150 , 106525, 5426     , 22 ],
    [ 106525, 197950, 17168.5  , 24 ],
    [ 197950, 249725, 39110.5  , 32 ],
    [ 249725, 615350, 55678.5  , 35 ],
    [ 615350, 0.1   , 183647.25, 37 ]
];
const OkWh2024 = [// https://oklahoma.gov/content/dam/ok/en/tax/documents/resources/publications/businesses/withholding-tables/WHTables-2024.pdf
    [0    , 6350 , 0    , 0   ],// page 8
    [6350 , 7350 , 0    , 0.25],
    [7350 , 8850 , 2.5  , 0.75],
    [8850 , 10100, 13.75, 1.75],
    [10100, 11250, 35.63, 2.75],
    [11250, 13550, 67.25, 3.75],
    [13550, 0.1  , 153.5, 4.75]
]
const OkCalc = ((amount,pppy)=>{
    const gross = amount;
    for(var i=0;i<OkWh2024.length-1;i++) {
        let tx = OkWh2024[i];
        tx = [tx[0]/pppy,tx[1]/pppy,tx[2]/pppy,tx[3]];
        if (gross >= tx[0] && gross < tx[1]) return [...tx,tx[2]+((gross-tx[0])*tx[3]/100)];
    }
    let tx = OkWh2024[OkWh2024.length-1];
    tx = [tx[0]/pppy,tx[1]/pppy,tx[2]/pppy,tx[3]];
    return [...tx,tx[2]+((gross-tx[0])*tx[3]/100)];// the amount between 13550 and infinity
});
const FitCalc = ((amount,pppy)=>{
    const gross = amount-8600/pppy;
    for(var i=0;i<FitWh2024.length-1;i++) {
        let tx = FitWh2024[i];
        tx = [tx[0]/pppy,tx[1]/pppy,tx[2]/pppy,tx[3]];
        if (gross >= tx[0] && gross < tx[1]) return [...tx,tx[2]+((gross-tx[0])*tx[3]/100)];
    }
    let tx = FitWh2024[FitWh2024.length-1];
    tx = [tx[0]/pppy,tx[1]/pppy,tx[2]/pppy,tx[3]];
    return [...tx,tx[2]+((gross-tx[0])*tx[3]/100)];// the amount between 615350 and infinity
});

function roundToCents(num){return (typeof num === "string") ? num: Math.floor(num*100)/100;}
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
    const Ok = OkCalc(beforeTax,ppPy);
    const Fit = FitCalc(beforeTax,ppPy);
    const final = beforeTax*(1-(7.65)/100)-Ok[4]-Fit[4];
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
        <div>{"(" + sum + " hours)*(" + dph + " $/hr) = $" + roundToCents(beforeTax).toLocaleString() + " before tax"}</div>
        <div>{"Fit between $" + roundToCents(Fit[0]).toLocaleString() + " and $" + roundToCents(Fit[1]).toLocaleString() + ":"}</div><div>{"$" + roundToCents(Fit[2]) + " + (" + roundToCents(Fit[3]).toLocaleString() + "% of ($" + beforeTax + " - $" + roundToCents(Fit[0]) + ")) = $" + roundToCents(Fit[4]).toLocaleString()}</div><br/>
        <div>{"Ok between $" + roundToCents(Ok[0]).toLocaleString() + " and $" + roundToCents(Ok[1]).toLocaleString() + ":"}</div><div>{"$" + roundToCents(Ok[2]) + " + (" + roundToCents(Ok[3]).toLocaleString() + "% of ($" + beforeTax + " - $" + roundToCents(Ok[0]) + ")) = $" + roundToCents(Ok[4]).toLocaleString()}</div><br/>
        <div>{"Med: 1.45% of $" + roundToCents(beforeTax).toLocaleString() + ": $" + roundToCents(beforeTax*0.0145).toLocaleString()}</div>
        <div>{"Soc: 6.2% of $" + roundToCents(beforeTax).toLocaleString() + ": $" + roundToCents(beforeTax*0.062).toLocaleString()}</div>
        <div>{"Final: $" + roundToCents(beforeTax).toLocaleString() + " - $" + roundToCents(Fit[4]).toLocaleString() + " - $" + roundToCents(Ok[4]).toLocaleString() + " - $" + roundToCents(beforeTax*0.0145).toLocaleString() + " - $" + roundToCents(beforeTax*0.062).toLocaleString() + ":"}</div>
        <div className="final">{"$" + roundToCents(final).toLocaleString()}</div>
    </div>)
}
export default TaxCalculator;