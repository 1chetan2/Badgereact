import { useEffect, useState } from "react";
import api from "../api";

export default function BadgeTemplates() {
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // 🔹 Decode JWT
  const getUserRoleFromToken = () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) return "";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return (
        payload.role ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        ""
      );
    } catch {
      return "";
    }
  };

  // 🔹 Load Templates
  const loadTemplates = async () => {
    try {
      const res = await api.get("/BadgeTemplates");
      setTemplates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setCurrentUserRole(getUserRoleFromToken());
    loadTemplates();
  }, []);

  // 🔹 Save Template (Admin Only)
  const saveTemplate = async () => {
    if (currentUserRole !== "OrgAdmin") return;

    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/BadgeTemplates/${editingId}`, {
          title,
          description,
          imageUrl,
        });
        setEditingId(null);
      } else {
        await api.post("/BadgeTemplates", {
          title,
          description,
          imageUrl,
        });
      }

      setTitle("");
      setDescription("");
      setImageUrl("");
      loadTemplates();
    } catch {
      setError("Something went wrong");
    }
  };

  const editTemplate = (t) => {
    if (currentUserRole !== "OrgAdmin") return;

    setEditingId(t.id);
    setTitle(t.title);
    setDescription(t.description);
    setImageUrl(t.imageUrl);
  };

  const deleteTemplate = async (id) => {
    if (currentUserRole !== "OrgAdmin") return;

    await api.delete(`/BadgeTemplates/${id}`);
    loadTemplates();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Badge Templates</h2>

      {/* 🔹 Admin Form */}
      {currentUserRole === "OrgAdmin" && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap", 
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "10px", flex: "1 1 200px" }}
          />

          <input                                    
            placeholder="Image URL"                       
            value={imageUrl}                      
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ padding: "10px", flex: "1 1 250px" }}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: "10px", flex: "1 1 300px" }}
          />

          <button
            onClick={saveTemplate}
            style={{
              background: editingId ? "#f59e0b" : "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
            }}
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔹 Templates Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {templates.map((t) => (
          <div
            key={t.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={t.imageUrl || "https://via.placeholder.com/250"}
              alt={t.title}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            <h4 style={{ marginTop: "10px" }}>{t.title}</h4>
            <p style={{ fontSize: "14px" }}>{t.description}</p>

            {currentUserRole === "OrgAdmin" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => editTemplate(t)}
                  style={{
                    marginRight: "10px",
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTemplate(t.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
