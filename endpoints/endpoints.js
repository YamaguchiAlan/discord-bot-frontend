import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:4000/api"
})

api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error.response);
});

export const getServers = () => (
  api.get("/servers", { withCredentials: true }).then(res => res.data)
)

export default api