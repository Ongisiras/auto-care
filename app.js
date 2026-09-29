/* =========================================
   AUTOCARE CHECK
   VERSION 2 - GITHUB PAGES
========================================= */


/* =========================================
   DATABASE SEMENTARA
========================================= */

const STORAGE_KEY = "autocare_records";

let records =
  JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );


/* =========================================
   HELPER
========================================= */

function el(id) {
  return document.getElementById(id);
}


function val(id) {
  return el(id).value;
}


/* =========================================
   LOGIN
========================================= */

function login() {

  const username =
    val("username");

  const password =
    val("password");


  if (
    username === "teknisi" &&
    password === "123"
  ) {

    el("loginPage")
      .classList.add("hidden");

    el("app")
      .classList.remove("hidden");

    setToday();

    updateDashboard();

    renderHistory();

  } else {

    alert(
      "Username atau password salah."
    );

  }

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

  location.reload();

}


/* =========================================
   SIDEBAR
========================================= */

function toggleMenu() {

  const sidebar =
    el("sidebar");

  if (
    sidebar.style.display === "none"
  ) {

    sidebar.style.display = "block";

  } else {

    sidebar.style.display = "none";

  }

}


/* =========================================
   PAGE
========================================= */

function showPage(page) {

  document
    .querySelectorAll(".page")
    .forEach(
      pageElement =>
        pageElement.classList.add("hidden")
    );


  if (page === "dashboard") {

    el("dashboardPage")
      .classList.remove("hidden");

    updateDashboard();

  }


  if (page === "inspection") {

    el("inspectionPage")
      .classList.remove("hidden");

  }


  if (page === "history") {

    el("historyPage")
      .classList.remove("hidden");

    renderHistory();

  }

}


/* =========================================
   TANGGAL
========================================= */

function setToday() {

  const today =
    new Date()
      .toISOString()
      .substring(0,10);

  el("date").value = today;

}


/* =========================================
   SIMPAN PEMERIKSAAN
========================================= */

function saveInspection() {

  const nopol =
    val("nopol").trim();

  const km =
    val("km").trim();


  if (!nopol) {

    alert(
      "Nopol wajib diisi."
    );

    return;

  }


  if (!km) {

    alert(
      "Kilometer wajib diisi."
    );

    return;

  }


  const record = {

    id: Date.now(),

    date:
      val("date"),

    nopol:
      nopol.toUpperCase(),

    km:
      km,

    customer:
      val("customer"),

    vehicle:
      val("vehicle"),

    technician:
      val("technician"),

    body:
      val("body"),

    battery:
      val("battery"),

    tires:
      val("tires"),

    engineOil:
      val("engineOil"),

    coolant:
      val("coolant"),

    lights:
      val("lights"),

    belt:
      val("belt"),

    electrical:
      val("electrical"),

    notes:
      val("notes"),

    photo:
      el("photo").files.length
        ? el("photo").files[0].name
        : "",

    signature:
      getSignature()

  };


  records.unshift(record);


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  );


  alert(
    "✅ Pemeriksaan berhasil disimpan."
  );


  resetForm();

  updateDashboard();

  renderHistory();

  showPage("dashboard");

}


/* =========================================
   SIGNATURE
========================================= */

const canvas =
  document.getElementById("signature");

const ctx =
  canvas.getContext("2d");


let drawing = false;


function resizeCanvas() {

  const ratio =
    window.devicePixelRatio || 1;


  canvas.width =
    canvas.clientWidth * ratio;


  canvas.height =
    canvas.clientHeight * ratio;


  ctx.scale(
    ratio,
    ratio
  );


  ctx.lineWidth = 2;

  ctx.lineCap = "round";

}


resizeCanvas();


window.addEventListener(
  "resize",
  resizeCanvas
);


function position(event) {

  const rect =
    canvas.getBoundingClientRect();


  const source =
    event.touches
      ? event.touches[0]
      : event;


  return [

    source.clientX -
      rect.left,

    source.clientY -
      rect.top

  ];

}


function startDrawing(event) {

  drawing = true;

  const [
    x,
    y
  ] =
    position(event);


  ctx.beginPath();

  ctx.moveTo(
    x,
    y
  );


  event.preventDefault();

}


function draw(event) {

  if (!drawing)
    return;


  const [
    x,
    y
  ] =
    position(event);


  ctx.lineTo(
    x,
    y
  );

  ctx.stroke();


  event.preventDefault();

}


function stopDrawing() {

  drawing = false;

}


canvas.addEventListener(
  "mousedown",
  startDrawing
);

canvas.addEventListener(
  "mousemove",
  draw
);

canvas.addEventListener(
  "mouseup",
  stopDrawing
);


