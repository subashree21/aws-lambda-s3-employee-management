import React, { useEffect, useState } from "react";

function EmployeeForm({
  selectedEmployee,
  setSelectedEmployee,
  refreshTable,
}) {
  const API_URL = "https://58fw6eg0d1.execute-api.us-east-1.amazonaws.com/employees";

  const [employeeId, setEmployeeId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [salary, setSalary] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  useEffect(() => {
    if (selectedEmployee) {
      setEmployeeId(selectedEmployee.employee_id);
      setFullName(selectedEmployee.full_name);
      setEmail(selectedEmployee.email);
      setPhone(selectedEmployee.phone);
      setDepartment(selectedEmployee.department);
      setDesignation(selectedEmployee.designation);
      setSalary(selectedEmployee.salary);
      setJoiningDate(
        selectedEmployee.joining_date
          ? selectedEmployee.joining_date.split("T")[0]
          : ""
      );
    }
  }, [selectedEmployee]);

  const clearForm = () => {
    setEmployeeId("");
    setFullName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setDesignation("");
    setSalary("");
    setJoiningDate("");
    setSelectedEmployee(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const employee = {
      employee_id: employeeId,
      full_name: fullName,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date: joiningDate,
    };

    const url = selectedEmployee
      ? `${API_URL}/${selectedEmployee.id}`
      : API_URL;

    const method = selectedEmployee ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    })
      .then((res) => res.json())
      .then(() => {
        clearForm();
        refreshTable();
      })
      .catch(console.error);
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        margin: "30px",
      }}
    >
      <h2>
        {selectedEmployee ? "Update Employee" : "Add Employee"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="date"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
          style={inputStyle}
          required
        />

        <button style={buttonStyle}>
          {selectedEmployee ? "Update Employee" : "Add Employee"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "15px",
};

const buttonStyle = {
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default EmployeeForm;
