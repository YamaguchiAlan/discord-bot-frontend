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
                    src={user.user_id ? `https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar}.webp?size=100` : '/default-profile-pic.jpg'}
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
                                    src={user.user_id ? `https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar}.webp?size=100` : '/default-profile-pic.jpg'}
                                    height="100"
                                    width="100"
                                    alt="pfp"
                                    className='profile-pic'
                                />
                                <div className="text">
                                    <span className='username'>{user.username ? user.username : "User"}</span>
                                </div>
                            </div>
                            <Link href="/">
                                <span className='item'>Servers</span>
                            </Link>
                            <span className='log-out item' onClick={() => userLogout(dispatch, router)}>Log out</span>
                        </div>
                }
            </div>
        </div>
  )
}

export default Header
