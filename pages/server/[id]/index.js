import { useEffect, useContext, useState } from "react"
import api from '../../../endpoints/endpoints'
import {UserContext} from '../../../state/context'
import WithAuthenticate from "../../../components/HOC-withAuthenticate"
import Image from 'next/image'
import EditIcon from '../../../public/Edit.svg'
import DeleteIcon from '../../../public/Delete.svg'
import Head from "next/head"
import Link from "next/link"

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
    const [server, setServer] = useState(null)

    useEffect(() => {
        if(props.guild_id){
            api.get(`/users/${state.user._id}/guilds/${props.guild_id}/check`)
            .then(response => {
                setServer(response.data)
            })
            .catch(err => {
                if(err.status === 401 && err.data?.code === 50001){
                    router.push(`https://discord.com/oauth2/authorize?client_id=880599706428928100&permissions=103518825984&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=bot`)
                }
            });
        }
      }, [props.guild_id])

    return (
        <>
            <Head>
                <title>Bot_test</title>
            </Head>
            <div className="grid-container">
                <div className="main">
                <div className="server-header">
                    <Image
                        src="data:image/jpeg;base64,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"
                        height="50"
                        width="50"
                    />
                    <span className="server-name">Bot_test</span>
                    <Link href={`/server/${props.guild_id}/new-notification`}>
                        <button>Add Notification</button>
                    </Link>
                </div>
                <div className="server-notifications body-default-card">
                    <div className="header">
                        <h3>Notifications</h3>
                        <h4>{server ? server.subscriptions.length : "0"}/20</h4>
                    </div>

                    <div className="searchbar">
                        <form className="search" id="search-bar">
                            <button className="icon" type='submit'><i className="fas fa-search"></i></button>
                            <input placeholder="Search" spellCheck="false" type="search"/>
                        </form>
                    </div>

                    <div className="body">
                        <div className="notifications-card">
                            <div className="card-header">
                                <div className="left">
                                    <Image
                                        src="data:image/jpeg;base64,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"
                                        height="50"
                                        width="50"
                                    />

                                    <h5>Yamaguch1_</h5>
                                </div>

                                <div className="right">
                                    <div className="card-button">
                                        <Image
                                            src={EditIcon}
                                            height="50"
                                            width="50"
                                        />
                                    </div>
                                    <div className="card-button">
                                        <Image
                                            src={DeleteIcon}
                                            height="50"
                                            width="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <p>Posted to <span className="channel">#General</span></p>
                            </div>

                            <div className="card-footer">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elits eld...</p>
                            </div>
                        </div>
                        <div className="notifications-card">
                            <div className="card-header">
                                <div className="left">
                                    <Image
                                        src="data:image/jpeg;base64,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"
                                        height="32"
                                        width="32"
                                    />

                                    <h5>Yamaguch1_</h5>
                                </div>

                                <div className="right">
                                    <div className="card-button">
                                        <Image
                                            src={EditIcon}
                                            height="50"
                                            width="50"
                                        />
                                    </div>
                                    <div className="card-button">
                                        <Image
                                            src={DeleteIcon}
                                            height="32"
                                            width="32"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="card-body">
                                <p>Posted to <span className="channel">#General</span></p>
                            </div>

                            <div className="card-footer">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                            </div>
                        </div>
                        <div className="notifications-card">
                            <div className="card-header">
                                <div className="left">
                                    <Image
                                        src="data:image/jpeg;base64,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"
                                        height="32"
                                        width="32"
                                    />

                                    <h5>Yamaguch1_</h5>
                                </div>

                                <div className="right">
                                    <div className="card-button">
                                        <Image
                                            src={EditIcon}
                                            height="50"
                                            width="50"
                                        />
                                    </div>
                                    <div className="card-button">
                                        <Image
                                            src={DeleteIcon}
                                            height="32"
                                            width="32"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="card-body">
                                <p>Posted to <span className="channel">#General</span></p>
                            </div>

                            <div className="card-footer">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                            </div>
                        </div>
                        <div className="notifications-card">
                            <div className="card-header">
                                <div className="left">
                                    <Image
                                        src="data:image/jpeg;base64,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"
                                        height="32"
                                        width="32"
                                    />

                                    <h5>Yamaguch1_</h5>
                                </div>

                                <div className="right">
                                    <div className="card-button">
                                        <Image
                                            src={EditIcon}
                                            height="50"
                                            width="50"
                                        />
                                    </div>
                                    <div className="card-button">
                                        <Image
                                            src={DeleteIcon}
                                            height="32"
                                            width="32"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="card-body">
                                <p>Posted to <span className="channel">#General</span></p>
                            </div>

                            <div className="card-footer">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default WithAuthenticate(MyServer)