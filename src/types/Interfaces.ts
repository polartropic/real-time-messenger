import { type Dispatch } from 'react';

import { User as FirebaseUser } from 'firebase/auth';

export interface ApplicationContext {
  appState: {
    user: FirebaseUser | null,
    userData: User | null,
  },
  isCreateTeamView: boolean,
  isDetailedChatClicked: boolean,
  isCreateChatClicked: boolean,
  setIsCreateChatClicked: Dispatch<any>,
  setIsDetailedChatClicked: Dispatch<any>,
  setIsCreateTeamView: Dispatch<any>,
  setState: Dispatch<any>,
}

export interface User {

  firstName: string,
  lastName: string,
  username: string,
  email: string,
  phoneNumber: string,
  imgURL: string,
  teams: string[],
  channels: string[],
  uid: string,
};

export interface Channel {
  id: string,
  title: string,
  participants: string[], // UserIDs
  isPublic: boolean,

}

export interface Team {
  name: string,
  owner: string | undefined, // UserID
  members: string[] | [], // UserIDs
  channels: string[], // ChannelIDs

}

export interface UserProps {
  props: {
    user: User,
    buttonEl?: JSX.Element
  }
}

export interface ChannelProps {
  currentChannel: {
    date: object,
    id: string,
    isPublic: boolean,
    participants: string[],
    title: string,
  }
}
