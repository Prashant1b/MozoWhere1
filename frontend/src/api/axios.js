import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://mozowhere-backend.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});