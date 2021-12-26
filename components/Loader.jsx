import React from 'react'

function Loader({page}) {
    return (
        <div className="loader-container" style={{height: page ? "100%" : "80%"}}>
            <div className='loader'></div>
        </div>
    )
}

export default Loader
