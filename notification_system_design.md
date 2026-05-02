# Notification System Design

## Overview
System that fetches notifications from an API externally and displays them in a user friendly UI. Prioritizing notifications based on type and recency.

---

## Architecture

Frontend:
- Built using React (Vite)
- Uses Axios for API calls
- Displays:
  - Top 10 priority notifications
  - All notifications with filtering

Backend (given API):
- Provides notifications data
- Provides logging service

---

## Features

1. Fetch Notifications
- API: `/evaluation-service/notifications`
- Uses Bearer Token authentication

2. Logging
- API: `/evaluation-service/logs`
- Logs:
  - Fetch start
  - Success
  - Errors
  - Filter changes

3. Priority System
Each notification has a score:


Weights:
- Placement = 3 (highest priority)
- Result = 2
- Event = 1

Latest notifications get higher priority due to timestamp.

---

## UI Design

Layout:
- Header with date, title, and time
- Two panels:
  - Left: Top 10 notifications
  - Right: All notifications with filter

Components:
- Cards for each notification
- Dropdown filter

---

## Data Flow

1. App loads
2. Fetch notifications from API
3. Calculate score
4. Sort notifications
5. Render:
   - Top 10
   - Filtered list

---

## Technologies Used

- React (Vite)
- Axios
- Material UI
- JavaScript (ES6)

---

## Assumptions

- API is always available
- Token is valid during session
- Notifications contain:
  - ID
  - Type
  - Message
  - Timestamp

---

## Improvements (Future Scope)

- Real-time updates (WebSockets)
- Pagination
- Search functionality
- Better UI animations
- Token refresh handling

---












Postman:







App.jsx











