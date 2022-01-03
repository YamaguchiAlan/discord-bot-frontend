import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import EditIcon from '../public/Edit.svg'
import DeleteIcon from '../public/Delete.svg'

function NotificationCard({data, guild_id, onRemoveClick}) {
    return (
        data.map(notification => (
            <div className="notifications-card"  key={notification._id}>
                <div className="card-header">
                    <div className="left">
                        <Image
                            src={notification.profile_image_url}
                            height="50"
                            width="50"
                            alt="profile"
                        />

                        <h5>{notification.twitchUsername}</h5>
                    </div>

                    <div className="right">
                        <Link className="card-button" href={`/servers/${guild_id}/notifications/${notification._id}`}>
                            <Image
                                src={EditIcon}
                                height="50"
                                width="50"
                                alt="edit"
                            />
                        </Link>
                        <div className="card-button">
                            <Image
                                src={DeleteIcon}
                                height="50"
                                width="50"
                                onClick={() => onRemoveClick(notification._id)}
                                alt="delete"
                            />
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <p>Posted to <span className="channel">#{notification.channelName}</span></p>
                </div>

                <div className="card-footer">
                    <p>{notification.message}</p>
                </div>
            </div>
        ))
    )
}

export default NotificationCard
