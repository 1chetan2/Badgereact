import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("OrgUser");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [organizations, setOrganizations] = useState([]);

  const loadOrganizations = async () => {
  try {
    const res = await api.get("/organizations");
    setOrganizations(res.data);
  } catch (err) {
    console.log(err);
  }
};

  const getUserRoleFromToken = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) return "";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return (
        payload.role ||
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        ""
      );
    } catch {
      return "";
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setCurrentUserRole(getUserRoleFromToken());
    loadUsers();
    loadOrganizations();  
  }, []);

  const saveUser = async () => {
    if (currentUserRole !== "OrgAdmin") return;

    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, { email, role });
        setEditingId(null);
      } else {
        await api.post("/users", {
          email,
          password: "123456",
          role,
        });
      }

      setEmail("");
      setRole("OrgUser");
      loadUsers();
    } catch {
      setError("Something went wrong");
    }
  };

  const editUser = (user) => {
    if (currentUserRole !== "OrgAdmin") return;
    setEditingId(user.id);
    setEmail(user.email);
    setRole(user.role);
  };

  const deleteUser = async (id) => {
    if (currentUserRole !== "OrgAdmin") return;
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  //for logout
  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/*  Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#1f2937",
          color: "white",
          padding: "30px 20px",
        }}
      >
        <h2 className="text-primary">BadgeCraft</h2>
        <p style={{ marginTop: "30px", fontSize: "14px" }}>
          User : {currentUserRole}
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          Dashboard
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/badges")}>
          Badge Templates
        </p>
       <p
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/csv-upload")}
>
  CSV Upload
</p>

        <p>Settings</p>
        <button
          onClick={logout}
          style={{
            marginTop: "20px",
            background: "#dc2626",
            color: "white",
            border: "none",                                                                                       
            padding: "8px 15px",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Logout
        </button>
      </div>

      {/*  Main Content */}
      <div style={{ flex: 1, padding: "50px 60px" }}>
        <h2>User Management</h2>

        {currentUserRole === "OrgAdmin" && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              gap: "15px",
              alignItems: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
             {organizations.map((org) => (
          <div key={org.id}>
            <h3>{org.name}</h3>
            <button onClick={() => navigate(`/badge-editor/${org.id}`)}>
              Create Badge
            </button>
          </div>
        ))}
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "10px", flex: 1 }}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: "10px" }}
            >
              <option>OrgUser</option>
              <option>OrgAdmin</option>
            </select>

            <button
              onClick={saveUser}
              style={{
                width: "100px",
                background: editingId ? "#f59e0b" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <table width="100%" className="table table-striped">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                {currentUserRole === "OrgAdmin" && <th></th>}
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>

                  {currentUserRole === "OrgAdmin" && (
                    <td>
                      <td>
                        <button
                          onClick={() => editUser(u)}
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
                      </td>

                      <td>
                        <button
                          onClick={() => deleteUser(u.id)}
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
                      </td>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
