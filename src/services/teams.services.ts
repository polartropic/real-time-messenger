import { get, query, ref } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getTeamsCount = () => {
  return get(query(ref(db, 'teams')));
};