canvas.addEventListener(
  "touchstart",
  startDrawing,
  { passive:false }
);

canvas.addEventListener(
  "touchmove",
  draw,
  { passive:false }
);

canvas.addEventListener(
  "touchend",
  stopDrawing
);


function clearSignature() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


function getSignature() {

  return canvas.toDataURL(
    "image/png"
  );

}


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

  const fields = [

    "nopol",
    "km",
    "customer",
    "vehicle",
    "body",
    "battery",
    "tires",
    "engineOil",
    "coolant",
    "lights",
    "belt",
    "electrical",
    "notes"

  ];


  fields.forEach(
    id => {

      el(id).value = "";

    }
  );


  el("technician").value =
    "Teknisi";


  el("photo").value =
    "";


  setToday();

  clearSignature();

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

  el("totalData")
    .textContent =
    records.length;


  const today =
    new Date()
      .toISOString()
      .substring(0,10);


  const todayRecords =
    records.filter(
      record =>
        record.date === today
    );


  el("todayData")
    .textContent =
    todayRecords.length;


  renderLatest();

}


/* =========================================
   DATA TERBARU
========================================= */

function renderLatest() {

  const container =
    el("latestData");


  if (records.length === 0) {

    container.innerHTML = `

      <div class="empty">

        Belum ada pemeriksaan.

      </div>

    `;

    return;

  }


  container.innerHTML =
    records
      .slice(0,5)
      .map(
        record => `

          <div style="
            padding:15px;
            border-bottom:1px solid #eee;
          ">

            <strong>
              ${record.nopol}
            </strong>

            <br>

            ${record.vehicle || "-"}

            <br>

            <small>

              ${record.customer || "-"}

              • KM ${record.km}

              • ${record.date}

            </small>

          </div>

        `
      )
      .join("");

}


/* =========================================
   RIWAYAT
========================================= */

function renderHistory() {

  const tbody =
    el("historyTable");


  const search =
    (el("search")?.value || "")
      .toLowerCase();


  const filtered =
    records.filter(
      record => {

        const text = (

          record.nopol +
          " " +
          record.customer +
          " " +
          record.vehicle

        ).toLowerCase();


        return text.includes(
          search
        );

      }
    );


  if (
    filtered.length === 0
  ) {

    tbody.innerHTML = `

      <tr>

        <td colspan="6">

          <div class="empty">

            Belum ada data pemeriksaan.

          </div>

        </td>

      </tr>

    `;

    return;

  }


  tbody.innerHTML =
    filtered
      .map(
        record => `

          <tr>

            <td>
              ${record.date || "-"}
            </td>

            <td>
              <strong>
                ${record.nopol}
              </strong>
            </td>

            <td>
              ${record.customer || "-"}
            </td>

            <td>
              ${record.vehicle || "-"}
            </td>

            <td>
              ${record.km}
            </td>

            <td>

              <button
                class="btn btn-secondary"
                onclick="showDetail(${record.id})"
              >
                Detail
              </button>

              <button
                class="btn btn-primary"
                onclick="deleteRecord(${record.id})"
              >
                Hapus
              </button>

            </td>

          </tr>

        `
      )
      .join("");

}


/* =========================================
   DETAIL
========================================= */

function showDetail(id) {

  const record =
    records.find(
      item =>
        item.id === id
    );


  if (!record)
    return;


  alert(

    "DETAIL PEMERIKSAAN\n\n" +

    "Nopol : " +
    record.nopol +

    "\nCustomer : " +
    (record.customer || "-") +

    "\nKendaraan : " +
    (record.vehicle || "-") +

    "\nKM : " +
    record.km +

    "\nTanggal : " +
    (record.date || "-") +

    "\nTeknisi : " +
    (record.technician || "-") +

    "\n\nBODY:\n" +
    (record.body || "-") +

    "\n\nAKI:\n" +
    (record.battery || "-") +

    "\n\nBAN:\n" +
    (record.tires || "-") +

    "\n\nOLI:\n" +
    (record.engineOil || "-") +

    "\n\nCOOLANT:\n" +
    (record.coolant || "-") +

    "\n\nLAMPU:\n" +
    (record.lights || "-") +

    "\n\nV-BELT:\n" +
    (record.belt || "-") +

    "\n\nKELISTRIKAN:\n" +
    (record.electrical || "-") +

    "\n\nCATATAN:\n" +
    (record.notes || "-")

  );

}


/* =========================================
   DELETE
========================================= */

function deleteRecord(id) {

  if (
    !confirm(
      "Hapus pemeriksaan ini?"
    )
  ) {

    return;

  }


  records =
    records.filter(
      record =>
        record.id !== id
    );


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records)
  );


  updateDashboard();

  renderHistory();

}
