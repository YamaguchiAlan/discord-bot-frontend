import axios from 'axios'
const secret = process.env.NEXT_PUBLIC_HEADER_SECRET

const api = axios.create({
    baseURL: "https://server.yamabot.tk/api",
    headers: {
      common: {
        'Origin-Auth-Secret': secret
      }
    }
})

api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error.response);
});

export const getServers = () => (
  api.get("/servers", { withCredentials: true }).then(res => res.data)
)

export const getNewNotification = (guildId) => (
  api.get(`/servers/${guildId}/notifications/@new`).then(res => res.data)
)

export const checkServer = (userId, guild_id, router) => (
  api.get(`/users/${userId}/guilds/${guild_id}/check`)
  .then(response => response.data)
  .catch(err => {
      if(err.status === 401 && err.data?.code === 50001){
          router.push(`https://discord.com/oauth2/authorize?client_id=880599706428928100&permissions=103518825984&redirect_uri=https%3A%2F%2Fyamabot.tk&response_type=code&scope=bot`)
      } else {
          router.push(`/`)
      }
  })
)

export const getNotifications = (guildId) => (
  api.get(`/servers/${guildId}/notifications`).then(res => res.data)
)

export const getNotification = (guildId, notificationId) => (
  api.get(`/servers/${guildId}/notifications/${notificationId}`).then(res => res.data)
)

export default api