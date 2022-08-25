import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
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
import MyMeeting from '../../components/MyMeeting/MyMeeting';

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
        axios.request(dyteParticipantFunc(BASE_URL, ORGANIZATION_ID, meetingID, API_KEY, userData?.username, userData?.firstName, userData?.imgURL!))
          .then((response)=> setAddedUser(response.data.data.authResponse.authToken))
          .catch((error) => console.error(error)))
      .catch((error) => console.error(error));
  }, [meetingID, userData?.firstName, userData?.imgURL, userData?.username]);

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

  return (
    !meeting?
      <>
        <img id="loader" src={Loading} alt='loader'></img>
      </>:
      <DyteProvider value={meeting}>
        <MyMeeting meetingID={meetingID!} receivedMeetingTitle={receivedMeeting.title}/>
        <ToastContainer />
      </DyteProvider>
  );
};

export default DetailedMeeting;
