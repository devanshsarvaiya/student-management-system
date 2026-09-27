import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        setError("");

        const savedStudents = localStorage.getItem("students");

        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        } else {
          const data = await getStudents();
          setStudents(data);
          localStorage.setItem(
            "students",
            JSON.stringify(data)
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem(
        "students",
        JSON.stringify(students)
      );
    }
  }, [students]);

  async function addStudent(student) {
    const created = await createStudent(student);
    setStudents((prev) => [created, ...prev]);
    return created;
  }

  async function updateStudentById(id, data) {
    try {
      await updateStudent(id, data);
    } catch (error) {
      // Ignore API error and update locally
    }

    const updated = { ...data, id };

    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              ...updated,
              address: { city: data.address.city },
              company: { name: data.company.name },
            }
          : student
      )
    );

    return updated;
  }

  async function deleteStudentById(id) {
    try {
      await deleteStudent(id);
    } catch (error) {
      // Ignore API error
    }

    setStudents((prev) =>
      prev.filter((student) => student.id !== id)
    );
  }

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        addStudent,
        updateStudentById,
        deleteStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  return useContext(StudentContext);
}