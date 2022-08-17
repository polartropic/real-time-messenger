import { DyteMeeting } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient, useDyteMeeting } from '@dytesdk/react-web-core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_KEY, BASE_URL, ORGANIZATION_ID } from '../../common/constants';
import AppContext from '../../providers/AppContext';
import { ReceivedMeeting } from '../../types/Interfaces';

const DetailedMeeting = (): JSX.Element => {
  const { meetingID } = useParams();
  const { appState } = useContext(AppContext);
  const userData = appState.userData;
  const [receivedMeeting, setReceivedMeeting] = useState<ReceivedMeeting>({
    createdAt: '',
    id: '',
    liveStreamOnStart: false,
    recordOnStart: false,
    roomName: '',
    status: '',
    title: '',
  });
  const [addedUser, setAddedUser] = useState('');
  console.log(receivedMeeting.roomName);
  console.log(addedUser);

  useEffect(() => {
    const dyteMeetingCreation = {
      method: 'GET',
      url: `${BASE_URL}/organizations/${ORGANIZATION_ID}/meetings/${meetingID}`,
      // eslint-disable-next-line quote-props
      headers: { 'Content-Type': 'application/json', Authorization: `${API_KEY}`, 'Access-Control-Allow-Origin': '*' },
    };

    axios.request(dyteMeetingCreation).then(function(response) {
      setReceivedMeeting(response.data.data.meeting);
    }).catch(function(error) {
      console.error(error);
    });
  }, [meetingID]);

  useEffect(() => {
    const dyteParticipantCreation = {
      method: 'POST',
      url: `${BASE_URL}/organizations/${ORGANIZATION_ID}/meetings/${meetingID}/participant`,
      // eslint-disable-next-line quote-props
      headers: { 'Content-Type': 'application/json', Authorization: `${API_KEY}`, 'Access-Control-Allow-Origin': '*' },
      data: {
        clientSpecificId: userData?.username,
        userDetails: {
          name: userData?.firstName,
          picture: 'https://images.rawpixel.com/image_png_600/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjc5MS10YW5nLTEzLnBuZw.png',
        },
        roleName: 'host',
      },
    };
    axios.request(dyteParticipantCreation).then(function(response) {
      setAddedUser(response.data.data.authResponse.authToken);
    }).catch(function(error) {
      console.error(error);
    });
  }, [meetingID, userData?.firstName, userData?.username]);


  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    initMeeting({
      roomName: receivedMeeting.roomName,
      authToken: addedUser,
      defaults: {
        audio: true,
        video: false,
      },
    });
  }, [addedUser, receivedMeeting.roomName]);

  function MyMeeting() {
    const { meeting } = useDyteMeeting();

    useEffect(() => {
      meeting?.joinRoom();
    }, [meeting]);

    return (
      <div style={{ height: '80vh' }}>
        <DyteMeeting showSetupScreen={true} mode="fill" meeting={meeting!} />
      </div>
    );
  }

  return (
    <DyteProvider value={meeting}>
      <MyMeeting />
    </DyteProvider>
  );
};

export default DetailedMeeting;
