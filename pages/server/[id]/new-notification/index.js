import WithAuthenticate from "../../../../components/HOC-withAuthenticate"

export const getServerSideProps = async (context) => {
    const {id} = context.query

    return {
        props: {
            guild_id: id
        }
    }
}

const AddNotification = (props) => {
    return(
        <div className="grid-container">
            <div className="main">
                
            </div>
        </div>
    )
}

export default WithAuthenticate(AddNotification)