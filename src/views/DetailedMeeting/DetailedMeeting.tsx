import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_KEY, BASE_URL, CLOSED_MEETING_STATUS, ORGANIZATION_ID } from '../../common/constants';
import { ToastContainer, toast } from 'react-toastify';
import AppContext from '../../providers/AppContext';
import { ReceivedMeeting } from '../../types/Interfaces';
import Loading from '../../assets/images/Loading.gif';
import { dyteMeetingFunc, dyteParticipantFunc } from '../../services/dyte.services';
import MyMeeting from '../../components/MyMeeting/MyMeeting';
import './DetailedMeeting.css';

const DetailedMeeting = (): JSX.Element => {
  const { meetingID } = useParams();

  const { appState } = useContext(AppContext);
  const userData = appState.userData;

  const navigate = useNavigate();

  const [authToken, setAuthToken] = useState('');
  const [receivedMeeting, setReceivedMeeting] = useState<ReceivedMeeting>({} as ReceivedMeeting);

  useEffect(() => {
    axios.request(dyteMeetingFunc(BASE_URL, ORGANIZATION_ID, meetingID, API_KEY ))
      .then((response) => setReceivedMeeting(response.data.data.meeting))
      .then(() =>
        axios.request(dyteParticipantFunc(BASE_URL, ORGANIZATION_ID, meetingID, API_KEY, userData?.username, userData?.firstName, userData?.imgURL!))
          .then((response)=> setAuthToken(response.data.data.authResponse.authToken))
          .catch((error) => console.error(error)))
      .catch((error) => console.error(error));
  }, [meetingID, userData?.firstName, userData?.imgURL, userData?.username]);

  const [meeting, initMeeting] = useDyteClient();


  useEffect(() => {
    if (authToken && receivedMeeting.roomName) {
      initMeeting({
        roomName: receivedMeeting.roomName,
        authToken: authToken,
        defaults: {
          audio: true,
          video: false,
        },
      });
    }

    if (receivedMeeting.status === CLOSED_MEETING_STATUS) {
      toast.warning('The meeting is already closed! Please create a new one.');
      navigate('/my-meetings');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, receivedMeeting.roomName]);

  return (
    !meeting?
      <>
        <img id="loader" src={Loading} alt='loader'></img>
      </>:
      <DyteProvider value={meeting}>
        <MyMeeting meetingID={meetingID!} receivedMeetingTitle={receivedMeeting.title}/>
        <ToastContainer
          autoClose={2000}
        ></ToastContainer>
      </DyteProvider>
  );
};

export default DetailedMeeting;
