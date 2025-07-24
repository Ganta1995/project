import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { loginUser } from "./redux/userSlice";

function Login() {
  const [form, setForm] = useState({ mobileNo: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const login = async () => {
    const resultAction = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/home");
    } else if (loginUser.rejected.match(resultAction)) {
      alert(resultAction.payload || "Invalid login");
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
      <button onClick={login} disabled={loading}>Login</button>
      <button onClick={registerForm}>Sign Up</button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
}

export default Login;
