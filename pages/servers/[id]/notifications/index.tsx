import { useEffect, useContext, useState, FC } from 'react'
import { GetServerSideProps } from 'next'
import api, { checkServer, getNotifications } from '../../../../endpoints/endpoints'
import { UserContext } from '../../../../state/context'
import { QueryClient, useQuery } from 'react-query'
import { dehydrate, DehydratedState } from 'react-query/hydration'
import WithAuthenticate from '../../../../components/HOC-withAuthenticate'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import Loader from '../../../../components/Loader'
import Modal from 'react-modal'
import SearchBar from '../../../../components/SearchBar'
import NotificationCard from '../../../../components/NotificationCard'
import { NextRouter } from 'next/router'
import { NotificationsData, ServerData } from '../../../../types'

interface Props {
    guild_id: string,
    dehydratedState: DehydratedState,
    router?: NextRouter
}

interface Query{
    id?: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { id }: Query = context.query
  Modal.setAppElement('#app')

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['notifications', id], () => getNotifications(id, true))

  return {
    props: {
      guild_id: id,
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const MyServer: FC<Props> = (props) => {
  const { state } = useContext(UserContext)
  const [server, setServer] = useState<ServerData>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedNotification, setSelectedNotification] = useState<string>(null)
  const [filter, setFilter] = useState<string>('')
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationsData[]>([])
  const { data, isLoading, isError, refetch } = useQuery(['notifications', props.guild_id], () => getNotifications(props.guild_id))

  const router = props.router

  useEffect(() => {
    async function effect () {
      if (props.guild_id && state.user.user_id) {
        const res = await checkServer(state.user?._id, props.guild_id, router)
        setServer(res)
      }
    }
    effect()
  }, [props.guild_id, state.user])

  useEffect(() => {
    if (data) {
      const filterNotifications = data.filter(n => n.twitchUsername.toLowerCase().includes(filter.toLowerCase()))
      setFilteredNotifications(filterNotifications)
    }
  }, [filter])

  const onRemoveClick = (notificationId: string): void => {
    setSelectedNotification(notificationId)
    setIsOpen(true)
  }

  const removeNotification = async () => {
    try {
      await api.delete(`/servers/${props.guild_id}/notifications/${selectedNotification}`)
      setSelectedNotification(null)
      setIsOpen(false)
      await refetch()
      toast.success('Notification Removed')
    } catch (error) {
      toast.error('Something Went Wrong!')
    }
  }

  if (isLoading || !server) return <Loader/>

  if (isError) {
    toast.error('Something Went Wrong!')
  }

  return (
        <>
            <Head>
                <title>{server.server_name} | YamaBot</title>
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

                    <span className="server-name">{server.server_name}</span>
                    <Link href={`/servers/${props.guild_id}/notifications/new`}>
                        <button>Add Notification</button>
                    </Link>
                </div>
                <div className="server-notifications body-default-card">
                    <div className="header">
                        <h4>Notifications</h4>
                        <h5>{data ? data?.length : '0'}/20</h5>
                    </div>

                    <div className="searchbar">
                        <SearchBar placeholder="Search by Twitch Username" onChange={setFilter}/>
                    </div>

                    <div className="body">
                    { data
                      ? filter
                        ? filteredNotifications[0]
                          ? <NotificationCard data={filteredNotifications} guild_id={props.guild_id} onRemoveClick={onRemoveClick}/>
                          : <div className="empty-notifications">
                                    No results found
                                </div>
                        : <NotificationCard data={data} guild_id={props.guild_id} onRemoveClick={onRemoveClick}/>
                      : <div className="empty-notifications">
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
