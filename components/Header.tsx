import { Dispatch, useState, FC } from 'react'
import { userLogout } from '../endpoints/endpoints'
import LogoIcon from '../public/Logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { UserState } from '../state/reducer'
import { UserActions } from '../state/actions'
import { useRouter } from 'next/router'

interface Props extends UserState{
    dispatch: Dispatch<UserActions>
}

const Header: FC<Props> = ({ user, dispatch }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const router = useRouter()

  return (
        <div id="header">
            <Link href="/">
                <div className="logo">
                    <Image
                        src={LogoIcon}
                        height="100"
                        width="100"
                        alt="logo"
                    />
                    <span className="logo-name">YamaBot</span>
                </div>
            </Link>
            <div className="menu">
                <Image
                    onClick={() => setMenuOpen(!menuOpen)}
                    src={`https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar}.webp?size=100`}
                    height="100"
                    width="100"
                    alt="pfp"
                    className='menu-img'
                />
                {
                    menuOpen &&
                        <div className="dropdown">

                            <div className='user'>
                                <Image
                                    src={`https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar}.webp?size=100`}
                                    height="50"
                                    width="50"
                                    alt="pfp"
                                    className='profile-pic'
                                />
                                <div className="text">
                                    <span className='username'>{user.username}</span>
                                    <span className="discriminator">#{user.discriminator}</span>
                                </div>
                            </div>
                            <span className='log-out item' onClick={() => userLogout(dispatch, router)}>Log out</span>
                        </div>
                }
            </div>
        </div>
  )
}

export default Header
