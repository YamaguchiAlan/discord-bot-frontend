import { createContext, Dispatch } from "react"
import { UserActions } from "./actions"
import { UserState, initialUserState } from "./reducer"

export const UserContext = createContext<{
    state: UserState;
    dispatch: Dispatch<UserActions>
}>({
    state: initialUserState,
    dispatch: () => undefined
})