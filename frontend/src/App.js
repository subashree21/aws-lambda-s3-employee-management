import React, { useState } from "react";
import Navbar from "./components/Navbar";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const refreshTable = () => {
    setRefresh(!refresh);
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <EmployeeForm
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        refreshTable={refreshTable}
      />

      <EmployeeTable
        refresh={refresh}
        setSelectedEmployee={setSelectedEmployee}
      />
    </div>
  );
}

export default App;
