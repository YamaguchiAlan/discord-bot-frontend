import { useState, useRef, useContext, useEffect, FC, FormEvent } from 'react'
import { UserContext } from '../../../../../state/context'
import WithAuthenticate from '../../../../../components/HOC-withAuthenticate'
import Image from 'next/image'
import Head from 'next/head'
import { QueryClient, useQuery } from 'react-query'
import { dehydrate, DehydratedState } from 'react-query/hydration'
import api, { getGuildData, checkServer } from '../../../../../endpoints/endpoints'
import Select from 'react-select'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import Toggle from 'react-toggle'
import Loader from '../../../../../components/Loader'
import VariablesModal from '../../../../../components/VariablesModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { NextRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { ServerData, SelectRoleOption, SelectChannelOption } from '../../../../../types'
import ColorPicker from '../../../../../components/ColorPicker'
import Link from 'next/link'

interface Props {
    guild_id: string,
    router?: NextRouter,
    dehydratedState: DehydratedState
}

interface Query{
    id?: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { id }: Query = context.query
  Modal.setAppElement('#app')

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['new-notification', id], () => getGuildData(id, true))

  return {
    props: {
      guild_id: id,
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const AddNotification: FC<Props> = ({ guild_id, router }) => {
  const { state } = useContext(UserContext)
  const [role, setRole] = useState<SelectRoleOption>({ value: '@everyone', label: '@everyone' })
  const [server, setServer] = useState<ServerData>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [channel, setChannel] = useState<SelectChannelOption>(null)
  const [embedMessage, setEmbedMessage] = useState<boolean>(true)
  const [previewImage, setPreviewImage] = useState<boolean>(true)
  const [embedColor, setEmbedColor] = useState<string>('#0ec9a6')
  const usernameRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function effect () {
      if (guild_id && state.user.user_id) {
        const res = await checkServer(state.user._id, guild_id, router)
        setServer(res)
      }
    }
    effect()
  }, [guild_id, state.user])

  const { data, isLoading, isError } = useQuery(['new-notification', guild_id], () => getGuildData(guild_id))

  const roleOptions: SelectRoleOption[] = data?.roles.filter(r => r.name !== '@everyone').map(r => ({
    value: `<@&${r.id}>`, label: r.name
  }))

  const channelOptions: SelectChannelOption[] = data?.channels.map(c => ({
    value: { id: c.id, name: c.name }, label: `#${c.name}`
  }))

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const addButton = (document.getElementById('add-button') as HTMLButtonElement)
    addButton.disabled = true

    const newNotification = {
      userId: state.user.user_id,
      username: usernameRef.current.value,
      channel: channel.value.id,
      channelName: channel.value.name,
      message: messageRef.current.value,
      embedMessage,
      embed: embedMessage
        ? {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            color: embedColor,
            previewImage
          }
        : null
    }

    try {
      await api.post(`/servers/${guild_id}/notifications`, newNotification)
      router.push(`/servers/${guild_id}/notifications`)
    } catch (err) {
      if (err.status === 404) {
        toast.error('Incorrect Username')
        usernameRef.current.classList.add('error')
      } else {
        toast.error('Something Went Wrong!')
      }
    }
    addButton.disabled = false
  }

  const insertMention = () => {
    const textarea = messageRef.current

    if (textarea.selectionStart || textarea.selectionStart === 0) {
      const startPos = textarea.selectionStart
      const endPos = textarea.selectionEnd
      textarea.value = textarea.value.substring(0, startPos) +
                role.value +
                textarea.value.substring(endPos, textarea.value.length)
    } else {
      textarea.value += role.value
    }
  }

  if (isLoading || !server) return <Loader/>

  if (isError) {
    toast.error('Something Went Wrong!')
  }

  return (
        <>
        <Head>
            <title>{server.server_name} - Add Notification | YamaBot</title>
        </Head>
        <div className="grid-container">
            <div className="main">
                <div className="server-header">
                    <div className="discord-icon">
                    {server.icon
                      ? <Image
                            src={`https://cdn.discordapp.com/icons/${server.server_id}/${server.icon}.webp?size=100`}
                            height="50"
                            width="50"
                            alt="icon"
                        />
                      : <span>{server.server_name.slice(0, 1)}</span>
                    }
                    </div>
                    <span className="server-name">
                      <Link href={`/servers/${guild_id}/notifications`}>
                        {server.server_name}
                      </Link>
                      <FontAwesomeIcon icon={faAngleRight} size="xs" style={{ color: '#0ec9a6' }}/>
                       <span>Add Notification</span>
                    </span>
                </div>
                <div className="body-default-card">
                    <div className="header">
                        <h3>Add Notification</h3>
                    </div>
                    <div className="body">
                        <form className="notification-form" onSubmit={submit}>
                            <label className="notification-label">Streamer Username</label>
                            <span className="input-helper">Enter the exact Twitch username of the streamer</span>
                            <input
                                autoComplete="off"
                                name="username"
                                id="username"
                                type="text"
                                placeholder="Username"
                                ref={usernameRef}
                                required
                                onChange={(e) => e.target.classList.remove('error')}
                            />

                            <label className="notification-label">Channel</label>
                            <span className="input-helper">Select the channel YamaBot will send the message to</span>
                            <Select
                                value={channel}
                                onChange={(option) => setChannel(option)}
                                options={channelOptions}
                                name="channel"
                                className="select-container"
                                classNamePrefix="select"
                                id="channel"
                            />

                            <label className="notification-label">Message</label>
                            <span className="input-helper">
                                You can use Discord markdown and variables. Click <span className='link' onClick={() => setIsOpen(true)}>here</span> to see the formatting table.
                            </span>
                            <div className="notification-message">
                                <label>Mention a Role</label>
                                <div className="role-input">
                                    <Select
                                        value={role}
                                        onChange={(option) => setRole(option)}
                                        options={[
                                          { label: '@everyone', value: '@everyone' },
                                          { label: '@here', value: '@here' },
                                          ...roleOptions
                                        ]}
                                        name="role"
                                        className="select-container"
                                        classNamePrefix="select"
                                        id="role"
                                    />
                                    <button className="mention-button" type="button" onClick={insertMention}>Insert Mention</button>
                                </div>
                                <textarea name="message" id="message" placeholder="Message" ref={messageRef} required></textarea>
                            </div>

                            <div className='toggle-container'>
                              <strong>Embed Message</strong>
                              <Toggle
                                icons={false}
                                checked={embedMessage}
                                onChange={(e) => setEmbedMessage(e.target.checked)}
                              />
                            </div>

                            <div className={`embeb-config ${!embedMessage && '--hide'}`}>
                              <span className="input-helper">You can use Discord markdown and variables. Click <span className='link' onClick={() => setIsOpen(true)}>here</span> to see the formatting table.</span>
                              <label className="notification-label">Embed Title</label>
                              <input
                                  autoComplete="off"
                                  name="title"
                                  id="title"
                                  type="text"
                                  placeholder="Embed Title"
                                  ref={titleRef}
                                  defaultValue="{title}"
                                  required
                                  disabled={!embedMessage}
                              />

                              <label className="notification-label">Embed Description</label>
                              <input
                                  autoComplete="off"
                                  name="description"
                                  id="description"
                                  type="text"
                                  placeholder="Embed Description"
                                  ref={descriptionRef}
                                  defaultValue="Playing {game}"
                                  required
                                  disabled={!embedMessage}
                              />

                              <div className="color-picker-container">
                                <strong>Embed Color</strong>
                                <ColorPicker value={embedColor} setValue={setEmbedColor}/>
                              </div>

                              <div className='toggle-container'>
                                <strong>Preview Image</strong>
                                <Toggle
                                  icons={false}
                                  checked={previewImage}
                                  onChange={(e) => setPreviewImage(e.target.checked)}
                                />
                              </div>
                            </div>

                            <div className="notification-buttons">
                                <button id="add-button" type="submit" className="add-button" disabled={!channel}>Add Notification</button>
                                <button className="cancel-button" type="button" onClick={() => router.push(`/servers/${guild_id}/notifications`)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                >
                    <VariablesModal setIsOpen={setIsOpen}/>
                </Modal>
            </div>
        </div>
        </>
  )
}

export default WithAuthenticate(AddNotification)
