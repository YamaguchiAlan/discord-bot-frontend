import React from 'react'
import api from '../endpoints/endpoints'
import { UserContext } from '../state/context'
import { setUser } from '../state/reducer'
import { withRouter } from 'next/router'

const WithAuthenticate = (WrappedComponent) => {
    class withAuthenticateComponent extends React.Component{
        render(){
            return <WrappedComponent {...this.props}/>
        }

        componentDidMount(){
            const {dispatch, state} = this.context

            if(!state.user.user_id){
                api.get(`/authenticate?path=${this.props.guild_id ? `/servers/${this.props.guild_id}/notifications` : '/'}`, { withCredentials: true })
                .then(res => {
                    dispatch(setUser(res.data))
                })
                .catch(err => {
                    if(err.status === 307 && err.data?.redirect){
                        this.props.router.push(err.data.redirect)
                    }
                })
            }
        }
    }
    withAuthenticateComponent.contextType = UserContext;

    return withRouter(withAuthenticateComponent)
}

export default WithAuthenticate