import { equalTo, get, orderByChild, query, ref, push, DatabaseReference } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Team } from '../types/Interfaces';
export const getAllTeams = () => {
  return get(query(ref(db, 'teams')));
};

export const getTeamByID = (id: string) => {
  return get(query(ref(db, `teams/${id}`)));
};

export const getTeamByName = (name: string) => {
  return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));
};

export const addTeamToDB = async (team: Team): Promise<DatabaseReference> => {
  return push(ref(db, 'teams'), team);
  // .then((res) => getTeamByID(res.key))
};

