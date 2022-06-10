export interface DiscordGuild {
    id: string,
    name: string,
    icon: string,
    owner: boolean,
    owner_id: string
}

export interface DiscordChannel {
    id: string,
    name: string,
    type: number
}

export interface DiscordRole {
    id: string,
    name: string
}

export interface GuildData {
    roles: DiscordRole[],
    channels: Omit<DiscordChannel, 'type'>[]
}

export interface Server {
    server_id: string,
    notifications?: string[],
    _id: string
}

export interface ServerData extends Server {
    server_name: string,
    icon: string
}

export interface Notification {
    userId: string,
    guildId: string,
    twitchUsername: string,
    twitchUserId: string,
    channel: string,
    channelName: string,
    message: string,
    embedMessage: boolean,
    embed?: {
        title: string,
        titleAsUrl: boolean,
        description: string,
        color: string,
        previewImage: boolean
    },
    _id?: string
}

export interface NotificationsData extends Notification{
    profile_image_url: string
}

export interface SelectRoleOption {
    value: string,
    label: string
}

export interface SelectChannelOption {
    value: {
        id: string,
        name: string
    },
    label: string
}
