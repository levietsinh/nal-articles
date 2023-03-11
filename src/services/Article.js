import axios, { authHeader } from "./ApiConfig";

export const getArticles = (params) =>
  axios.get("blogs", {
    headers: authHeader(),
    params,
  });

export const getArticleDetails = (id) =>
  axios.get(`blogs/${id}`, {
    headers: authHeader(),
  });
