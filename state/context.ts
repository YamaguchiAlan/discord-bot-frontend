import { createContext, Dispatch } from "react"
import { UserActions } from "./actions"
import { UserState, initialUserState } from "./reducer"

export interface UserContextType {
    state: UserState;
    dispatch: Dispatch<UserActions>
}

export const UserContext = createContext<UserContextType>({
    state: initialUserState,
    dispatch: () => undefined
})