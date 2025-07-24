import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Home.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMe,
  fetchUsers,
  deleteUserById,
  updateUserById,
} from "../redux/userSlice";

function Dashboard() {
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", mobileNo: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, me } = useSelector((state) => ({
    users: state.user.users,
    me: state.user.me,
  }));

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchUsers());
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const HomePage = () => {
    navigate("/home");
  };

  const handleDelete = (id) => {
    dispatch(deleteUserById(id)).then((action) => {
      if (deleteUserById.fulfilled.match(action)) {
        // Optionally, you can re-fetch users or rely on slice to update state
        dispatch(fetchUsers());
      }
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = (id) => {
    dispatch(updateUserById({ id, data: editForm })).then((action) => {
      if (updateUserById.fulfilled.match(action)) {
        setEditingUser(null);
        dispatch(fetchUsers());
      }
    });
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="topbar">
          <p>Welcome, {me ? me.name : "User"}</p>
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
            {(!users || users.length === 0) ? (
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
                        <button onClick={() => handleUpdate(user._id)}>
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
                        <button onClick={() => handleDelete(user._id)}>
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