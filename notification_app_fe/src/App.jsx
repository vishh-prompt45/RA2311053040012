import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem
} from "@mui/material";
import axios from "axios";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2cDgxODBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDQyNSwiaWF0IjoxNzc3NzAzNTI1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzdkNjE5MzAtZWU4Zi00NWU5LWE3ZDQtOWY0OTBmYjRkZGQ0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaHZhIHBhcmlzaGFkIHYgYiIsInN1YiI6IjgzZGJmZmEwLWZjODctNGRhNy05NTNlLTc5MDE1MmZkODZjZiJ9LCJlbWFpbCI6InZwODE4MEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InZpc2h2YSBwYXJpc2hhZCB2IGIiLCJyb2xsTm8iOiJyYTIzMTEwNTMwNDAwMTIiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI4M2RiZmZhMC1mYzg3LTRkYTctOTUzZS03OTAxNTJmZDg2Y2YiLCJjbGllbnRTZWNyZXQiOiJKeFRCeEJiS0ZSblJWSlRZIn0.LMfHldfr59IGLjX2TClsDBxnIOXvjSN0WR0IcKLhfTw";

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  const log = async (message) => {
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
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );
    } catch (err) {
      console.error("log failed");
    }
  };

  const getWeight = (type) => {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    return 1;
  };

  const fetchNotifications = async () => {
    try {
      log("Fetching notifications");

      const res = await axios.get(
        "http://20.207.122.201/evaluation-service/notifications",
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );

      const data = res.data.notifications;

      const scored = data.map(n => ({
        ...n,
        score: getWeight(n.Type) + new Date(n.Timestamp).getTime()
      }));

      const sorted = scored.sort((a, b) => b.score - a.score);

      setNotifications(sorted);
      log("Notifications loaded");

    } catch (err) {
      log("Error fetching notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter(n => n.Type === filter);

  const top10 = notifications.slice(0, 10);

  return (
    <div style={{ padding: "20px" }}>
  <Typography variant="h3">Campus Notifications</Typography>

  <Typography variant="h5">Filter</Typography>
  <Select
    value={filter}
    onChange={(e) => {
      setFilter(e.target.value);
      log("Filter changed");
    }}
  >
    <MenuItem value="All">All</MenuItem>
    <MenuItem value="Event">Event</MenuItem>
    <MenuItem value="Result">Result</MenuItem>
    <MenuItem value="Placement">Placement</MenuItem>
  </Select>

  <Typography variant="h5" style={{ marginTop: "20px" }}>
    Top 10 Priority Notifications
  </Typography>

  {top10.map((n) => (
    <Card key={n.ID} style={{ margin: "10px 0" }}>
      <CardContent>
        <Typography variant="h6">{n.Type}</Typography>
        <Typography>{n.Message}</Typography>
        <Typography variant="caption">{n.Timestamp}</Typography>
      </CardContent>
    </Card>
  ))}

  <Typography variant="h5" style={{ marginTop: "20px" }}>
    All Notifications
  </Typography>

  {filtered.map((n) => (
    <Card key={n.ID} style={{ margin: "10px 0" }}>
      <CardContent>
        <Typography variant="h6">{n.Type}</Typography>
        <Typography>{n.Message}</Typography>
        <Typography variant="caption">{n.Timestamp}</Typography>
      </CardContent>
    </Card>
  ))}
</div>
  );
}