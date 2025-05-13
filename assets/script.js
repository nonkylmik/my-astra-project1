console.log("MY-ASTRA is alive!");

const devicesEndpoint = "http://localhost:8080/assets";
let editingAssetId = null; // Track which asset is being edited

// --- Modal Logic ---
function openModal(isEdit = false, asset = null) {
  const modal = document.getElementById("modalOverlay");
  const formTitle = document.querySelector("#modalBox h2");
  const submitBtn = document.querySelector("#assetForm button");

  if (modal) modal.style.display = "flex";

  formTitle.textContent = isEdit ? "Edit Asset" : "Add New Asset";
  submitBtn.textContent = isEdit ? "Update Asset" : "Save Asset";

  if (isEdit && asset) {
    editingAssetId = asset.id;
    document.querySelector("[name='id']").value = asset.id;
    document.querySelector("[name='name']").value = asset.name;
    document.querySelector("[name='purchaseDate']").value = asset.purchaseDate;
    document.querySelector("[name='lifespanYears']").value = asset.lifespan;
    document.querySelector("[name='maintenance_interval']").value = asset.maintenance_interval;
    document.querySelector("[name='lastMaintenance']").value = asset.maintenance_date;
    document.querySelector("[name='location']").value = asset.location;
    document.querySelector("[name='id']").disabled = true; // prevent editing ID
  } else {
    editingAssetId = null;
    document.getElementById("assetForm").reset();
    document.querySelector("[name='id']").disabled = false;
  }
}

function closeModal() {
  const modal = document.getElementById("modalOverlay");
  if (modal) modal.style.display = "none";
  editingAssetId = null;
}

window.addEventListener("click", function (event) {
  const overlay = document.getElementById("modalOverlay");
  const modalBox = document.getElementById("modalBox");
  if (event.target === overlay && overlay && modalBox) {
    overlay.style.display = "none";
  }
});

// --- Save or Update to Backend ---
function saveToDatabase(device) {
  const method = editingAssetId ? "PUT" : "POST";
  const url = editingAssetId ? `${devicesEndpoint}/${editingAssetId}` : devicesEndpoint;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(device)
  })
    .then(res => res.json())
    .then(() => {
      location.reload(); // reload to show latest list
    });
}

// --- Add Device Row ---
function addDeviceToTable(device) {
  const tbody = document.getElementById("asset-table-body");
  if (!tbody) return;

  const tr = document.createElement("tr");

  const nextDate = new Date(device.maintenance_date);
  nextDate.setDate(nextDate.getDate() + parseInt(device.maintenance_interval || 0));
  const nextMaintenance = isNaN(nextDate.getTime()) ? "—" : nextDate.toISOString().split("T")[0];

  let statusClass = "";
  const status = (device.status || "").toLowerCase();
  if (status === "active") statusClass = "status-active";
  else if (status === "inactive") statusClass = "status-inactive";
  else if (status.includes("maintenance")) statusClass = "status-maintenance";

  tr.innerHTML = `
    <td>${device.id}</td>
    <td><a href="detail.html?sn=${device.id}" style="color: #00f2fe; text-decoration: underline;">${device.name}</a></td>
    <td>${device.purchaseDate || "—"}</td>
    <td>${device.lifespan || "—"}</td>
    <td>${device.maintenance_interval || "—"}</td>
    <td>${device.maintenance_date ? device.maintenance_date.split("T")[0] : "—"}</td>
    <td>${nextMaintenance}</td>
    <td><span class="${statusClass}">${device.status || "Unknown"}</span></td>
    <td>${device.location || "—"}</td>
    <td><button class="edit-btn" data-id="${device.id}">Edit</button></td>
  `;

  tbody.appendChild(tr);
}

// --- Form Submit Handler ---
function handleNewAssetSubmit() {
  const form = document.getElementById("assetForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const device = {
      id: formData.get("id"),
      name: formData.get("name"),
      purchaseDate: formData.get("purchaseDate"),
      lifespan: parseInt(formData.get("lifespanYears")),
      maintenance_interval: parseInt(formData.get("maintenance_interval")),
      maintenance_date: formData.get("lastMaintenance"),
      location: formData.get("location"),
    };

    saveToDatabase(device);
    closeModal();
  });
}

// --- Load Assets and Add Edit Handlers ---
async function loadAssets() {
  try {
    const res = await fetch(devicesEndpoint);
    const assets = await res.json();
    const tbody = document.getElementById("asset-table-body");
    tbody.innerHTML = "";

    assets.forEach(asset => {
      addDeviceToTable(asset);
    });

    setTimeout(() => {
      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;
          const res = await fetch(`${devicesEndpoint}/${id}`);
          const data = await res.json();
          openModal(true, data);
        });
      });
    }, 100);
  } catch (err) {
    console.error("Error loading assets:", err);
  }
}

// --- Role Restriction ---
function handleRoleRestrictions() {
  const role = localStorage.getItem("role");
  const addBtn = document.getElementById("addAssetBtn");
  if (role === "guest" && addBtn) {
    addBtn.style.display = "none";
  }
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  const onAssetList = window.location.pathname.includes("asset-list.html");

  if (onAssetList) {
    loadAssets();
  }

  handleNewAssetSubmit();
  handleRoleRestrictions();
});
