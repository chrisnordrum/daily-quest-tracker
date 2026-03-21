import React, { useEffect, useState } from "react";

function Admin() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token") || "",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        console.log("status:", res.status);
        console.log("data:", data);

        if (!res.ok) {
          throw new Error(data.message || "Access denied");
        }

        setMessage(data.message);
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setError(err.message);
      });
  }, []);

  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>Admin Page</h1>
      <p>{message}</p>
      <p>Only admin users can access this page.</p>
    </div>
  );
}

export default Admin;