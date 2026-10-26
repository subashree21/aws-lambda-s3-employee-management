import React, { useEffect, useState } from "react";

function EmployeeTable({ refresh, setSelectedEmployee }) {
  const API_URL = "https://58fw6eg0d1.execute-api.us-east-1.amazonaws.com/employees";

  const [employees, setEmployees] = useState([]);

  const loadEmployees = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadEmployees();
  }, [refresh]);

  const deleteEmployee = (id) => {
    if (!window.confirm("Delete this employee?")) return;

    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        loadEmployees();
      });
  };

  return (
    <div
      style={{
        width: "90%",
        margin: "30px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Employee List</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#1976d2", color: "white" }}>
            <th style={thStyle}>Employee ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Designation</th>
            <th style={thStyle}>Salary</th>
            <th style={thStyle}>Joining Date</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td style={tdStyle}>{emp.employee_id}</td>
              <td style={tdStyle}>{emp.full_name}</td>
              <td style={tdStyle}>{emp.email}</td>
              <td style={tdStyle}>{emp.phone}</td>
              <td style={tdStyle}>{emp.department}</td>
              <td style={tdStyle}>{emp.designation}</td>
              <td style={tdStyle}>₹{emp.salary}</td>
              <td style={tdStyle}>
                {new Date(emp.joining_date).toLocaleDateString()}
              </td>

              <td style={tdStyle}>
                <button
                  style={editButton}
                  onClick={() => setSelectedEmployee(emp)}
                >
                  Edit
                </button>

                {" "}

                <button
                  style={deleteButton}
                  onClick={() => deleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const editButton = {
  background: "#f9a825",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "8px",
};

const deleteButton = {
  background: "#d32f2f",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default EmployeeTable;
