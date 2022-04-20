import axios from 'axios'
import { NextRouter } from 'next/router';
import { DiscordGuild, GuildData, NotificationsData, ServerData, Notification } from '../types';
const secret = process.env.NEXT_PUBLIC_HEADER_SECRET

const api = axios.create({
    baseURL: "http://localhost:4000/api",
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

export const getServers = (): Promise<DiscordGuild[]> => (
  api.get("/servers", { withCredentials: true }).then(res => res.data)
)

export const getGuildData = (guildId: string): Promise<GuildData> => (
  api.get(`/servers/${guildId}/notifications/@new`).then(res => res.data)
)

export const checkServer = (userId: string, guild_id: string, router: NextRouter): Promise<ServerData> => (
  api.get(`/users/${userId}/guilds/${guild_id}/check`)
  .then(response => response.data)
  .catch(err => {
      if(err.status === 401 && err.data?.code === 50001){
          router.push(`https://discord.com/oauth2/authorize?client_id=880599706428928100&permissions=271764480&redirect_uri=https%3A%2F%2Fapp.yamabot.tk&response_type=code&scope=bot`)
      } else {
          router.push(`/`)
      }
  })
)

export const getNotifications = (guildId: string): Promise<NotificationsData[]> => (
  api.get(`/servers/${guildId}/notifications`).then(res => res.data)
)

export const getNotification = (guildId: string, notificationId: string): Promise<Notification> => (
  api.get(`/servers/${guildId}/notifications/${notificationId}`).then(res => res.data)
)

export default api