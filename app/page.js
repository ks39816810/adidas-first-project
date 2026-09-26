"use client";
import {useEffect,useMemo,useState} from "react";
const seed=[{id:1,date:"2026-09-26",memo:"食材購入",type:"仕入",amount:3000,paid:true},{id:2,date:"2026-09-26",memo:"店舗売上",type:"売上",amount:50000,paid:true}];
const colors={売上:"red",仕入:"green",経費:"yellow",未払い:"orange"};
export default function Home(){
 const [rows,setRows]=useState(seed),[cashStart,setCashStart]=useState(50000),[form,setForm]=useState({type:"売上",memo:"",amount:""});
 useEffect(()=>{const x=localStorage.getItem("omise-data");if(x){const d=JSON.parse(x);setRows(d.rows||seed);setCashStart(d.cashStart??50000)}},[]);
 useEffect(()=>{localStorage.setItem("omise-data",JSON.stringify({rows,cashStart}))},[rows,cashStart]);
 const sums=useMemo(()=>{let s={売上:0,仕入:0,経費:0,未払い:0};rows.forEach(r=>s[r.type]=(s[r.type]||0)+Number(r.amount));return s},[rows]);
 const cash=cashStart+sums.売上-sums.仕入-sums.経費;
 function add(e){e.preventDefault();const amount=Number(form.amount);if(!amount)return;setRows(v=>[{id:Date.now(),date:new Date().toISOString().slice(0,10),memo:form.memo||form.type,type:form.type,amount,paid:form.type!=="未払い"},...v]);setForm({...form,memo:"",amount:""})}
 return <main><header><h1>🏠 お店のかんたん管理</h1><p>大きなブロックで、今日のお金がすぐ分かります</p></header>
 <section className="grid">
  <Card c="red" t="売 上" v={sums.売上}/>
  <Card c="green" t="仕 入" v={sums.仕入}/>
  <Card c="yellow" t="経 費" v={sums.経費}/>
  <Card c="orange" t="掛け・未払い" v={sums.未払い}/>
  <Card c="purple" t="現金残高" v={cash}/>
 </section>
 <section className="panel"><h2>✏️ かんたん入力</h2><form onSubmit={add}>
 <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>売上</option><option>仕入</option><option>経費</option><option>未払い</option></select>
 <input placeholder="内容（例：魚の仕入）" value={form.memo} onChange={e=>setForm({...form,memo:e.target.value})}/>
 <input type="number" inputMode="numeric" placeholder="金額" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
 <button>＋ 登録する</button></form></section>
 <section className="photo"><button onClick={()=>alert("次の段階でレシートOCRを接続します")}>📷 レシート</button><button onClick={()=>alert("次の段階で請求書OCRを接続します")}>📄 請求書</button></section>
 <section className="panel"><h2>📋 取引一覧</h2><div className="table"><div className="tr head"><b>日付</b><b>内容</b><b>区分</b><b>金額</b></div>{rows.map(r=><div className="tr" key={r.id}><span>{r.date.slice(5).replace("-","/")}</span><span>{r.memo}</span><strong className={colors[r.type]}>{r.type}</strong><b>¥{Number(r.amount).toLocaleString()}</b></div>)}</div></section>
 <footer>Next.js / Google Cloud 対応</footer></main>
}
function Card({c,t,v}){return <article className={"card "+c}><h2>{t}</h2><div>¥{Number(v).toLocaleString()}</div></article>}