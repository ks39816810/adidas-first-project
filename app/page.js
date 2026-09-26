"use client";
import {useEffect,useMemo,useRef,useState} from "react";

const seed=[
 {id:1,date:"2026-09-26",memo:"食材購入",type:"仕入",amount:3000,paid:true},
 {id:2,date:"2026-09-26",memo:"店舗売上",type:"売上",amount:50000,paid:true}
];
const colors={売上:"red",仕入:"green",経費:"yellow",未払い:"orange"};
const q=v=>'"'+String(v??"").replaceAll('"','""')+'"';
function acct(r){
 if(r.type==="売上") return ["現金","売上高"];
 if(r.type==="仕入") return ["仕入高","現金"];
 if(r.type==="経費") return ["消耗品費","現金"];
 return ["仕入高","買掛金"];
}
function yayoiCsv(rows){
 return rows.map(r=>{
  const [dr,cr]=acct(r);
  const cols=["2000","","",r.date,dr,"","","対象外",Number(r.amount),"",cr,"","","対象外",Number(r.amount),"",r.memo,"","0","","","","","",""];
  return cols.map(q).join(",");
 }).join("\r\n");
}
export default function Home(){
 const [rows,setRows]=useState(seed);
 const [cashStart,setCashStart]=useState(50000);
 const [form,setForm]=useState({type:"売上",memo:"",amount:""});
 const [notice,setNotice]=useState("");
 const [photo,setPhoto]=useState(null);
 const [photoKind,setPhotoKind]=useState("");
 const inputRef=useRef(null);
 useEffect(()=>{try{const x=localStorage.getItem("omise-data");if(x){const d=JSON.parse(x);setRows(d.rows||seed);setCashStart(d.cashStart??50000)}}catch{}},[]);
 useEffect(()=>{localStorage.setItem("omise-data",JSON.stringify({rows,cashStart}))},[rows,cashStart]);
 const sums=useMemo(()=>{let s={売上:0,仕入:0,経費:0,未払い:0};rows.forEach(r=>s[r.type]=(s[r.type]||0)+Number(r.amount));return s},[rows]);
 const cash=cashStart+sums.売上-sums.仕入-sums.経費;
 function choose(type){setForm(v=>({...v,type}));inputRef.current?.scrollIntoView({behavior:"smooth",block:"center"});}
 function add(e){e.preventDefault();const amount=Number(form.amount);if(!amount)return;setRows(v=>[{id:Date.now(),date:new Date().toLocaleDateString("sv-SE"),memo:form.memo||form.type,type:form.type,amount,paid:form.type!=="未払い"},...v]);setForm(v=>({...v,memo:"",amount:""}));setNotice("登録しました");setTimeout(()=>setNotice(""),1800)}
 function photoPick(e,kind){const f=e.target.files?.[0];if(!f)return;setPhoto(URL.createObjectURL(f));setPhotoKind(kind);setForm(v=>({...v,type:kind==="請求書"?"未払い":"仕入",memo:kind+"確認"}));setNotice(kind+"の写真を読み込みました。金額を確認して登録してください。");}
 function pay(id){setRows(v=>v.map(r=>r.id===id?{...r,type:"仕入",paid:true,memo:r.memo+"（支払済）"}:r));}
 function remove(id){if(confirm("この取引を削除しますか？"))setRows(v=>v.filter(r=>r.id!==id))}
 function exportYayoi(){
  const blob=new Blob(["\uFEFF"+yayoiCsv([...rows].reverse())],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="yayoi-shiwake.csv";a.click();URL.revokeObjectURL(url);
 }
 return <main>
 <header><h1>🏠 お店のかんたん管理</h1><p>押すだけで入力・確認できます</p></header>
 {notice&&<div className="notice">{notice}</div>}
 <section className="menuGrid">
  <Action c="blue" icon="📷" t="レシート" sub="撮影する"><label className="cover"><input type="file" accept="image/*" capture="environment" onChange={e=>photoPick(e,"レシート")}/></label></Action>
  <Action c="orange" icon="📄" t="請求書" sub="撮影する"><label className="cover"><input type="file" accept="image/*" capture="environment" onChange={e=>photoPick(e,"請求書")}/></label></Action>
  <Action c="red" icon="💴" t="売 上" sub={"¥"+sums.売上.toLocaleString()} onClick={()=>choose("売上")}/>
  <Action c="purple" icon="👛" t="現 金" sub={"¥"+cash.toLocaleString()}/>
  <Action c="green" icon="🥬" t="仕 入" sub={"¥"+sums.仕入.toLocaleString()} onClick={()=>choose("仕入")}/>
  <Action c="yellow" icon="🧾" t="経 費" sub={"¥"+sums.経費.toLocaleString()} onClick={()=>choose("経費")}/>
  <Action c="orange" icon="📋" t="未払い" sub={"¥"+sums.未払い.toLocaleString()} onClick={()=>choose("未払い")}/>
  <Action c="blue" icon="📘" t="弥生会計" sub="CSVを作る" onClick={exportYayoi}/>
 </section>
 {photo&&<section className="panel receiptPreview"><h2>📸 {photoKind}確認</h2><img src={photo} alt={photoKind}/><p>写真を確認して、下の入力欄に内容と金額を入れてください。</p></section>}
 <section className="panel" ref={inputRef}><h2>✏️ かんたん入力</h2><form onSubmit={add}>
 <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>売上</option><option>仕入</option><option>経費</option><option>未払い</option></select>
 <input placeholder="内容（例：魚の仕入）" value={form.memo} onChange={e=>setForm({...form,memo:e.target.value})}/>
 <input type="number" inputMode="numeric" placeholder="金額" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
 <button>＋ 登録する</button></form></section>
 <section className="panel"><h2>📊 今月の数字</h2><div className="summary"><span>売上 <b>¥{sums.売上.toLocaleString()}</b></span><span>仕入 <b>¥{sums.仕入.toLocaleString()}</b></span><span>経費 <b>¥{sums.経費.toLocaleString()}</b></span><span>未払い <b>¥{sums.未払い.toLocaleString()}</b></span></div></section>
 <section className="panel"><h2>📋 取引一覧</h2><div className="table"><div className="tr head"><b>日付</b><b>内容</b><b>区分</b><b>金額</b><b>操作</b></div>{rows.map(r=><div className="tr" key={r.id}><span>{r.date.slice(5).replace("-","/")}</span><span>{r.memo}</span><strong className={colors[r.type]}>{r.type}</strong><b>¥{Number(r.amount).toLocaleString()}</b><span className="actions">{r.type==="未払い"&&<button onClick={()=>pay(r.id)}>支払済</button>}<button className="delete" onClick={()=>remove(r.id)}>削除</button></span></div>)}</div></section>
 <section className="yayoiInfo"><b>📘 弥生会計</b><span>仕訳確認 → CSV作成 → 弥生へ取り込み</span><button onClick={exportYayoi}>CSV作成</button></section>
 <footer>Next.js / Google Cloud対応 / 弥生会計CSV対応</footer></main>
}
function Action({c,icon,t,sub,onClick,children}){return <article className={"action "+c} onClick={onClick}><div className="icon">{icon}</div><h2>{t}</h2><strong>{sub}</strong>{children}</article>}
