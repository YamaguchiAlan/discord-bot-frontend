import axios from 'axios'
import { NextRouter } from 'next/router'
import { Dispatch } from 'react'
import { UserActions } from '../state/actions'
import { removeUser } from '../state/reducer'
import { DiscordGuild, GuildData, NotificationsData, ServerData, Notification } from '../types'
const secret = process.env.NEXT_PUBLIC_HEADER_SECRET
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL
const inviteUrl = process.env.NEXT_PUBLIC_INVITE_URL

const api = axios.create({
  baseURL: serverUrl,
  headers: {
    common: {
      'Origin-Auth-Secret': secret
    }
  }
})

api.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error.response)
})

const backendConfig = { headers: { origin: frontendUrl } }

export const getServers = (): Promise<DiscordGuild[]> => (
  api.get('/servers', { withCredentials: true }).then(res => res.data)
)

export const getGuildData = (guildId: string, backend?: boolean): Promise<GuildData> => (
  api.get(`/servers/${guildId}/notifications/@new`, backend && backendConfig).then(res => res.data)
)

export const checkServer = (userId: string, guild_id: string, router: NextRouter): Promise<ServerData> => (
  api.get(`/users/${userId}/guilds/${guild_id}/check`)
    .then(response => response.data)
    .catch(err => {
      if (err.status === 401 && err.data?.code === 50001) {
        router.push(inviteUrl)
      } else {
        router.push('/')
      }
    })
)

export const getNotifications = (guildId: string, backend?: boolean): Promise<NotificationsData[]> => (
  api.get(`/servers/${guildId}/notifications`, backend && backendConfig).then(res => res.data)
)

export const getNotification = (guildId: string, notificationId: string, backend?: boolean): Promise<Notification> => (
  api.get(`/servers/${guildId}/notifications/${notificationId}`, backend && backendConfig).then(res => res.data)
)

export const userLogout = async (dispatch: Dispatch<UserActions>, router: NextRouter) => {
  await api.get('/logout', { withCredentials: true })
  dispatch(removeUser())
  router.reload()
}

export default api
