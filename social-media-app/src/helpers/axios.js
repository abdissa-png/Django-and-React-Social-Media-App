import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getUser,getAccessToken,getRefreshToken } from "../hooks/user.actions";
const axiosService = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
axiosService.interceptors.request.use(async (config) => {
  /**
   * Retrieving the access and refresh tokens from the local storage
   */
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});
axiosService.interceptors.response.use(
  (res) => Promise.resolve(res),
  (err) => Promise.reject(err)
);
const refreshAuthLogic = async (failedRequest) => {
    const refresh=getRefreshToken()
    return axios.post("/auth/refresh/", 
       {
        refresh:refresh,
       }, {
         baseURL: "http://localhost:8000/api",
       })
       .then((resp) => {
         const { access } = resp.data;
         const user=getUser()
         failedRequest.response.config.headers["Authorization"] = "Bearer " + access;
         localStorage.setItem("auth", JSON.stringify({access, refresh, user }));
       }).catch(() => {
        localStorage.removeItem("auth");
   });
};

createAuthRefreshInterceptor(axiosService,refreshAuthLogic);
export function fetcher(url) {
    return axiosService.get(url).then((res) => res.data);
}
export default axiosService