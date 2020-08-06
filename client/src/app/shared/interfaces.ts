export interface IFriend{
    name: string,
    _id: string
}

export interface IGroup{
    name:string,
    admin: string,
    _id: string,
    members: IMember[]
}

export interface IMember{
    name: string,
    _id: string
}

export interface IUser{
    name: string,
    _id: string,
    email: string,
    friends: IFriend[],
    image: string
}