import { useState, useReducer, useEffect} from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import Router from 'next/router'
import { ReactQueryDevtools } from 'react-query/devtools'
import { userReducer, initialUserState} from '../state/reducer'
import { UserContext } from '../state/context'
import Header from '../components/Header'
import { Toaster } from 'react-hot-toast'

import "../CSS/index.css"
import Loader from '../components/Loader'

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(userReducer, initialUserState)

  useEffect(() => {
    const start = (url) => (url !== Router.asPath && setLoading(true));
    const complete = (url) => (url === Router.asPath && setLoading(false));

    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', complete)
    Router.events.on('routeChangeError', complete)

    return () => {
        Router.events.off('routeChangeStart', start)
        Router.events.off('routeChangeComplete', complete)
        Router.events.off('routeChangeError', complete)
    }
  })

  if(loading){
    return <Loader page/>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <UserContext.Provider value={{state, dispatch}}>
          <div id="app">
            <Header/>
            <Component {...pageProps} />
            <Toaster
                position="top-center"
                toastOptions={{
                    success: {
                      style: {
                        background: '#414141',
                        border: '1px solid #00853c',
                        color: '#eeeeee'
                      }
                    },
                    error: {
                      style: {
                        background: '#414141',
                        border: '1px solid red',
                        color: '#eeeeee'
                      }
                    }
                  }}
            />
          </div>
        </UserContext.Provider>
      </Hydrate>
      <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default MyApp
