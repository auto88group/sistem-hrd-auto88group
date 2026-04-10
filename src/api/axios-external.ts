// src/api/axios-external.ts
import axios, { type AxiosInstance } from "axios";

const externalApi: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default externalApi;
