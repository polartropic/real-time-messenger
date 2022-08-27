import { DyteMeeting, provideDyteDesignSystem } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';
import axios from 'axios';
import { useEffect } from 'react';
import { BASE_URL, ORGANIZATION_ID, API_KEY } from '../../common/constants';
import { dyteMeetingClosureFunc } from '../../services/dyte.services';
import { MyMeetingProps } from '../../types/Interfaces';

const MyMeeting = ({ meetingID, receivedMeetingTitle }: MyMeetingProps) => {
  const { meeting } = useDyteMeeting();

  useEffect(() => {
    if (meeting) {
      meeting.meta.on('roomJoined', () => {
        meeting.joinRoom();
      });

      provideDyteDesignSystem(document.body, {
        theme: 'light',
        colors: {
          'danger': '#4558cf',
          'brand': {
            300: '#4558cf',
          },
          'text': '#071428',
          'text-on-brand': '#ffffff',
          'video-bg': '#E5E7EB',
        },
        borderRadius: 'extra-rounded',
      });

      meeting.meta.on('disconnected', () => {
        meeting.leaveRoom();

        axios.request(dyteMeetingClosureFunc(BASE_URL, ORGANIZATION_ID, meetingID, API_KEY, receivedMeetingTitle))
          .then((response) => console.log(response.data))
          .catch((error) => console.error(error));
      });
    }
  }, [meeting, meetingID, receivedMeetingTitle]);

  return (
    <div style={{ height: '91vh' }}>
      <DyteMeeting showSetupScreen={true} mode="fill" meeting={meeting!} />
    </div>
  );
};

export default MyMeeting;
