"use client";

import { useMemo, useState } from "react";

const TIMES = ["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30"];
const MENUS = [
  { id: "Aコース", className: "menu-a", note: "夜限定コース" },
  { id: "Bコース", className: "menu-b", note: "夜限定コース" },
  { id: "アラカルト", className: "menu-c", note: "単品料理" }
];

export default function Home() {
  const [form, setForm] = useState({
    date: "",
    time: "18:00",
    guests: 2,
    menu: "Aコース",
    name: "",
    phone: "",
    allergy: "",
    request: ""
  });
  const [done, setDone] = useState(false);

  const summary = useMemo(() => (
    `${form.date || "日付未選択"} / ${form.time} / ${form.guests}名 / ${form.menu}`
  ), [form]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  function submit(e) {
    e.preventDefault();
    const reservations = JSON.parse(localStorage.getItem("musubiReservations") || "[]");
    reservations.push({ ...form, id: Date.now(), status: "予約済" });
    localStorage.setItem("musubiReservations", JSON.stringify(reservations));
    setDone(true);
  }

  if (done) {
    return (
      <main className="wrap">
        <section className="hero">
          <div className="noren">結食堂</div>
          <p>昭和の味と、ほっとする夜ごはん。</p>
        </section>
        <section className="card complete">
          <div className="stamp">予約完了</div>
          <h1>ご予約ありがとうございます</h1>
          <p>{summary}</p>
          <p>{form.name} 様</p>
          <button onClick={() => setDone(false)} className="primary">続けて予約する</button>
          <a href="/admin" className="admin-link">店舗管理画面へ</a>
        </section>
      </main>
    );
  }

  return (
    <main className="wrap">
      <section className="hero">
        <div className="noren">結食堂</div>
        <p>昼はランチ営業・ご予約不要です。夜のみご予約を承ります。</p>
      </section>

      <form className="card" onSubmit={submit}>
        <h1>夜のご予約</h1>
        <div className="notice">昼のランチは予約不要です。直接ご来店ください。</div>

        <label>1. ご来店日
          <input type="date" required value={form.date} onChange={e => update("date", e.target.value)} />
        </label>

        <label>2. ご来店時間
          <select value={form.time} onChange={e => update("time", e.target.value)}>
            {TIMES.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>

        <label>3. 人数
          <select value={form.guests} onChange={e => update("guests", Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}名</option>)}
          </select>
        </label>

        <fieldset>
          <legend>4. お料理</legend>
          <div className="menu-grid">
            {MENUS.map(m => (
              <label key={m.id} className={`menu-box ${m.className} ${form.menu === m.id ? "selected" : ""}`}>
                <input type="radio" name="menu" value={m.id} checked={form.menu === m.id} onChange={() => update("menu", m.id)} />
                <strong>{m.id}</strong>
                <span>{m.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label>5. お名前
          <input required placeholder="例：坂上 勝一" value={form.name} onChange={e => update("name", e.target.value)} />
        </label>

        <label>6. 電話番号
          <input required inputMode="tel" placeholder="090-1234-5678" value={form.phone} onChange={e => update("phone", e.target.value)} />
        </label>

        <label>7. アレルギー
          <textarea placeholder="なければ空欄でOKです" value={form.allergy} onChange={e => update("allergy", e.target.value)} />
        </label>

        <label>8. ご要望
          <textarea placeholder="席の希望など" value={form.request} onChange={e => update("request", e.target.value)} />
        </label>

        <div className="summary">
          <strong>予約内容</strong>
          <span>{summary}</span>
        </div>

        <button className="primary" type="submit">この内容で予約する</button>
      </form>
      <a href="/admin" className="admin-link">店舗管理画面</a>
    </main>
  );
}
