import axios from "axios";

const instance = axios.create({
  //baseURL: "http://35.154.40.89:8000/api/",
  baseURL: "http://localhost:8000/api/",
});

export default instance;
