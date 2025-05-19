import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({ name: "", age: "", address: "", mobileNo: "", password: "" });

  const register = async () => {
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
  
    try {
      await axios.post("http://localhost:5000/register", form);
      alert("Registered successfully!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data); // Show backend error (e.g. "Mobile number already exists")
      } else {
        alert("Something went wrong. Please try again.");
        console.error("Registration error:", err);
      }
    }
  };
  

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Age" onChange={(e) => setForm({ ...form, age: e.target.value })} />
      <input placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <input placeholder="Mobile No" onChange={(e) => setForm({ ...form, mobileNo: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;
