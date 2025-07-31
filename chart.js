let chart;

function updateChart(data) {
  const ctx = document.getElementById("payrollChart").getContext("2d");
  const roles = {};
  data.forEach(p => {
    if (!roles[p.role]) roles[p.role] = 0;
    roles[p.role] += p.salary;
  });

  const labels = Object.keys(roles);
  const values = Object.values(roles);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Total Salary by Role',
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#71B37C'],
      }]
    }
  });
}
