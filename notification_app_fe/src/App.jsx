import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  // 🔑 get token
  const getToken = async () => {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/auth",
      {
        email: "vp8180@srmist.edu.in",
        name: "Vishva Parishad V B",
        rollNo: "RA2311053040012",
        accessCode: "QkbpxH",
        clientID: "83dbffa0-fc87-4da7-953e-790152fd86cf",
        clientSecret: "JxTBxBbKFRnRVJTY"
      }
    );
    return res.data.access_token;
  };

  const log = async (message, token) => {
    try {
      await axios.post(
        "http://20.207.122.201/evaluation-service/logs",
        {
          stack: "frontend",
          level: "info",
          package: "component",
          message
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch {}
  };

  const getWeight = (type) => {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    return 1;
  };

  const fetchNotifications = async () => {
    const token = await getToken();

    await log("Fetching notifications", token);

    const res = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = res.data.notifications;

    const sorted = data
      .map((n) => ({
        ...n,
        score: getWeight(n.Type) + new Date(n.Timestamp).getTime()
      }))
      .sort((a, b) => b.score - a.score);

    setNotifications(sorted);

    await log("Loaded notifications", token);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.Type === filter);

  const top10 = notifications.slice(0, 10);

  // 🕒 Date + Time
  const now = new Date();
  const date = now.toDateString();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div>{date}</div>
        <h1>Campus Notifier</h1>
        <div>{time}</div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* LEFT */}
        <div className="box">
          <h2>Top 10 notifications</h2>

          {top10.map((n) => (
            <div key={n.ID} className="card">
              <b>{n.Type}</b>
              <p>{n.Message}</p>
              <small>{n.Timestamp}</small>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="box">
          <div className="top-bar">
            <h2>All notifications</h2>

            <select onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Event</option>
              <option>Result</option>
              <option>Placement</option>
            </select>
          </div>

          {filtered.map((n) => (
            <div key={n.ID} className="card">
              <b>{n.Type}</b>
              <p>{n.Message}</p>
              <small>{n.Timestamp}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}