import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Box
} from "@mui/material";

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // ✅ Get fresh token every time
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

  // ✅ Logging middleware
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
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (err) {
      console.error("log failed");
    }
  };

  // ✅ Weight logic
  const getWeight = (type) => {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    return 1;
  };

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      await log("Fetching notifications", token);

      const res = await axios.get(
        "http://20.207.122.201/evaluation-service/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = res.data.notifications;

      const scored = data.map((n) => ({
        ...n,
        score: getWeight(n.Type) + new Date(n.Timestamp).getTime()
      }));

      const sorted = scored.sort((a, b) => b.score - a.score);

      setNotifications(sorted);

      await log("Notifications loaded", token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Filter
  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.Type === filter);

  const top10 = notifications.slice(0, 10);

  return (
    <Box sx={{ padding: 4, background: "#0f172a", minHeight: "100vh" }}>
      <Typography variant="h3" color="white" gutterBottom>
        Campus Notifications
      </Typography>

      {/* Filter */}
      <Typography variant="h6" color="white">
        Filter
      </Typography>
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ background: "white", mb: 3 }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
      </Select>

      {/* Loading */}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Top 10 */}
          <Typography variant="h5" color="white" mt={2}>
            Top 10 Priority Notifications
          </Typography>

          {top10.map((n) => (
            <Card key={n.ID} sx={{ my: 1 }}>
              <CardContent>
                <Typography variant="h6">{n.Type}</Typography>
                <Typography>{n.Message}</Typography>
                <Typography variant="caption">{n.Timestamp}</Typography>
              </CardContent>
            </Card>
          ))}

          {/* All */}
          <Typography variant="h5" color="white" mt={3}>
            All Notifications
          </Typography>

          {filtered.map((n) => (
            <Card key={n.ID} sx={{ my: 1 }}>
              <CardContent>
                <Typography variant="h6">{n.Type}</Typography>
                <Typography>{n.Message}</Typography>
                <Typography variant="caption">{n.Timestamp}</Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}