document.addEventListener("DOMContentLoaded", async function () {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const res = await fetch("http://localhost:3000/calendar-events");
        const data = await res.json();

        // Assign colors based on status
        const events = data.map(event => {
          let color = "#3498db"; // default blue

          switch ((event.status || "").toLowerCase()) {
            case "active":
              color = "#2ecc71"; // green
              break;
            case "due":
              color = "#e74c3c"; // red
              break;
            case "maintenance":
              color = "#f39c12"; // orange
              break;
            case "retired":
              color = "#95a5a6"; // grey
              break;
            case "completed":
              color = "#1abc9c"; // teal
              break;
          }

          return {
            title: event.title,
            start: event.start,
            url: event.url,
            color: color
          };
        });

        successCallback(events);
      } catch (err) {
        console.error("Failed to load calendar events", err);
        failureCallback(err);
      }
    }
  });

  calendar.render();
});

