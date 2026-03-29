import initApi from "./initApi";

const apiService = initApi(import.meta.env.VITE_API_URL);

export default apiService;
