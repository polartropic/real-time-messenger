import { uid } from 'uid';
import { TeamParticipantsProps, User } from '../../types/Interfaces';
import UserComponent from '../User/User';

const TeamParticipants = ({ owner,
  allUsers }: TeamParticipantsProps): JSX.Element | null => {
  const mappingParticipants = (participant: User, key: string) => {
    return <div key={key}>
      <UserComponent props={{ user: participant }} />
    </div>;
  };

  return (
    <div className="participants-list">

      <h4>Owner:</h4>
      <UserComponent props={{ user: owner }} />

      <h4>Participants of team:</h4>
      <div className='participants'>
        {allUsers.map((participant) => mappingParticipants(participant, uid()))}
      </div>

    </div>
  );
};

export default TeamParticipants;

