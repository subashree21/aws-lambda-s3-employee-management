import React from "react";

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Employee Management System - CI/CD Test</h2>

      <div>
        <strong>DevOps Three-Tier Project</strong>
      </div>
    </nav>
  );
}

export default Navbar;
