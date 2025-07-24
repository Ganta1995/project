import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "./redux/userSlice";

function Register() {
  const [form, setForm] = useState({ name: "", age: "", address: "", mobileNo: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const register = async () => {
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
  
    try {
      const resultAction = await dispatch(registerUser(form));
      if (registerUser.fulfilled.match(resultAction)) {
        alert("Registered successfully!");
        setForm({ name: "", age: "", address: "", mobileNo: "", password: "" });
      } else if (registerUser.rejected.match(resultAction)) {
        alert(resultAction.payload);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const LoginForm = () => {
    navigate("/login");
  };
  

  return (
    <div className="form-container">
      <div >
        <div>
          <h2>Register</h2>
        </div>
        <div className="form">
          <div>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <input placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <div>
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <input placeholder="Mobile No" value={form.mobileNo} onChange={(e) => setForm({ ...form, mobileNo: e.target.value })} />
          </div>
          <div>
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:"10px"}}>
            <button onClick={register} disabled={loading}>Register</button>
            <button onClick={LoginForm}>login</button>
          </div>
          {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Register;
