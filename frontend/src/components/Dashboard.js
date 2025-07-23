import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Home.css";

function Dashboard() {
  const [name, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", mobileNo: "" });

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const getUserData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/me", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();
    setUsername(data.name);
  };

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      getUserData();
    }
    fetchUsers();
  }, []);

  const HomePage = () => {
    navigate("/home");
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/users", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error:", errorText);
      return;
    }

    const userList = await res.json();
    setUsers(userList);
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete Error:", errorText);
      return;
    }

    alert("User deleted successfully!");
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const updateUser = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(editForm),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Update Error:", errorText);
      return;
    }

    const updated = await res.json();
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === id ? updated : user))
    );
    setEditingUser(null);
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="topbar">
          <p>Welcome, {name}</p>
          <button onClick={logout}>Sign Out</button>
        </header>

        <div style={{ display: "flex" }}>
          <aside className="sidebar">
            <h2>Weather status</h2>
            <nav>
              <ul>
                <li onClick={HomePage}>Dashboard</li>
                <li onClick={logout}>Sign Out</li>
              </ul>
            </nav>
          </aside>

          <section className="content">
            <h3>User List</h3>
            {users.length === 0 ? (
              <p>No users available.</p>
            ) : (
              users.map((user) =>
                user && user._id && user.name ? (
                  <div
                    key={user._id}
                    style={{
                      marginBottom: "10px",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    {editingUser === user._id ? (
                      <>
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          placeholder="Name"
                        />
                        <input
                          name="mobileNo"
                          value={editForm.mobileNo}
                          onChange={handleEditChange}
                          placeholder="Mobile"
                        />
                        <button onClick={() => updateUser(user._id)}>
                          Save
                        </button>
                        <button onClick={() => setEditingUser(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                          <strong>Mobile:</strong> {user.mobileNo}
                        </p>
                        <button
                          onClick={() => {
                            setEditingUser(user._id);
                            setEditForm({
                              name: user.name,
                              mobileNo: user.mobileNo,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteUser(user._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                ) : null
              )
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
