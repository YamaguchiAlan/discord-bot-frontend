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

  useEffect(() => {
    if(data){
      setMyServers(data)
    }
  }, [data])

  if(isLoading){
    return <Loader/>
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
            href="https://discord.com/oauth2/authorize?client_id=880599706428928100&permissions=103518825984&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=bot"
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
              <SearchBar/>
          </div>

          <div className="main-body">
          {
            myServers[0] ?
              myServers.map(server =>
                <Link href={`/servers/${server.id}/notifications`} key={server.id}>
                  <div className="server-container">
                    <div className="discord-icon">
                      {server.icon ?
                          <Image
                            src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp?size=100`}
                            height="70"
                            width="70"
                          />
                        :
                          <span>{server.name.slice(0, 1)}</span>
                      }
                    </div>

                    <span className="server-name">{server.name}</span>
                  </div>
                </Link>
              )
              : <div>error</div>
          }
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default withAuthenticate(Home)