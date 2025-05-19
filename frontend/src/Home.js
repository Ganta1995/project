import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  const searchWeather = async () => {
    const apiKey = "89ee58e4d970b9adbe22eb0aa610995c"; // your weatherstack API key
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
    navigate("/login");
  };

  return (
    <div>
      <h2>Weather Report</h2>
      <input
        placeholder="Enter area or pin"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchWeather}>Get Weather</button>

      {weather && (
        <div>
          <p>City: {weather.location.name}</p>
          <p>Temp: {weather.current.temperature}°C</p>
          <p>Weather: {weather.current.weather_descriptions[0]}</p>
        </div>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Home;
