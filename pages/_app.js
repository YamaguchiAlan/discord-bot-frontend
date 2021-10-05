import { useState, useReducer} from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { ReactQueryDevtools } from 'react-query/devtools'
import { userReducer, initialUserState} from '../state/reducer'
import { UserContext } from '../state/context'
import Header from '../components/Header'

import "../CSS/index.css"

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())
  const [state, dispatch] = useReducer(userReducer, initialUserState)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <UserContext.Provider value={{state, dispatch}}>
          <Header/>
          <Component {...pageProps} />
        </UserContext.Provider>
      </Hydrate>
      <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default MyApp
