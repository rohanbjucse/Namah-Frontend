import { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";

/* -----------------------------
   Page that shows rope details
-------------------------------- */
function getStatusIcon(status) {
  if (status === "ACTIVE") return "✅";
  if (status === "INSPECTION_DUE") return "⚠️";
  if (status === "RETIRED") return "❌";
  return "ℹ️";
}

function RopePage() {
  const { ropeId } = useParams();
  const [rope, setRope] = useState(null);

  useEffect(() => {
    fetch(`https://namah-1.onrender.com/rope/${ropeId}/overview`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Rope data received:", data);
        setRope(data);
      })
      .catch((error) => {
        console.error("Error fetching rope data:", error);
      });
  }, [ropeId]);

  if (!rope) {
    return <div style={{ padding: "20px" }}>Loading rope data...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Rope Identity</h1>

      <p><strong>Rope ID:</strong> {ropeId}</p>
      <p><strong>Model:</strong> {rope.model}</p>
      <p><strong>Diameter:</strong> {rope.diameter} mm</p>
      <p><strong>Status:</strong> {rope.status}</p>
      <div style={{ marginTop: "20px" }}>
  <h3>Last Inspection</h3>

  {rope.lastInspection ? (
    <div>
      <p>
        <strong>Result:</strong> {rope.lastInspection.result}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(rope.lastInspection.date).toLocaleDateString()}
      </p>
      {rope.lastInspection.remarks && (
        <p>
          <strong>Remarks:</strong> {rope.lastInspection.remarks}
        </p>
      )}
    </div>
  ) : (
    <p>No inspection recorded.</p>
  )}
</div>

    <div
      style={{
      marginTop: "30px",
      padding: "25px",
      borderRadius: "8px",
      border: "2px solid #333",
      backgroundColor:
      rope.status === "ACTIVE"
          ? "#c8f7c5"
          : rope.status === "INSPECTION_DUE"
          ? "#ffe5b4"
          : "#f7c5c5"
      }}
    > 
      <h2 style={{ marginTop: 0 }}>
  {getStatusIcon(rope.status)} Status: {rope.status}
</h2>


    {rope.status === "ACTIVE" && (
      <p>This rope is cleared for normal use.</p>
    )}

    {rope.status === "INSPECTION_DUE" && (
       <p>
        ⚠️ This rope requires inspection before continued use.
      </p>
    )}

    {rope.status === "RETIRED" && (
       <p style={{ fontWeight: "bold" }}>
          ❌ DO NOT USE THIS ROPE.  
          This rope has been permanently retired.
      </p>
    )}
  </div>

    </div>
  );
}

/* -----------------------------
   App with routes
-------------------------------- */
function App() {
  return (
    <Routes>
      <Route path="/:ropeId" element={<RopePage />} />
      <Route
        path="*"
        element={
          <div
           style={{
                padding: "20px",
                maxWidth: "500px",
                margin: "0 auto"
          }}
>

            No rope ID provided in URL
          </div>
        }
      />
    </Routes>
  );
}

export default App;
