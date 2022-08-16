import { equalTo, get, orderByChild, query, ref, push, DatabaseReference, DataSnapshot, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Team } from '../types/Interfaces';

export const getAllTeams = () => {
  return get(query(ref(db, 'teams')));
};

export const getAllTeamsLive = (listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, 'teams'), listen);
};

export const getTeamByID = (id: string) => {
  return get(query(ref(db, `teams/${id}`)));
};

export const getTeamByName = (name: string) => {
  return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));
};

export const addTeamToDB = async (name: string, owner: string, members: string[] | []): Promise<DatabaseReference> => {
  const team: Team = {
    name: name,
    owner: owner,
    members: members || [],
    channels: [],
  };

  return push(ref(db, 'teams'), team);
};

export const getLiveTeamChannels = (teamID: string, listen: (_snapshot: DataSnapshot) => void) => {
  return onValue(ref(db, `teams/${teamID}/channels`), listen);
};

export const updateTeamMembers = (teamID: string, members: string[]) => {
  return update(ref(db), {
    [`teams/${teamID}/members/`]: members,
  });
};
