import {UserActions, ActionType, ISetUser} from './actions'

export interface UserState {
    user: {
        user_id: string | undefined
        username: string | undefined
    }
}

export const initialUserState: UserState = {
    user: {
        user_id: undefined,
        username: undefined
    }
}

export function userReducer(state: UserState, action:UserActions ) {
    switch (action.type) {
        case ActionType.SetUSer:
            return {
                user: action.user
            }

        default:
            return state;
    }
}

export const setUser = (user): ISetUser => ({
    type: ActionType.SetUSer,
    user: user
})