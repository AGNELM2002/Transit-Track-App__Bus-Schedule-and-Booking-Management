# 🚍 TransitTrack – Bus Schedule & Seat Booking Management Portal

TransitTrack is a modern, responsive React web application designed for monitoring bus schedules, managing routes, and facilitating seat reservations. Featuring a sleek dark-themed UI, role-based access control, real-time seat availability previews, dynamic filtering, and client-side persistence, it provides a seamless transit management experience.

---

## ✨ Key Features

* **🎨 High-Contrast Dark UI:** Custom-styled dark design (`#0b0f19` base) built with React Bootstrap.
* **🔐 Role-Based Access Control (RBAC):** Admin and Passenger interfaces for schedule viewing, route creation, and booking.
* **🚍 Schedule Monitoring & Filtering:** Multi-field filtering by Bus Name, Departure Location, and Arrival Destination.
* **🎟️ Interactive Seat Selection:** Dynamic seating layout preview with real-time seat status tracking.
* **📍 Location & Navigation:** Integrated stop details, intermediate ETAs, and Google Maps location routing.
* **💾 Local Storage Persistence:** Preserves schedules, seat bookings, and user sessions across page reloads.

---

## 🛠️ Tech Stack

* **Frontend Library:** React (Single Page Application)
* **UI Framework:** React Bootstrap & Bootstrap 5
* **Routing:** React Router DOM (`v6`)
* **State & Storage:** React Hooks (`useState`, `useEffect`) + Browser `localStorage`
* **Version Control:** Git & GitHub

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine:

### Prerequisites
Ensure you have **Node.js** (v14+ recommended) and **npm** installed.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AGNELM2002/Transit-Track-App__Bus-Schedule-and-Booking-Management.git](https://github.com/AGNELM2002/Transit-Track-App__Bus-Schedule-and-Booking-Management.git)

## 📂 Project Structure
transit-track-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Home.jsx           # Landing page with hero banner & service cards
│   │   ├── Login.jsx          # Auth portal (Admin & User accounts)
│   │   ├── BusTable.jsx       # Interactive schedule table & filtering
│   │   ├── BusForm.jsx        # Admin route & schedule creation portal
│   │   ├── Booking.jsx        # Ticket booking & seat layout preview
│   │   └── BusDetail.jsx      # Route breakdown, stops, & Google Maps
│   ├── App.jsx                # Main application routes
│   ├── App.css                # Global dark theme CSS rules
│   └── index.js               # Application entry point
├── package.json
└── README.md
