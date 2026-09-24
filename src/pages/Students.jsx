import { useEffect, useState } from "react";

import StudentCard from "../components/StudentCard";

import {
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";

import { useStudents } from "../context/StudentContext";

function Students() {
  const {
  students,
  loading,
  error,
  addStudent,
  updateStudentById,
  deleteStudentById,
} = useStudents();

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [editingStudent, setEditingStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [courseFilter, setCourseFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 6;

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    city: "",
    course: "",
  });

  // GET Students
  
  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, courseFilter]);

  // Form input change
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Edit student
  function handleEdit(student) {
    setEditingStudent(student);

    setFormData({
      name: student.name,
      username: student.username,
      city: student.address?.city || "",
      course: student.company?.name || "",
    });

    setShowForm(true);
    setSuccessMessage("");
    setFormError("");
  }

  // Delete student
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);
      setFormError("");
      setSuccessMessage("");

      await deleteStudentById(id);

      setSuccessMessage(
        "Student deleted successfully! ✅"
      );
    } catch (error) {
      setFormError(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  function validateForm() {
  if (
    !formData.name ||
    !formData.username ||
    !formData.city ||
    !formData.course
  ) {
    setFormError("All fields are required.");
    return false;
  }

  if (formData.username.length < 4) {
    setFormError(
      "Username must be at least 4 characters."
    );
    return false;
  }

  if (formData.city.length < 3) {
    setFormError(
      "City name must be at least 3 characters."
    );
    return false;
  }

  const duplicate = students.find(
    (student) =>
      student.username.toLowerCase() ===
        formData.username.toLowerCase() &&
      student.id !== editingStudent?.id
  );

  if (duplicate) {
    setFormError("Username already exists.");
    return false;
  }

  return true;
}

  // Add / Update student
  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");

if (!validateForm()) {
  return;
}

    // UPDATE
    if (editingStudent) {
      try {
        setUpdating(true);
        setFormError("");
        setSuccessMessage("");

        const updatedStudent = {
          name: formData.name,
          username: formData.username,
          address: {
            city: formData.city,
          },
          company: {
            name: formData.course,
          },
        };

        await updateStudentById(
  editingStudent.id,
  updatedStudent
);

        setFormData({
          name: "",
          username: "",
          city: "",
          course: "",
        });

        setEditingStudent(null);
        setShowForm(false);

        setSuccessMessage(
          "Student updated successfully! ✅"
        );
      } catch (error) {
        setFormError(error.message);
      } finally {
        setUpdating(false);
      }

      return;
    }

    // CREATE
    try {
      setSubmitting(true);
      setFormError("");
      setSuccessMessage("");

      const newStudent = {
        name: formData.name,
        username: formData.username,
        address: {
          city: formData.city,
        },
        company: {
          name: formData.course,
        },
      };

      await addStudent(newStudent);

      setFormData({
        name: "",
        username: "",
        city: "",
        course: "",
      });

      setSuccessMessage(
        "Student added successfully! ✅"
      );

      setShowForm(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Search + Filter
  const filteredStudents = students.filter((student) => {
    const searchText = searchTerm.toLowerCase();

    const studentName =
      student.name?.toLowerCase() || "";

    const username =
      student.username?.toLowerCase() || "";

    const city =
      student.address?.city?.toLowerCase() || "";

    const course =
      student.company?.name || "";

    const matchesSearch =
      studentName.includes(searchText) ||
      username.includes(searchText) ||
      city.includes(searchText);

    const matchesCourse =
      courseFilter === "All" ||
      course === courseFilter;

    return matchesSearch && matchesCourse;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const startIndex =
    (currentPage - 1) * studentsPerPage;

  const currentStudents =
    filteredStudents.slice(
      startIndex,
      startIndex + studentsPerPage
    );

  if (loading) {
    return (
      <div className="status-message">
        <h2>Loading students... ⏳</h2>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="status-message error-message">
        <h2>Something went wrong ❌</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="students-page">

      <div className="students-header">

        <div>
          <h1>Students 👨‍🎓</h1>
          <p>
            Manage all students from API.
          </p>
        </div>

        <button
          className="add-student-btn"
          onClick={() => {
            setShowForm(!showForm);
            setEditingStudent(null);
            setFormData({
              name: "",
              username: "",
              city: "",
              course: "",
            });
          }}
        >
          + Add Student
        </button>

      </div>

      {successMessage && (
        <p className="success-message">
          {successMessage}
        </p>
      )}

      {(error || formError) && (
        <p className="error-message">
        {formError || error}
       </p>
      )}

      {/* Search and Filter */}
      <div className="student-filters">

        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <select
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(event.target.value)
          }
        >
          <option value="All">
            All Courses
          </option>

          <option value="Romaguera-Crona">
            Romaguera-Crona
          </option>

          <option value="Deckow-Crist">
            Deckow-Crist
          </option>

          <option value="Romaguera-Jacobson">
            Romaguera-Jacobson
          </option>

          <option value="Keebler LLC">
            Keebler LLC
          </option>

          <option value="Robel-Corkery">
            Robel-Corkery
          </option>
        </select>

      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form
          className="student-form"
          onSubmit={handleSubmit}
        >

          <h2>
            {editingStudent
              ? "Edit Student"
              : "Add New Student"}
          </h2>

          {formError && (
  <p className="form-error">
    {formError}
  </p>
)}

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
  type="text"
  name="username"
  value={formData.username}
  onChange={handleChange}
  minLength={4}
  required
/>

          <input
  type="text"
  name="city"
  value={formData.city}
  onChange={handleChange}
  minLength={3}
  required
/>
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={submitting || updating}
          >
            {editingStudent
              ? updating
                ? "Updating Student..."
                : "Update Student"
              : submitting
                ? "Adding Student..."
                : "Add Student"}
          </button>

        </form>
      )}

      {/* Result Count */}
      <p>
        Showing {currentStudents.length} of{" "}
        {filteredStudents.length} matching students
      </p>

      {/* Student Cards */}
      <div className="student-list">

        {currentStudents.length > 0 ? (
          currentStudents.map((student) => (
            <StudentCard
              key={student.id}
              name={student.name}
              username={student.username}
              course={
                student.company?.name || "N/A"
              }
              city={
                student.address?.city || "N/A"
              }
              age="N/A"
              onEdit={() =>
                handleEdit(student)
              }
              onDelete={() =>
                handleDelete(student.id)
              }
              deleting={
                deletingId === student.id
              }
            />
          ))
        ) : (
          <p>
            No students found. 🔍
          </p>
        )}

      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">

          <button
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="page-numbers">

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={
                  currentPage === page
                    ? "active-page"
                    : ""
                }
              >
                {page}
              </button>
            ))}

          </div>

          <button
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
            disabled={
              currentPage === totalPages
            }
          >
            Next →
          </button>

        </div>
      )}

    </div>
  );
}

export default Students;