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
        const events = await res.json();
        successCallback(events);
      } catch (err) {
        console.error("Failed to load calendar events", err);
        failureCallback(err);
      }
    },
    eventClick: function(info) {
      info.jsEvent.preventDefault(); // Prevent default behavior
      if (info.event.url) {
        window.open(info.event.url, "_blank");
      }
    }
  });

  setTimeout(() => calendar.render(), 50);
});

