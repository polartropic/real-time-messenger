import { SetStateAction, type Dispatch } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

export interface iAppState {
  user: FirebaseUser | null,
  userData: User | null,
}

export interface ApplicationContext {
  appState: iAppState,
  isTeamView: boolean,
  isDetailedChatClicked: boolean,
  isCreateChatClicked: boolean,
  isMeetingClicked: boolean,
  setIsCreateChatClicked: Dispatch<SetStateAction<boolean>>,
  setIsDetailedChatClicked: Dispatch<SetStateAction<boolean>>,
  setIsTeamView: Dispatch<SetStateAction<boolean>>,
  setIsMeetingClicked: Dispatch<SetStateAction<boolean>>,
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
  status: string,
  teams: string[],
  channels: string[],
  uid: string,
}

export interface Channel {
  id: string,
  title: string,
  participants: string[], // UserIDs
  messages: Message[],
  isPublic: boolean,
  lastActivity: Date,
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
    buttonEl?: JSX.Element,
  },
}

export interface ChannelProps {
  currentChannel: Channel,
}

export interface CreateMessageProps {
  handleSubmit: (_message: string) => void,
  existingMessage: string | undefined,
}

export interface ChatParticipantsProps {
  currentChannel: Channel,
  allUsers: User [],
  owner?: User,
}

export interface TeamParticipantsProps {
  owner: User,
  allUsers: User[],
}

export interface ChannelsListProps {
  props: {
    channels?: Channel[],
    setCurrentChat: Dispatch<SetStateAction<Channel>>,
  },
}

export interface Message {
  id: string,
  content: string,
  author: string,
  createdOn: Date,
  likedBy: string[],
  fileURL?: string,
  image?: boolean,
}

export interface MessageProps {
  message: Message,
  currentChannel: Channel,
  handleEditMessage: (_message: Message) => void,
  toBeEdited: boolean,
}

export interface emojiObject {
  emoji: string,
}

export interface Meeting {
  title: string,
  start: Date,
  end: Date,
  participants: string[],
  id: string,
}

export interface SelectedMeetingProps {
  selectedEvent: {
    title: string,
    start: Date,
    end: Date,
    participants: string[],
    id: string,
  },
  setModalState: Dispatch<boolean>,
}

export interface ReceivedMeeting {
  createdAt: string,
  id: string,
  liveStreamOnStart: boolean,
  recordOnStart: boolean,
  roomName: string,
  status: string,
  title: string,
}

export interface MyMeetingProps {
  meetingID: string,
  receivedMeetingTitle: string,
}
