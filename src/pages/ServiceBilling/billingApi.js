import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // change if deployed

export const getBillByBookingId = () => {
  return axios.get(`${API_BASE}service-billing/create-bill`);
};
