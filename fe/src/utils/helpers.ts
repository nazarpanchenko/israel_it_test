import axios, { AxiosInstance, AxiosResponse } from "axios";

const $axios: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

$axios.interceptors.response.use(
  function (response: AxiosResponse<any, any>) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export { $axios };
