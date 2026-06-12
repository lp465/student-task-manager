import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

/* ---------------- PIE LABEL PLUGIN ---------------- */
const pieLabelsPlugin = {
  id: "pieLabels",
  afterDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);

    if (!meta?.data) return;

    const dataset = chart.data.datasets[0];
    const total = dataset.data.reduce((a, b) => a + b, 0);

    if (!total) return;

    ctx.save();

    meta.data.forEach((arc, i) => {
      const value = dataset.data[i];
      if (!value) return;

      const pct = ((value / total) * 100).toFixed(0);
      const { x, y } = arc.tooltipPosition();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(`${pct}%`, x, y);
    });

    ctx.restore();
  },
};

function AnalyticsCharts({
  analytics,
  overdueCount = 0,
  dueThisWeekCount = 0,
  pendingCount = 0,
}) {
  if (!analytics) return null;

const rawCategoryData = analytics.categoryDistribution || {};

const normalizedCategoryData = Object.entries(rawCategoryData).reduce(
  (acc, [key, value]) => {
    const label = key?.trim() ? key : "Uncategorized";
    acc[label] = (acc[label] || 0) + Number(value || 0);
    return acc;
  },
  {}
);
const categoryLabels = Object.keys(normalizedCategoryData);

const categoryValues = Object.values(normalizedCategoryData);

  const priorityLabels = Object.keys(analytics.priorityDistribution || {});
  const priorityValues = priorityLabels.map(
    (k) => analytics.priorityDistribution[k],
  );

  const completed = analytics.completedTasks || 0;
  const pending = analytics.pendingTasks || 0;
  const totalTasks = completed + pending;

  const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  const subjectColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  /* ---------------- COMPLETION PIE ---------------- */
  const completionData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#4caf50", "#ff9800"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { position: "bottom" },
    },
  };

  /* ---------------- PRIORITY ---------------- */
  const priorityData = {
    labels: priorityLabels,
    datasets: [
      {
        label: "Tasks",
        data: priorityValues,
        backgroundColor: ["#8bc34a", "#ffc107", "#f44336"],
      },
    ],
  };

  const priorityOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  /* ---------------- CATEGORY ---------------- */
  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Tasks",
        data: categoryValues,
        backgroundColor: categoryLabels.map(
          (_, i) => subjectColors[i % subjectColors.length],
        ),
      },
    ],
  };

  const categoryOptions = {
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  /* ---------------- DEADLINE STATUS ---------------- */

  const deadlineStatusData = {
    labels: ["Overdue", "Due Soon", "Remaining"],
    datasets: [
      {
        data: [
          overdueCount,
          dueThisWeekCount,
          Math.max(pendingCount - overdueCount - dueThisWeekCount, 0),
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
      },
    ],
  };

  const deadlineStatusOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  return (
    <div className="analytics-grid">
      {/* COMPLETION */}
      <div className="chart-card">
        <h4>Task Completion Overview</h4>
        <div className="chart-body">
          <Pie
            data={completionData}
            options={pieOptions}
            plugins={[pieLabelsPlugin]}
          />
        </div>
      </div>

      {/* PRIORITY */}
      <div className="chart-card">
        <h4>Task Priority Breakdown</h4>
        <div className="chart-body">
          <Bar data={priorityData} options={priorityOptions} />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="chart-card">
        <h4>Category Analysis</h4>
        <div className="chart-body">
          <Bar data={categoryData} options={categoryOptions} />
        </div>
      </div>

      {/* DEADLINE STATUS */}
<div className="chart-card">
  <h4>Deadline Status</h4>

  <div className="chart-body">
    <Pie
      data={deadlineStatusData}
      options={deadlineStatusOptions}
      plugins={[pieLabelsPlugin]}
    />
  </div>
</div>
    </div>
  );
}

export default AnalyticsCharts;
