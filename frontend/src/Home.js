import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [name, setUsername] = useState("");
  const navigate = useNavigate();

  const searchWeather = async () => {
    const apiKey = "f927eaf568126722c6e9bd816e0c6c9d";
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${query}`;

    try {
      const res = await axios.get(url);
      if (res.data.success === false) {
        alert("API Error: " + res.data.error.info);
        return;
      }
      setWeather(res.data);
    } catch (err) {
      console.error("API Error:", err);
      alert("Weather not found or API key issue!");
    }
  };

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
    getUserData();
  }, []);

  const HomePage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/dashboard");
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="topbar">
          <p>Welcome, {name}</p>
          <button onClick={logout}>Sign Out</button>
        </header>
        <div style={{display:"flex"}}>
          <aside className="sidebar">
            <h2>Weather status</h2>
            <nav>
              <ul>
                <li onClick={HomePage}>Dashboard</li>
                <li onClick={HomePage}>Subscription Plan</li>
                <li onClick={HomePage}>Account</li>
                <li onClick={logout}>Sign Out</li>
              </ul>
            </nav>
          </aside>

          <section className="content">
            <h3>Weather Report</h3>
            <input
              placeholder="Enter area or pin"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={searchWeather}>Get Weather</button>

            {weather && (
              <div className="weather-box">
                <p>
                  <strong>City:</strong> {weather.location.name}
                </p>
                <p>
                  <strong>Temp:</strong> {weather.current.temperature}°C
                </p>
                <p>
                  <strong>Weather:</strong>{" "}
                  {weather.current.weather_descriptions[0]}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
