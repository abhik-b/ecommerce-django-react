// THIS WILL BE reqd. EVERYTIME WE DO SOMETHIN THAT REQUIRES AUTHENTICATION

import axios from "axios";
import { endpoint } from "./constants";
export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});
