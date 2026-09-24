function StudentCard({
  name,
  username,
  course,
  city,
  age,
  onEdit,
  onDelete,
  deleting,
}) {
  return (
    <div className="student-card">
      <h2>{name}</h2>

      <p>
        <strong>Username:</strong> {username}
      </p>

      <p>
        <strong>Course:</strong> {course}
      </p>

      <p>
        <strong>City:</strong> {city}
      </p>

      <p>
        <strong>Age:</strong> {age}
      </p>

      <div className="student-actions">
        <button onClick={onEdit}>
                Edit ✏️
        </button>
        <button
            onClick={onDelete}
            disabled={deleting}
        >
         {deleting ? "Deleting..." : "Delete 🗑️"}
        </button>
      </div>
    </div>
  );
}

export default StudentCard;