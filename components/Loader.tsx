import { FC } from 'react'

interface Props {
    page?: boolean | undefined
}

const Loader: FC<Props> = ({ page }) => {
  return (
        <div className="loader-container" style={{ height: page ? '100%' : '80%' }}>
            <div className='loader'></div>
        </div>
  )
}

export default Loader
