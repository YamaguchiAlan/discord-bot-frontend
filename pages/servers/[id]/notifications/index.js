import { useEffect, useContext, useState } from "react"
import api, {checkServer, getNotifications} from '../../../../endpoints/endpoints'
import {UserContext} from '../../../../state/context'
import { QueryClient, useQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import WithAuthenticate from "../../../../components/HOC-withAuthenticate"
import toast from 'react-hot-toast'
import Image from 'next/image'
import EditIcon from '../../../../public/Edit.svg'
import DeleteIcon from '../../../../public/Delete.svg'
import Head from "next/head"
import Link from "next/link"
import Loader from "../../../../components/Loader"
import Modal from 'react-modal'



export const getServerSideProps = async (context) => {
    const {id} = context.query
    Modal.setAppElement("#app");

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(["notifications", id], () => getNotifications(id))

    return {
        props: {
            guild_id: id,
            dehydratedState: dehydrate(queryClient)
        }
    }
}

const MyServer = (props) => {
    const {state} = useContext(UserContext)
    const [server, setServer] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedNotification, setSelectedNotification] = useState(null)
    const {data, isLoading, isError, refetch} = useQuery(["notifications", props.guild_id], () => getNotifications(props.guild_id))

    const router = props.router

    useEffect(async () => {
        if(props.guild_id && state.user.user_id){
            const res = await checkServer(state.user._id, props.guild_id, router)
            setServer(res)
        }
      }, [props.guild_id, state.user])

    const onRemoveClick = (notificationId) => {
        setSelectedNotification(notificationId)
        setIsOpen(true)
    }

    const removeNotification = async () => {
        try {
            await api.delete(`/servers/${props.guild_id}/notifications/${selectedNotification}`)
            setSelectedNotification(null)
            setIsOpen(false)
            await refetch()
            toast.success("Notification Removed")
        } catch (error) {
            toast.error("Something Went Wrong!")
        }
    }

    if(isLoading || !server) return <Loader/>;

    return (
        <>
            <Head>
                <title>Bot_test</title>
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
                    <Link href={`/servers/${props.guild_id}/notifications/new`}>
                        <button>Add Notification</button>
                    </Link>
                </div>
                <div className="server-notifications body-default-card">
                    <div className="header">
                        <h3>Notifications</h3>
                        <h4>{data ? data?.length : "0"}/20</h4>
                    </div>

                    <div className="searchbar">
                        <form className="search" id="search-bar">
                            <button className="icon" type='submit'><i className="fas fa-search"></i></button>
                            <input placeholder="Search" spellCheck="false" type="search"/>
                        </form>
                    </div>

                    <div className="body">
                        { data ? data.map(notification => (
                            <div className="notifications-card"  key={notification._id}>
                                <div className="card-header">
                                    <div className="left">
                                        <Image
                                            src={notification.profile_image_url}
                                            height="50"
                                            width="50"
                                        />

                                        <h5>{notification.twitchUsername}</h5>
                                    </div>

                                    <div className="right">
                                        <Link className="card-button" href={`/servers/${props.guild_id}/notifications/${notification._id}`}>
                                            <Image
                                                src={EditIcon}
                                                height="50"
                                                width="50"
                                            />
                                        </Link>
                                        <div className="card-button">
                                            <Image
                                                src={DeleteIcon}
                                                height="50"
                                                width="50"
                                                onClick={() => onRemoveClick(notification._id)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <p>Posted to <span className="channel">#{notification.channelName}</span></p>
                                </div>

                                <div className="card-footer">
                                    <p>{notification.message}</p>
                                </div>
                            </div>
                        ))
                        :
                            <div className="empty-notifications">
                                No notifications yet.<br/>
                                Create a new notification in your server now!
                            </div>
                        }
                    </div>
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                    >
                        <div className="remove-modal">
                            <p className="header">Confirmation</p>
                            <span>Are you sure you want to remove this notification?</span>
                            <div className="modal-buttons-container">
                                <button className="cancel" onClick={() => setIsOpen(false)}>Cancel</button>
                                <button className="confirm" onClick={removeNotification}>Yes</button>
                            </div>
                        </div>
                    </Modal>
                </div>
                </div>
            </div>
        </>
    )
}

export default WithAuthenticate(MyServer)