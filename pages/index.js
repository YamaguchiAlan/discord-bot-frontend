import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { QueryClient, useQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import {getServers} from '../endpoints/endpoints'
import withAuthenticate from '../components/HOC-withAuthenticate'
import SearchBar from '../components/SearchBar'
import Image from 'next/image'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import ServerCard from '../components/ServerCard'

export const getServerSideProps = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['servers'], () => getServers())

  return{
      props: {
          dehydratedState: dehydrate(queryClient)
      }
  }
}

function Home(props) {
  const {data, isLoading, isError} = useQuery(['servers'], () => getServers())

  const [myServers, setMyServers] = useState([])
  const [filteredServers, setFilteredServers] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    if(data){
      setMyServers(data)
    }
  }, [data])

  useEffect(() => {
    const filterServers = myServers.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()))
    setFilteredServers(filterServers)
  }, [filter])

  if(isLoading){
    return <Loader/>
  }

  if(isError){
    toast.error("An error has occurred")
  }

  return (
    <>
      <Head>
        <title>YamaBot</title>
      </Head>
      <div className="grid-container">
        <div className="main">
        <div className="main-header">
          <p>Select a server to add or manage the bot.</p>
          <p>Or invite YamaBot to your server <a
            href="https://discord.com/oauth2/authorize?client_id=880599706428928100&permissions=103518825984&redirect_uri=https%3A%2F%2Fyamabot.tk&response_type=code&scope=bot"
              >here.
            </a>
          </p>
        </div>
        <div className="body-default-card">
          <div className="header">
              <h3>My servers</h3>
              <h4>{myServers[0] ? myServers.length : "0"}</h4>
          </div>

          <div className="searchbar">
              <SearchBar placeholder="Search" onChange={setFilter}/>
          </div>

          <div className="main-body">
          {
            myServers[0] ?
              filter ?
                filteredServers[0] ?
                  <ServerCard data={filteredServers}/>
                :
                  <div className="empty-servers">
                      No results found
                  </div>
              :
                <ServerCard data={myServers}/>
              :
                <div className="empty-servers">
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