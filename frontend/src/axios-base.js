import axios from "axios";

const instance = axios.create({
  //baseURL: "http://13.234.18.152:80/api/",
  baseURL: "http://localhost:8000/api/",
});

export default instance;
