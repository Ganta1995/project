import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ mobileNo: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch {
      alert("Invalid login");
    }
  };

  const registerForm = () => {
    localStorage.removeItem("token");
    navigate("/");
  };




  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Mobile No" onChange={(e) => setForm({ ...form, mobileNo: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={login}>Login</button>
      <button onClick={registerForm}>SinUP</button>
    </div>
  );
}

export default Login;
