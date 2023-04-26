import axios from "axios";

const $axios = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export { $axios };
