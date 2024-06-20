import Head from 'next/head'
import { useEffect, useState, FC } from 'react'
import { useQuery } from 'react-query'
import { getServers } from '../endpoints/endpoints'
import withAuthenticate from '../components/HOC-withAuthenticate'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import ServerCard from '../components/ServerCard'
import { DiscordGuild } from '../types'

const inviteUrl = process.env.NEXT_PUBLIC_INVITE_URL


const Home: FC = () => {
  const { data, isLoading, isError } = useQuery(['servers'], () => getServers())

  const [myServers, setMyServers] = useState<DiscordGuild[]>([])
  const [filteredServers, setFilteredServers] = useState<DiscordGuild[]>([])
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    if (data) {
      setMyServers(data)
    }
  }, [data])

  useEffect(() => {
    const filterServers = myServers.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()))
    setFilteredServers(filterServers)
  }, [filter])

  if (isLoading) {
    return <Loader/>
  }

  if (isError) {
    toast.error('An error has occurred')
  }

  return (
    <>
      <Head>
        <title>YamaBot</title>
      </Head>
      <div className="grid-container">
        <div className="main">
        <div className="main-header">
          <p>Select a server to manage the notifications. <br/>
            Or invite YamaBot to your server <a
            href={inviteUrl}
              >here.
            </a>
          </p>
        </div>
        <div className="body-default-card">
          <div className="header">
              <h4>My servers</h4>
              <h5>{myServers[0] ? myServers.length : '0'}</h5>
          </div>

          <div className="searchbar">
              <SearchBar placeholder="Search" onChange={setFilter}/>
          </div>

          <div className="main-body">
          {
            myServers[0]
              ? filter
                ? filteredServers[0]
                  ? <ServerCard data={filteredServers}/>
                  : <div className="empty-servers">
                      No results found
                  </div>
                : <ServerCard data={myServers}/>
              : <div className="empty-servers">
                    Looks like you don&apos;t have a Discord server yet. <br />
                    Create one so you can add the bot!
                </div>
          }
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default withAuthenticate(Home)
