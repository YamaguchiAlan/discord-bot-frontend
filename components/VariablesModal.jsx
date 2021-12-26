import React from 'react'
import closeIcon from '../public/Close.svg'
import Image from 'next/image'

function VariablesModal({setIsOpen}) {
    return (
        <div className="modal-table">
            <div className="close">
                <Image
                    src={closeIcon}
                    height="30"
                    width="30"
                    onClick={() => setIsOpen(false)}
                    alt="close"
                />
            </div>
            <div className="discord-markdown">
                <p className="header">Discord Markdown</p>
                <p className="description">
                    Add a few characters before & after your desired text to change your text. <br />
                    Here are some examples, click <a className='link' href='https://support.discord.com/hc/en-us/articles/210298617' target="_blank" rel="noreferrer">here</a> to see more details
                </p>
                <div className="table">
                    <div className="column">
                        <div><span>*italics* or _italics_</span></div>
                        <div><span>**bold**</span></div>
                        <div><span>***bold italics***</span></div>
                        <div><span>__underline__</span></div>
                        <div><span>__*underline italics*__</span></div>
                        <div><span>__**underline bold**__</span></div>
                        <div><span>__***underline bold italics***__</span></div>
                        <div><span>~~Strikethrough~~</span></div>
                    </div>
                    <div className="column">
                        <div><i>Italics</i></div>
                        <div><b>Bold</b></div>
                        <div><i><b>Bold Italics</b></i></div>
                        <div><span className='underline'>Underline</span></div>
                        <div><i className='underline'>Underline Italics</i></div>
                        <div><b className='underline'>Underline Bold</b></div>
                        <div><i className='underline'><b>Underline Bold Italics</b></i></div>
                        <div><strike>Strikethrough</strike></div>
                    </div>
                </div>
            </div>
            <div className="variables">
                <p className="header">Variables</p>
                <p className="description">You can click on the variables and copy them to clipboard!</p>
                <div className="table">
                    <div className="column variable-column">
                        <div className="table-header"><span>Variable</span></div>
                        <div><span>{'{game}'}</span></div>
                        <div><span>{'{name}'}</span></div>
                        <div><span>{'{title}'}</span></div>
                        <div><span>{'{viewers}'}</span></div>
                        <div><span>{'{url}'}</span></div>
                    </div>
                    <div className="column variable-column">
                        <div className="table-header"><span>Description</span></div>
                        <div><span>The name of the game that is being played</span></div>
                        <div><span>The streamer&apos;s Twitch username</span></div>
                        <div><span>The stream&apos;s title</span></div>
                        <div><span>The amount of viewers of the stream</span></div>
                        <div><span>The Twitch URL of the streamer</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VariablesModal
