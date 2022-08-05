import { type Dispatch } from 'react';

import { User as FirebaseUser } from 'firebase/auth';
import { User as AppUser } from '../types/Interfaces';

export interface ApplicationContext {
  appState : {
    user: FirebaseUser | null,
    userData: AppUser | null
  },
  setState : Dispatch<any>
}

export interface User {

  firstName: string,
  lastName: string,
  username: string,
  email: string,
  phoneNumber: string,
  imgURL: string,
  teams: string [],
  channels: string [],
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

