# 💻 ASTRA - Asset Lifecycle & Maintenance Dashboard

**ASTRA** is a full-featured IT asset management system built with modern web technologies. It helps IT teams track hardware assets throughout their lifecycle—from acquisition to retirement—with real-time updates, visual dashboards, calendar scheduling, and editing capabilities.

---

## Features

- **Asset Database:** Add, edit, view, and delete hardware assets with details like type, cost, vendor, lifespan, status, owner, and location.
  
- **Interactive Dashboard:** View asset statistics by type, OS, location, and status using Chart.js doughnut charts.
  
- **Maintenance Calendar:** Visualize upcoming maintenance due dates using FullCalendar.
  
- **Smart Sidebar Navigation:** Fully styled and responsive sidebar with consistent design across pages.
  
- **Live Search:** Dynamic search with suggestions to quickly locate and jump to asset detail pages.
  
- **Edit Modal:** Inline editing with validation for asset data, saving changes via RESTful API to a SQL backend.
  
- **FAQ & Contact Pages:** Support pages for frequently asked questions and user feedback.
  
- **User Management:** (Optional) Backend-ready user database support.
  
- **Dark Mode:** Toggle between light and dark themes.
  
- **Login/Logout System:** Role-based access control for admins and guests (extendable).

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript
- **Charts & Calendar:** [Chart.js](https://www.chartjs.org), [FullCalendar](https://fullcalendar.io)
- **Backend:** Node.js + Express.js
- **Database:** MySQL (via MySQL Workbench)
- **Others:** Font Awesome, LocalStorage for session roles, JSON-Server (optional for testing)

---

## 📂 Project Structure

```
/project-root
│
├── homepage.html           → Dashboard with charts & summary cards
├── database.html           → Asset table with add/edit/delete modals
├── detail.html             → Full asset info page with edit modal
├── calendar.html           → Visual calendar for maintenance events
├── contact.html            → Contact form & FAQ
├── faq.html                → Frequently asked questions
├── asset-list.html         → Table listing all assets
├── users-database.html     → User management (optional)
│
├── images/                 → Logos and icons
├── styles/                 → Custom CSS if extracted
├── backend/ (astra-backend)
│   └── index.js            → Node.js + Express server
│
└── README.md               → This file
```

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/nonkylmik/my-astra-project.git
   cd my-astra-project
   ```

2. **Set up the backend**
   - Install dependencies:
     ```bash
     cd astra-backend
     npm install
     ```
   - Start the server:
     ```bash
     node index.js
     ```
   - Make sure MySQL is running and the `my_astra` database is created with the correct schema.

3. **Open frontend**
   - Open `homepage.html` in your browser.
   - Login system uses LocalStorage (`role` and `isLoggedIn` values).

---

## 📌 Notes

- Edit `index.js` to match your local MySQL credentials.
- You can use `json-server` for simulating backend if needed.
- Add your own authentication logic if deploying publicly.
- Be sure to populate the database with some initial asset records.

---

## 📸 Preview


## 🧑‍💻 Author

Made with ❤️ by [Karl] – Logistics IT Systems Specialist  
Feel free to fork, contribute, and report bugs.
