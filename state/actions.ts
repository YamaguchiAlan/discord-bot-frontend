export enum ActionType {
    SetUSer
}

export interface ISetUser {
    type: ActionType.SetUSer,
    user: {
        user_id: string,
        username: string
    }
}

export type UserActions = ISetUser