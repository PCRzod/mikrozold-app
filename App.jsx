import React, { useEffect, useMemo, useState } from "react";

const PLANTS = [
{ id:"lila_retek", name:"Lila Retek", icon:"🟣"},
{ id:"pink_retek", name:"Pink Retek", icon:"🌸"},
{ id:"borso", name:"Borsó", icon:"🫛"},
{ id:"karalabe", name:"Karalábé", icon:"🥬"},
{ id:"brokkoli", name:"Brokkoli", icon:"🥦"},
{ id:"porehagyma", name:"Póréhagyma", icon:"🧅"},
{ id:"cekla", name:"Cékla", icon:"🍠"},
{ id:"salata", name:"Saláta", icon:"🥗"},
{ id:"fekete_mustar", name:"Fekete Mustár", icon:"⚫"},
{ id:"barna_mustar", name:"Barna Mustár", icon:"🟤"},
{ id:"napraforgo", name:"Napraforgó", icon:"🌻"},
{ id:"edeskomeny", name:"Édeskömény", icon:"🌿"}
];

const RESTAURANTS = [
"Crystal",
"Gerendás",
"Paprika",
"Káli",
"Sylvania",
"Kicsi Gomba",
"Pacsirta",
"Csámborgó",
"Zöldséges üzlete - Csilla"
];

const PRICES = {
kicsi:7,
nagy:20
};

export default function App(){

const [restaurant,setRestaurant]=useState(RESTAURANTS[0]);
const [plant,setPlant]=useState(null);
const [size,setSize]=useState(null);
const [qty,setQty]=useState(1);
const [data,setData]=useState([]);

useEffect(()=>{
const saved=localStorage.getItem("mikrozold");
if(saved) setData(JSON.parse(saved));
},[]);

useEffect(()=>{
localStorage.setItem("mikrozold",JSON.stringify(data));
},[data]);

function save(){

if(!plant||!size)return;

const record={
date:new Date().toISOString().slice(0,10),
restaurant,
plant:plant.name,
size,
qty,
price:PRICES[size],
sum:PRICES[size]*qty
};
fetch("https://script.google.com/macros/s/AKfycbwg1Puemq79NPkimkXk0f1iHIFrA4cTYz_J7voJgKBZbPwbli6sELotXWr18lTF4PYAhQ/exec", {
method: "POST",
body: JSON.stringify({
date: record.date,
restaurant: record.restaurant,
plant: record.plant,
size: record.size,
qty: record.qty,
price: record.price,
sum: record.sum,
note: ""
})
});
setData([record,...data]);

setPlant(null);
setSize(null);
setQty(1);

}

function total(){
return data.reduce((a,b)=>a+b.sum,0);
}

return(

<div style={{fontFamily:"system-ui",padding:20,maxWidth:500,margin:"auto"}}>

<h2>Mikrozöld napló</h2>

<h3>Vendéglő</h3>

{RESTAURANTS.map(r=>

<button
key={r}
onClick={()=>setRestaurant(r)}
style={{
margin:4,
padding:10,
borderRadius:12,
border:r==restaurant?"2px solid black":"1px solid #ccc",
background:r==restaurant?"black":"white",
color:r==restaurant?"white":"black"
}}
>

{r}

</button>

)}

<h3>Növény</h3>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>

{PLANTS.map(p=>

<button
key={p.id}
onClick={()=>setPlant(p)}
style={{
padding:10,
borderRadius:12,
border:plant?.id==p.id?"2px solid green":"1px solid #ccc"
}}
>

<div style={{fontSize:28}}>{p.icon}</div>

{p.name}

</button>

)}

</div>

{plant&&(

<>

<h3>Méret</h3>

<button onClick={()=>setSize("kicsi")} style={{margin:5,padding:10}}>
kicsi (7 lej)
</button>

<button onClick={()=>setSize("nagy")} style={{margin:5,padding:10}}>
nagy (20 lej)
</button>

</>

)}

<h3>Darab</h3>

<input
type="number"
value={qty}
onChange={e=>setQty(e.target.value)}
style={{width:80,fontSize:18}}
/>

<br/><br/>

<button
onClick={save}
style={{
padding:15,
fontSize:18,
borderRadius:12,
background:"green",
color:"white",
border:"none"
}}
>

MENTÉS

</button>

<hr/>

<h3>Összes bevétel</h3>

<h2>{total()} lej</h2>

<hr/>

<h3>Lista</h3>

{data.map((d,i)=>

<div key={i} style={{borderBottom:"1px solid #ddd",padding:5}}>

{d.date} – {d.restaurant} – {d.plant} – {d.size} – {d.qty} db – {d.sum} lej

</div>

)}

</div>

)

}
