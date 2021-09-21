import { useEffect, useContext } from "react"
import api from '../../endpoints/endpoints'
import {UserContext} from '../../state/context'
import WithAuthenticate from "../../components/HOC-withAuthenticate"

export const getServerSideProps = async (context) => {
    const {id} = context.query

    return {
        props: {
            guild_id: id
        }
    }
}

const MyServer = (props) => {
    const {state} = useContext(UserContext)
    const router = props.router

    useEffect(() => {
        api.get(`/users/${state.user._id}/guilds/${props.guild_id}/check`)
        .then(response => {
            console.log("res", response)
        })
        .catch(err => {
            if(err.status === 401 && err.data?.code === 50001){
                router.push(`https://discord.com/api/oauth2/authorize?client_id=880599706428928100&permissions=103518825984&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=bot%20identify%20guilds.join%20guilds`)
            }
        });
      }, [])

    return (
        <div>{JSON.stringify(props)}</div>
    )
}

export default WithAuthenticate(MyServer)