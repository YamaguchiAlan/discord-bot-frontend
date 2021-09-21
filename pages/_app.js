import { useState, useReducer} from 'react'
import {useRouter} from 'next/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { ReactQueryDevtools } from 'react-query/devtools'
import { userReducer, initialUserState} from '../state/reducer'
import { UserContext } from '../state/context'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [queryClient] = useState(() => new QueryClient())
  const [state, dispatch] = useReducer(userReducer, initialUserState)

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <UserContext.Provider value={{state, dispatch}}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </Hydrate>
      <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default MyApp
