import LogoIcon from '../public/Logo.svg'
import MenuIcon from '../public/Menu.svg'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
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
                    src={MenuIcon}
                    height="100"
                    width="100"
                    alt="menu"
                />
            </div>
        </div>
    )
}

export default Header