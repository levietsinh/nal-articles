import axios from "axios";
// import { useRouter } from "vue-router";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// const router = useRouter();

export const authHeader = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

export default axios.create({
  baseURL: apiUrl,
});
