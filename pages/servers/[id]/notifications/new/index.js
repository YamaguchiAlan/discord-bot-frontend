import React, {useState, useRef, useContext, useEffect} from 'react'
import { UserContext } from '../../../../../state/context'
import WithAuthenticate from "../../../../../components/HOC-withAuthenticate"
import Image from "next/image"
import Head from "next/head"
import { QueryClient, useQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import api, {getNewNotification, checkServer} from '../../../../../endpoints/endpoints'
import Select from 'react-select'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import Loader from '../../../../../components/Loader'
import VariablesModal from '../../../../../components/VariablesModal'

export const getServerSideProps = async (context) => {
    const {id} = context.query
    Modal.setAppElement("#app");

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(['new-notification', id], () => getNewNotification(id))

    return {
        props: {
            guild_id: id,
            dehydratedState: dehydrate(queryClient)
        }
    }
}

const AddNotification = ({guild_id, router}) => {
    const {state} = useContext(UserContext)
    const [role, setRole] = useState({value: "@everyone", label: "@everyone"})
    const [server, setServer] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [channel, setChannel] = useState(null)
    const usernameRef = useRef(null)
    const messageRef = useRef(null)

    useEffect(async () => {
        if(guild_id && state.user.user_id){
            const res = await checkServer(state.user._id, guild_id, router)
            setServer(res)
        }
    }, [guild_id, state.user])

    const {data, isLoading, isError} = useQuery(['new-notification', guild_id], () => getNewNotification(guild_id))

    const roleOptions = data?.roles.filter(r => r.name !== "@everyone").map(r => ({
        value: `<@&${r.id}>`, label: r.name
    }))

    const channelOptions = data?.channels.map(c => ({
        value: {id: c.id, name: c.name}, label: `#${c.name}`
    }))

    const submit = async (e) => {
        e.preventDefault()

        const addButton = document.getElementById("add-button")
        addButton.disabled = true

        const newNotification = {
            userId: state.user.user_id,
            username: usernameRef.current.value,
            channel: channel.value.id,
            channelName: channel.value.name,
            message: messageRef.current.value
        }

        try {
            await api.post(`/servers/${guild_id}/notifications`, newNotification)
            router.push(`/servers/${guild_id}/notifications`)
        } catch (err) {
            if(err.status === 404){
                toast.error("Incorrect Username")
                usernameRef.current.classList.add("error")
            } else{
                toast.error("Something Went Wrong!")
            }
        }
        addButton.disabled = false
    }

    const insertMention = () => {
        const textarea = messageRef.current

        if (textarea.selectionStart || textarea.selectionStart === 0) {
            var startPos = textarea.selectionStart;
            var endPos = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, startPos)
                + role.value
                + textarea.value.substring(endPos, textarea.value.length);
        } else {
            textarea.value += role.value;
        }
    }

    if(isLoading || !server) return <Loader/>;

    return(
        <>
        <Head>
            <title>Add Notification</title>
        </Head>
        <div className="grid-container">
            <div className="main">
                <div className="server-header">
                    <div className="discord-icon">
                    {server.icon ?
                        <Image
                            src={`https://cdn.discordapp.com/icons/${server.server_id}/${server.icon}.webp?size=100`}
                            height="50"
                            width="50"
                        />
                    :
                        <span>{server.server_name.slice(0, 1)}</span>
                    }
                    </div>
                    <span className="server-name">{server.server_name}</span>
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
                                onChange={(e) => e.target.classList.remove("error")}
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
                                            {label: "@everyone", value: "@everyone"},
                                            {label: "@here", value: "@here"},
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