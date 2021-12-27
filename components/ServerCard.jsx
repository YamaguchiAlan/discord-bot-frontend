import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function ServerCard({data}) {
    return (
        data.map(server =>
            <Link href={`/servers/${server.id}/notifications`} key={server.id}>
              <div className="server-container">
                <div className="discord-icon">
                  {server.icon ?
                      <Image
                        src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp?size=100`}
                        height="70"
                        width="70"
                        alt='icon'
                      />
                    :
                      <span>{server.name.slice(0, 1)}</span>
                  }
                </div>

                <span className="server-name">{server.name}</span>
              </div>
            </Link>
          )
    )
}

export default ServerCard
