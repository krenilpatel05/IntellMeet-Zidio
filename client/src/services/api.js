import axios from "axios";

export default axios.create({
  // Agar environment variable mile toh wo, nahi toh direct Render ka live link
  baseURL: import.meta.env.VITE_API_URL || "https://intellmeet-backend-iucw.onrender.com/api",
});