document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    contentHeight: "auto",
    expandRows: true,
    headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    events: getMaintenanceEventsFromDevices()
    });

    // 🔥 Delay render until layout is stable
    setTimeout(() => {
    calendar.render();
    }, 50); // Try 100 if needed
});

