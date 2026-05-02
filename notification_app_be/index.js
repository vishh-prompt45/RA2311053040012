const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2cDgxODBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMzQzMCwiaWF0IjoxNzc3NzAyNTMwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNWQ0NGYyNTUtNmMyZi00MWU5LWFhMDctN2U1NjdmN2VkMjcxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmlzaHZhIHBhcmlzaGFkIHYgYiIsInN1YiI6IjgzZGJmZmEwLWZjODctNGRhNy05NTNlLTc5MDE1MmZkODZjZiJ9LCJlbWFpbCI6InZwODE4MEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InZpc2h2YSBwYXJpc2hhZCB2IGIiLCJyb2xsTm8iOiJyYTIzMTEwNTMwNDAwMTIiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI4M2RiZmZhMC1mYzg3LTRkYTctOTUzZS03OTAxNTJmZDg2Y2YiLCJjbGllbnRTZWNyZXQiOiJKeFRCeEJiS0ZSblJWSlRZIn0.qBT9uP1i0UsomsU-HImrBr2Qk1m78t9dpvfXJyKaDm0";

async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("Logging failed");
  }
}

function getWeight(type) {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  return 1;
}

async function getTopNotifications() {
  try {
    Log("backend", "info", "service", "Fetching notifications");

    const res = await axios.get(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const notifications = res.data.notifications;

    Log("backend", "info", "service", "Calculating priority");

    const scored = notifications.map(n => ({
      ...n,
      score: getWeight(n.Type) + new Date(n.Timestamp).getTime()
    }));

    Log("backend", "info", "service", "Sorting");

    const sorted = scored.sort((a, b) => b.score - a.score);

    const top10 = sorted.slice(0, 10);

    Log("backend", "info", "service", "Top 10 ready");

    console.log("\nTOP 10:\n", top10);

  } catch (err) {
    Log("backend", "error", "service", "Error occurred");
    console.error(err);
  }
}

getTopNotifications();