import { DyteMeeting, provideDyteDesignSystem } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { BASE_URL, ORGANIZATION_ID, API_KEY } from '../../common/constants';
import { UserStatus } from '../../common/user-status.enum';
import AppContext from '../../providers/AppContext';
import { dyteMeetingClosureFunc } from '../../services/dyte.services';
import { updateUserStatus } from '../../services/users.services';
import { MyMeetingProps } from '../../types/Interfaces';

const MyMeeting = ({ meetingID, receivedMeetingTitle }: MyMeetingProps) => {
  const { meeting } = useDyteMeeting();

  const { appState } = useContext(AppContext);
  const username = appState?.userData?.username!;

  useEffect(() => {
    if (meeting) {
      updateUserStatus(username, UserStatus.IN_A_MEETING).catch(console.error);

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
        meeting.leaveRoom().catch(console.error);

        updateUserStatus(username, UserStatus.ONLINE).catch(console.error);

        axios.request(dyteMeetingClosureFunc(BASE_URL, ORGANIZATION_ID, meetingID, API_KEY, receivedMeetingTitle))
          .catch((error) => console.error(error));
      });
    }
  }, [meeting, meetingID, receivedMeetingTitle, username]);

  return (
    <div style={{ height: '91vh' }}>
      <DyteMeeting showSetupScreen={true} mode="fill" meeting={meeting!} />
    </div>
  );
};

export default MyMeeting;
