import { useEffect, useState } from 'react';
import { uid } from 'uid';
import { TeamParticipantsProps } from '../../types/Interfaces';

const TeamParticipants = ({ team }: TeamParticipantsProps): JSX.Element => {
  const [members, setMembers] = useState<string[]>([]);
  console.log(team);

  setMembers(team.members);
  const mappingParticipants = (participant: string, key: string) => {
    return <div key={key}>
      <p className='participant-item'>{participant}</p>
    </div>;
  };

  return (
    <div className="participants-list">

      <h4>Owner:</h4>
      <h5>{team?.owner}</h5>

      <h4>Participants of team:</h4>
      <div className='participants'>
        {members.map((participant) => mappingParticipants(participant, uid()))}
      </div>

    </div>
  );
};

export default TeamParticipants;

