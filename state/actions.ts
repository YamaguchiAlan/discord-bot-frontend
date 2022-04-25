import {UserState} from './reducer'

export enum ActionType {
    SetUSer,
    RemoveUser
}

export interface ISetUser extends UserState {
    type: ActionType.SetUSer
}

export interface IRemoveUser {
    type: ActionType.RemoveUser
}

export type UserActions = ISetUser | IRemoveUser