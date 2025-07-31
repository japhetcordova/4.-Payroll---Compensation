let payrollData = [
  { name: "Alice", role: "Engineer", salary: 70000 },
  { name: "Bob", role: "Accountant", salary: 50000 },
  { name: "Charlie", role: "Manager", salary: 80000 },
  { name: "Diana", role: "HR", salary: 45000 },
  { name: "Eve", role: "Engineer", salary: 72000 },
  { name: "Frank", role: "Accountant", salary: 52000 },
  { name: "Grace", role: "Manager", salary: 83000 },
  { name: "Hank", role: "HR", salary: 47000 },
  { name: "Ivy", role: "Engineer", salary: 71000 },
  { name: "Jack", role: "Engineer", salary: 70000 },
  { name: "Karen", role: "Accountant", salary: 51000 },
  { name: "Leo", role: "Manager", salary: 84000 },
  { name: "Mona", role: "HR", salary: 46000 },
  { name: "Nate", role: "Engineer", salary: 73000 },
  { name: "Olive", role: "Accountant", salary: 53000 },
  { name: "Paul", role: "Manager", salary: 86000 },
  { name: "Quinn", role: "HR", salary: 48000 },
  { name: "Rose", role: "Engineer", salary: 75000 },
  { name: "Steve", role: "Accountant", salary: 54000 },
  { name: "Tina", role: "Manager", salary: 87000 },
  { name: "Uma", role: "HR", salary: 49000 },
  { name: "Vince", role: "Engineer", salary: 76000 }
];

let currentPage = 1;
let editIndex = null;
const rowsPerPage = 10;

function calculateNet(salary) {
  const tax = salary * 0.15;
  return { tax, net: salary - tax };
}

function renderTable(data) {
  const tbody = document.getElementById("payrollBody");
  tbody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const paginated = data.slice(start, start + rowsPerPage);
  paginated.forEach((p, i) => {
    const { tax, net } = calculateNet(p.salary);
    tbody.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.role}</td>
        <td>${p.salary}</td>
        <td>${tax.toFixed(2)}</td>
        <td>${net.toFixed(2)}</td>
        <td>
          <button onclick="openModal(${start + i})">Edit</button>
          <button onclick="deleteRecord(${start + i})">Delete</button>
        </td>
      </tr>`;
  });
  renderPagination(data.length);
  updateChart(data);
  updateTimestamp();
}

function renderPagination(total) {
  const container = document.getElementById("pagination");
  const pages = Math.ceil(total / rowsPerPage);
  container.innerHTML = "";
  for (let i = 1; i <= pages; i++) {
    container.innerHTML += `<button onclick="goToPage(${i})">${i}</button>`;
  }
}

function goToPage(n) {
  currentPage = n;
  filterAndRender();
}

function openModal(index) {
  editIndex = index;
  const p = payrollData[index];
  document.getElementById("editName").value = p.name;
  document.getElementById("editRole").value = p.role;
  document.getElementById("editSalary").value = p.salary;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function saveEdit() {
  const name = document.getElementById("editName").value.trim();
  const role = document.getElementById("editRole").value.trim();
  const salary = parseFloat(document.getElementById("editSalary").value);
  if (!name || !role || isNaN(salary)) {
    alert("Please fill in all fields correctly.");
    return;
  }
  payrollData[editIndex] = { name, role, salary };
  closeModal();
  filterAndRender();
}

function deleteRecord(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    payrollData.splice(index, 1);
    const filtered = getFilteredData();
    const maxPage = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage > maxPage) currentPage = maxPage;
    filterAndRender();
  }
}

function getFilteredData() {
  const q = document.getElementById("search").value.toLowerCase();
  return payrollData.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.role.toLowerCase().includes(q)
  );
}

function filterAndRender() {
  const filtered = getFilteredData();
  renderTable(filtered);
}

document.getElementById("search").addEventListener("input", () => {
  currentPage = 1;
  filterAndRender();
});

function downloadPDF() {
  const area = document.getElementById("reportArea");
  html2pdf().from(area).save("payroll_report.pdf");
}

function updateTimestamp() {
  document.getElementById("timestamp").textContent =
    "Generated on: " + new Date().toLocaleString();
}

window.onload = filterAndRender;
