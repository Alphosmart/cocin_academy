import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api"),
  withCredentials: true
});

export default http;
