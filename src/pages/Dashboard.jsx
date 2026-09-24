import { useStudents } from "../context/StudentContext";

function Dashboard() {
  const {
    students,
    loading,
    error,
  } = useStudents();

  const totalStudents = students.length;

  const totalCourses = new Set(
    students.map(
      (student) => student.company?.name
    )
  ).size;

  const totalCities = new Set(
    students.map(
      (student) => student.address?.city
    )
  ).size;

  const totalUsernames = new Set(
    students.map(
      (student) => student.username
    )
  ).size;

  if (loading) {
    return (
      <div className="status-message">
        <h2>Loading dashboard... ⏳</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-message error-message">
        <h2>Something went wrong ❌</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard 📊</h1>

        <p>
          Welcome to Student Management System.
        </p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{totalStudents}</p>
        </div>

        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{totalCourses}</p>
        </div>

        <div className="stat-card">
          <h3>Total Cities</h3>
          <p>{totalCities}</p>
        </div>

        <div className="stat-card">
          <h3>Total Usernames</h3>
          <p>{totalUsernames}</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;