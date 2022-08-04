export interface User {
  username: string,
  email: string,
  phone_number: number,
  imgURL: string,
  teams: string [],
  channels: string [],
  friends: string [],
  uid: string,
};

export interface Channel {
  id: string,
  title: string,
  participants: string [], // UserIDs
  isPublic: boolean,

}

export interface Team {
  id: string,
  name: string,
  owner: string, // UserID
  members: string [], // UserIDs
  channels: string [], // ChannelIDs

}
