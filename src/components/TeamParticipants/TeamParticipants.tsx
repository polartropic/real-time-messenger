import { useEffect, useState } from 'react';
import { uid } from 'uid';
import { getAllUsers } from '../../services/users.services';
import { TeamParticipantsProps, User } from '../../types/Interfaces';
import UserComponent from '../User/User';

const TeamParticipants = ({ team }: TeamParticipantsProps): JSX.Element => {
  const [members, setMembers] = useState<User[]>([]);
  const [owner, setOwner] = useState<User>();
  useEffect(() => {
    if (team) {
      getAllUsers()
        .then((snapshot) => {
          const allUsers: User[] = Object.values(snapshot.val());
          const teamMembers: string [] = team.members;
          const currentChannelUsers = allUsers.filter((user) =>
            teamMembers.includes(user.username));

          setMembers(currentChannelUsers);
          setOwner(allUsers.find((user) => user.username === team.owner));
        });
    }
  }, [team]);
  const mappingParticipants = (participant: User, key: string) => {
    return <div key={key}>
      <UserComponent props={{ user: participant }}/>
    </div>;
  };

  return (
    <div className="participants-list">

      <h4>Owner:</h4>
      <UserComponent props={{ user: owner! }}/>

      <h4>Participants of team:</h4>
      <div className='participants'>
        {members.map((participant) => mappingParticipants(participant, uid()))}
      </div>

    </div>
  );
};

export default TeamParticipants;

