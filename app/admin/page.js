"use client";

import { useEffect, useState } from "react";

export default function Admin() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("musubiReservations") || "[]"));
  }, []);

  function changeStatus(id, status) {
    const next = items.map(x => x.id === id ? { ...x, status } : x);
    setItems(next);
    localStorage.setItem("musubiReservations", JSON.stringify(next));
  }

  return (
    <main className="wrap admin">
      <section className="hero">
        <div className="noren">結食堂</div>
        <p>予約管理</p>
      </section>

      <section className="card">
        <div className="admin-head">
          <h1>夜の予約一覧</h1>
          <a href="/" className="back-link">予約画面へ</a>
        </div>

        <div className="legend">
          <span className="tag booked">予約済</span>
          <span className="tag arrived">来店済</span>
          <span className="tag cancelled">キャンセル</span>
        </div>

        {items.length === 0 ? (
          <p className="empty">まだ予約はありません。</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>日付</th><th>時間</th><th>名前</th><th>人数</th><th>料理</th><th>電話</th><th>アレルギー・要望</th><th>状態</th></tr>
              </thead>
              <tbody>
                {items.sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)).map(r => (
                  <tr key={r.id}>
                    <td>{r.date}</td><td>{r.time}</td><td>{r.name}</td><td>{r.guests}名</td>
                    <td><span className={`food-tag ${r.menu === "Aコース" ? "a" : r.menu === "Bコース" ? "b" : "c"}`}>{r.menu}</span></td>
                    <td>{r.phone}</td>
                    <td>{[r.allergy, r.request].filter(Boolean).join(" / ") || "—"}</td>
                    <td>
                      <select value={r.status} onChange={e => changeStatus(r.id, e.target.value)} className={r.status === "来店済" ? "status-arrived" : r.status === "キャンセル" ? "status-cancelled" : "status-booked"}>
                        <option>予約済</option><option>来店済</option><option>キャンセル</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
