import { UserActions, ActionType, ISetUser, IRemoveUser } from './actions'

export interface UserState {
    user: {
        user_id: string | undefined,
        username: string | undefined,
        avatar: string | undefined,
        discriminator: string | undefined,
        _id?: string | undefined
    }
}

export const initialUserState: UserState = {
  user: {
    user_id: undefined,
    username: undefined,
    avatar: undefined,
    discriminator: undefined
  }
}

export function userReducer (state: UserState, action:UserActions) {
  switch (action.type) {
    case ActionType.SetUSer:
      return {
        user: action.user
      }

    case ActionType.RemoveUser:
      return initialUserState

    default:
      return state
  }
}

export const setUser = (user): ISetUser => ({
  type: ActionType.SetUSer,
  user
})

export const removeUser = (): IRemoveUser => ({
  type: ActionType.RemoveUser
})
