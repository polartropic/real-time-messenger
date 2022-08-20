import { equalTo, get, orderByChild, query, ref, push, DatabaseReference, DataSnapshot, onValue, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Channel, Team, User } from '../types/Interfaces';
import { deleteUserFromChat, getChatByName, removeUserFromChannel } from './channels.services';
import { deleteUsersTeam, updateUserTeams } from './users.services';

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

export const addMemberToTeam = (teamID: string, userName: string, index: number) => {
  return update(ref(db), {
    [`teams/${teamID}/members/${+index}`]: userName,
  });
};

export const deleteMemberFromTeam = (teamID: string, userIndex: number | null) => {
  return update(ref(db), {
    [`teams/${teamID}/members/${userIndex}`]: null,
  })
    .catch(console.error);
};
export const manageTeamMembersUpdateUsers = (usersOut: User[], usersIn: User[], team: Team, teamID: string) => {
  const usersToUpdate = usersOut.filter((user) => user.username !== team.owner);
  usersToUpdate.forEach((user) => {
    deleteUsersTeam(user.username, team.name)
      .catch((err) => {
        throw new Error(err.message);
      });
    Object.keys(user.channels).forEach((channel) => {
      if (Object.keys(team.channels).includes(channel)) {
        deleteUserFromChat(user.username, channel)
          .catch((err) => {
            throw new Error(err.message);
          });
        getChatByName(channel)
          .then((res) => {
            const object: object = res.val();
            const channel: Channel = Object.values(object)[0];
            const channelID = Object.keys(res.val())[0];
            const currentUserIndex = channel.participants.indexOf(user.username);
            removeUserFromChannel(channelID, Number(currentUserIndex));
          })
          .catch((err) => {
            throw new Error(err.message);
          });
      }
    });
    const name: string = user.username;
    const index = team.members.find((el: string, index: number) => {
      if (el === name) {
        return index;
      }
      return null;
    });

    deleteMemberFromTeam(teamID, Number(index));

    // Adding the users from the "left"
    usersIn.forEach(((user) => {
      const userTeams = Object.keys(user.teams);
      if (!userTeams.includes(team.name)) {
        updateUserTeams(user.username, team.name);
      }
      const username = user.username;
      const members: string[] = team.members;
      if (!members.includes(username)) {
        addMemberToTeam(teamID, username, team.members.length);
      };
    }));
  });
};

