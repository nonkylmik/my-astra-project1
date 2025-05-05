// assets/script.js
console.log("MY-ASTRA is alive!");

const devicesEndpoint = "http://localhost:3000/assets";

// --- Modal Logic ---
function openModal() {
  const modal = document.getElementById("modalOverlay");
  if (modal) modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("modalOverlay");
  if (modal) modal.style.display = "none";
}

window.addEventListener("click", function (event) {
  const overlay = document.getElementById("modalOverlay");
  const modalBox = document.getElementById("modalBox");
  if (event.target === overlay && overlay && modalBox) {
    overlay.style.display = "none";
  }
});

// --- Fetch and Render Devices from JSON Server ---
function fetchDevices() {
  fetch(devicesEndpoint)
    .then(res => res.json())
    .then(data => {
      data.forEach(device => addDeviceToTable(device));
    });
}

// --- Save New Asset to JSON Server ---
function saveToDatabase(newDevice) {
  fetch(devicesEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newDevice)
  })
    .then(res => res.json())
    .then(data => {
      addDeviceToTable(data);
    });
}

// --- Create & Insert a Device Row ---
function addDeviceToTable(device) {
  const tbody = document.getElementById("asset-table-body") || document.getElementById("databaseTableBody");
  if (!tbody) return;

  const row = document.createElement("tr");
  const statusSpan = document.createElement("span");
  statusSpan.classList.add("status");

  const today = new Date();
  const lastMaintenanceDate = new Date(device.lastMaintenance);
  const nextMaintenanceDate = new Date(lastMaintenanceDate);
  nextMaintenanceDate.setDate(lastMaintenanceDate.getDate() + device.intervalDays);

  if (today > nextMaintenanceDate) {
    statusSpan.textContent = "Maintenance Due";
    statusSpan.classList.add("due");
  } else {
    statusSpan.textContent = "Active";
    statusSpan.classList.add("active");
  }

  row.innerHTML = `
    <td><a class="asset-id" href="detail.html?sn=${encodeURIComponent(device.id)}">${device.name}</a></td>
    <td>${device.id}</td>
    <td>${device.location || "-"}</td>
    <td>${statusSpan.outerHTML}</td>
    <td>${device.lastMaintenance}</td>
  `;

  tbody.appendChild(row);
}

// --- Handle New Asset Form ---
function handleNewAssetSubmit() {
  const form = document.getElementById("assetForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const newDevice = {
      id: formData.get("id"),
      name: formData.get("name"),
      purchaseDate: formData.get("purchaseDate"),
      lifespanYears: parseInt(formData.get("lifespanYears")),
      intervalDays: parseInt(formData.get("intervalDays")),
      lastMaintenance: formData.get("lastMaintenance")
    };

    saveToDatabase(newDevice);
    closeModal();
    form.reset();
  });
}

// --- Role Restrictions ---
function handleRoleRestrictions() {
  const role = localStorage.getItem("role");
  const addBtn = document.getElementById("addAssetBtn");
  if (role === "guest" && addBtn) {
    addBtn.style.display = "none";
  }
}

// --- Maintenance Events ---
function getMaintenanceEventsFromDevices() {
  return fetch(devicesEndpoint)
    .then(res => res.json())
    .then(devices => {
      return devices.map(device => ({
        title: `Maintenance: ${device.name}`,
        start: device.lastMaintenance,
        color: "#f39c12"
      }));
    });
}

// --- Init Everything on Page Load ---
document.addEventListener("DOMContentLoaded", () => {
  const onAssetList = window.location.pathname.includes("asset-list.html");

  if (!onAssetList) {
    fetchDevices();  // ✅ Only run if we're NOT on asset-list.html
  }

  handleNewAssetSubmit();
  handleRoleRestrictions();
});
