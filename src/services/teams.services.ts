import { get, query, ref } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getAllTeams = () => {
  return get(query(ref(db, 'teams')));
};
