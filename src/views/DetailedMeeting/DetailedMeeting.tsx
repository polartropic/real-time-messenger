import { DyteMeeting, provideDyteDesignSystem } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient, useDyteMeeting } from '@dytesdk/react-web-core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_KEY, BASE_URL, ORGANIZATION_ID } from '../../common/constants';
import { ToastContainer, toast } from 'react-toastify';
import AppContext from '../../providers/AppContext';
import { ReceivedMeeting } from '../../types/Interfaces';
import Loading from '../../assets/images/Loading.gif';
import './DetailedMeeting.css';
import { dyteMeetingFunc, dyteParticipantFunc } from '../../services/dyte.services';

const DetailedMeeting = (): JSX.Element => {
  const { meetingID } = useParams();
  const { appState } = useContext(AppContext);
  const userData = appState.userData;
  const navigate = useNavigate();
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

  useEffect(() => {
    axios.request(dyteMeetingFunc(BASE_URL, ORGANIZATION_ID, meetingID, API_KEY ))
      .then((response) => setReceivedMeeting(response.data.data.meeting))
      .then(() =>
        axios.request(dyteParticipantFunc(BASE_URL, ORGANIZATION_ID, meetingID, API_KEY, userData?.username, userData?.firstName))
          .then((response)=> setAddedUser(response.data.data.authResponse.authToken))
          .catch((error) => console.error(error)))
      .catch((error) => console.error(error));
  }, [meetingID, userData?.firstName, userData?.username]);

  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    if (addedUser && receivedMeeting.roomName) {
      initMeeting({
        roomName: receivedMeeting.roomName,
        authToken: addedUser,
        defaults: {
          audio: true,
          video: false,
        },
      });
    }
    if (receivedMeeting.status === 'CLOSED') {
      toast.warning('The meeting is already closed! Please create a new one.');
      navigate('/my-meetings');
    }
  }, [addedUser, receivedMeeting.roomName]);

  const MyMeeting = () => {
    const { meeting } = useDyteMeeting();

    useEffect(() => {
      if (meeting) {
        meeting.meta.on('roomJoined', () => {
          meeting.joinRoom();
        });

        provideDyteDesignSystem(document.body, {
          theme: 'light',
          colors: {
            'danger': '#2f455d',
            'brand': {
              300: '#2f455d',
            },
            'text': '#071428',
            'text-on-brand': '#ffffff',
            'video-bg': '#E5E7EB',
          },
          borderRadius: 'extra-rounded',
        });
        meeting.meta.on('disconnected', () => {
          meeting.leaveRoom();

          const options = {
            method: 'PUT',
            url: `https://api.cluster.dyte.in/v1/organizations/${ORGANIZATION_ID}/meetings/${meetingID}`,
            headers: { 'Content-Type': 'application/json', 'Authorization': `${API_KEY}`, 'Access-Control-Allow-Origin': '*' },
            data: { title: receivedMeeting.title, status: 'CLOSED' },
          };

          axios.request(options).then(function(response) {
            console.log(response.data);
          }).catch(function(error) {
            console.error(error);
          });
        });
      }
    }, [meeting]);

    return (
      <div style={{ height: '91vh' }}>
        <DyteMeeting showSetupScreen={true} mode="fill" meeting={meeting!} />
      </div>
    );
  };

  return (
    !meeting?
      <>
        <img id="loader" src={Loading} alt='loader'></img>
      </>:
      <DyteProvider value={meeting}>
        <MyMeeting />
        <ToastContainer />
      </DyteProvider>
  );
};

export default DetailedMeeting;
