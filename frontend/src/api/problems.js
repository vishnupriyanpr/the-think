import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export function getProblems(params) {
  return api.get("/problems", { params }).then((res) => res.data);
}

export function getProblemById(id) {
  return api.get(`/problems/${id}`).then((res) => res.data);
}

export function getStats() {
  return api.get("/problems/stats").then((res) => res.data);
}

export function getDomains() {
  return api.get("/problems/domains/list").then((res) => res.data);
}
