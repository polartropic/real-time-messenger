import { SetStateAction, type Dispatch } from 'react';

import { User as FirebaseUser } from 'firebase/auth';

export interface iAppState {
  user: FirebaseUser | null,
  userData: User | null,

}

export interface ApplicationContext {
  appState: iAppState,
  isCreateTeamView: boolean,
  isDetailedChatClicked: boolean,
  isCreateChatClicked: boolean,
  setIsCreateChatClicked: Dispatch<boolean>,
  setIsDetailedChatClicked: Dispatch<boolean>,
  setIsCreateTeamView: Dispatch<boolean>,
  setState: Dispatch<SetStateAction<iAppState>>,
}

export interface UsersListProps {
  leftSide: User[],
  setLeftSide: Dispatch<SetStateAction<User[]>>,
  rightSide: User[],
  setRightSide: Dispatch<SetStateAction<User[]>>,

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
  messages: Object[],
  isPublic: boolean,

  teamID?: string,
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
  currentChannel: Channel
}
export interface ChatParticipantsProps {
  currentChannel: Channel,
  isDetailedChatClicked: boolean,
  setIsDetailedChatClicked: Dispatch<boolean>,

}
export interface TeamParticipantsProps {
  team: Team | undefined;
  isDetailedChatClicked: boolean,
  setIsDetailedChatClicked: Dispatch<boolean>,
}
export interface ChannelsListProps {
  props: {
    channels?: Channel[],
    chatList?: Channel[],
    setIsCreateChatClicked: Dispatch<boolean>,
    setIsDetailedChatClicked: Dispatch<boolean>,
    setIsCreateTeamView?: Dispatch<boolean>,
    setCurrentChat: Dispatch<SetStateAction<Channel>>
  }
}

export interface Message {
  id: string,
  content: string,
  author: string,
  createdOn: Date,
  reactions: {
    yes: number,
    no: number,
    heart: number,
  }
}

export interface MessageProps {
  message: Message,
  currentChannel: Channel,
}

export interface emojiObject {
  emoji: string
}

export interface Meeting {
  title: string,
  start: Date,
  end: Date,
  participants: string[]
};
