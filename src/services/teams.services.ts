import { equalTo, get, orderByChild, query, ref } from 'firebase/database';
import { db } from '../config/firebase-config';
export const getAllTeams = () => {
  return get(query(ref(db, 'teams')));
};

export const getTeamByID = (id: string) => {
  return get(query(ref(db, `teams/${id}`)));
};

export const getTeamByName = (name: string) => {
  return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));
};


