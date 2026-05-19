import "./App.css";
import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {

  const [date, setDate] = useState("");
  const [benediction, setBenediction] = useState("");
  const [works, setWorks] = useState("");
  const [pups, setPups] = useState("");

  const [filter, setFilter] = useState("All");

  const [reports, setReports] = useState(() => {
    const savedReports =
      localStorage.getItem("reports");

    return savedReports
      ? JSON.parse(savedReports)
      : [];
  });

  const [task, setTask] = useState("");
  const [taskType, setTaskType] =
    useState("Work");

  const [tasks, setTasks] = useState(() => {
    const savedTasks =
      localStorage.getItem("tasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "reports",
      JSON.stringify(reports)
    );
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  const handleSave = () => {

    if (!date || !benediction || !works || !pups) {
      alert("Please fill all fields");
      return;
    }

    const percentage =
      ((Number(benediction) + Number(works)) / 12) * 100;

    const newReport = {
      date,
      benediction,
      works,
      pups,
      percentage: percentage.toFixed(1),
    };

    setReports([newReport, ...reports]);

    setDate("");
    setBenediction("");
    setWorks("");
    setPups("");
  };

  const addTask = () => {

    if (!task) {
      alert("Enter a task");
      return;
    }

    const newTask = {
      text: task,
      type: taskType,
    };

    setTasks([newTask, ...tasks]);

    setTask("");
  };

  const filteredReports = reports.filter((report) => {

    if (filter === "All") return true;

    const reportDate = new Date(report.date);
    const today = new Date();

    if (filter === "Daily") {

      return (
        reportDate.toDateString() ===
        today.toDateString()
      );
    }

    if (filter === "Weekly") {

      const diff =
        (today - reportDate) /
        (1000 * 60 * 60 * 24);

      return diff <= 7;
    }

    if (filter === "Monthly") {

      return (
        reportDate.getMonth() ===
          today.getMonth() &&
        reportDate.getFullYear() ===
          today.getFullYear()
      );
    }

    return true;
  });

  return (

    <div className="dashboard">

      <div className="hero">

        <div className="logo-text">
          WHAT’S IN IT FOR ME? WHAT DO I STAND TO LOSE? THINK.
        </div>

        <h1>Felix Productivity Dashboard</h1>

        <p>
          A premium personal productivity system for tracking
          benediction, works, p.ups, performance averages,
          goals, and daily execution.
        </p>

      </div>

      <div className="cards">

        <div className="card stat-card">

          <h2>Total Reports</h2>

          <div className="stat-number">
            {reports.length}
          </div>

          <p>
            Productivity entries recorded.
          </p>

        </div>

        <div className="card stat-card">

          <h2>Latest Average</h2>

          <div className="stat-number">

            {reports.length > 0
              ? `${reports[0].percentage}%`
              : "0%"}

          </div>

          <p>
            Most recent productivity average.
          </p>

        </div>

        <div className="card stat-card">

          <h2>Total Productivity</h2>

          <div className="stat-number">

            {reports.reduce(
              (total, report) =>
                total +
                Number(report.benediction) +
                Number(report.works),
              0
            )}

          </div>

          <p>
            Combined benediction and works score.
          </p>

        </div>

        <div className="card">

          <h2>Daily Report Intake</h2>

          <div className="form-group">

            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Benediction</label>

            <input
              type="number"
              placeholder="Enter value"
              value={benediction}
              onChange={(e) =>
                setBenediction(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Works</label>

            <input
              type="number"
              placeholder="Enter value"
              value={works}
              onChange={(e) =>
                setWorks(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>P.Ups</label>

            <input
              type="number"
              placeholder="Enter value"
              value={pups}
              onChange={(e) =>
                setPups(e.target.value)
              }
            />

          </div>

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save Report
          </button>

        </div>

        <div className="card">

          <h2>Today To-Do</h2>

          <div className="form-group">

            <label>Task</label>

            <input
              type="text"
              placeholder="Enter task"
              value={task}
              onChange={(e) =>
                setTask(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Category</label>

            <select
              value={taskType}
              onChange={(e) =>
                setTaskType(e.target.value)
              }
            >
              <option>Work</option>
              <option>Non-Work</option>
            </select>

          </div>

          <button
            className="save-btn"
            onClick={addTask}
          >
            Add Task
          </button>

          <div className="task-list">

            {tasks.map((taskItem, index) => (

              <div
                className="task-item"
                key={index}
              >

                <span>{taskItem.text}</span>

                <span className="task-type">
                  {taskItem.type}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="chart-section">

        <h2>Performance Analytics</h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart data={filteredReports}>

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#4d7cff"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="reports-section">

        <div className="report-header">

          <h2>Saved Reports</h2>

          <div className="filter-buttons">

            <button onClick={() => setFilter("All")}>
              All
            </button>

            <button onClick={() => setFilter("Daily")}>
              Daily
            </button>

            <button onClick={() => setFilter("Weekly")}>
              Weekly
            </button>

            <button onClick={() => setFilter("Monthly")}>
              Monthly
            </button>

          </div>

        </div>

        <table>

          <thead>

            <tr>
              <th>Date</th>
              <th>Benediction</th>
              <th>Works</th>
              <th>P.Ups</th>
              <th>Average %</th>
            </tr>

          </thead>

          <tbody>

            {filteredReports.map((report, index) => (

              <tr key={index}>

                <td>{report.date}</td>
                <td>{report.benediction}</td>
                <td>{report.works}</td>
                <td>{report.pups}</td>
                <td>{report.percentage}%</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default App;