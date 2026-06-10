import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
);

function AnalyticsCharts({ analytics }) {
  const subjectLabels = Object.keys(analytics?.subjectDistribution || {});
  const subjectValues = subjectLabels.map(
    (k) => analytics.subjectDistribution[k],
  );

  const priorityLabels = Object.keys(analytics?.priorityDistribution || {});
  const priorityValues = priorityLabels.map(
    (k) => analytics.priorityDistribution[k],
  );

  const completionData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [analytics?.completedTasks || 0, analytics?.pendingTasks || 0],
        backgroundColor: ["#4caf50", "#ff9800"],
      },
    ],
  };

  const priorityData = {
    labels: priorityLabels,
    datasets: [
      {
        label: "Tasks by Priority",
        data: priorityValues,
        backgroundColor: ["#8bc34a", "#ffc107", "#f44336"],
      },
    ],
  };

  const subjectData = {
    labels: subjectLabels,
    datasets: [
      {
        label: "Tasks by Subject",
        data: subjectValues,
        backgroundColor: subjectLabels.map(
          (_, i) => `hsl(${(i * 60) % 360} 70% 50%)`,
        ),
      },
    ],
  };

  // Trend chart: provide simple two-point trend (completed vs total) as placeholder
  const trendData = {
    labels: ["Completed %"],
    datasets: [
      {
        label: "Completion %",
        data: [
          analytics?.completionPercentage
            ? Number(analytics.completionPercentage.toFixed(1))
            : 0,
        ],
        borderColor: "#3f51b5",
        backgroundColor: "#3f51b5",
        fill: false,
      },
    ],
  };

  return (
    <div className="analytics-grid">
      <div className="chart-card">
        <h4>Completed vs Pending</h4>
        <div className="chart-body">
          <Pie data={completionData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="chart-card">
        <h4>Tasks by Priority</h4>
        <div className="chart-body">
          <Bar data={priorityData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="chart-card">
        <h4>Tasks by Subject</h4>
        <div className="chart-body">
          <Bar data={subjectData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="chart-card">
        <h4>Completion Percentage</h4>
        <div className="chart-body">
          <Line data={trendData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCharts;
