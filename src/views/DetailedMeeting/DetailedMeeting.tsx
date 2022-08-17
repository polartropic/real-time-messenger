// import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
// import { useEffect } from "react";
import { DyteMeeting, DyteParticipantsAudio } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient, useDyteMeeting } from '@dytesdk/react-web-core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_KEY, ORGANIZATION_ID } from '../../common/constants';
import AppContext from '../../providers/AppContext';

const DetailedMeeting = (): JSX.Element => {
  const { meetingID } = useParams();
  const { appState } = useContext(AppContext);
  const userData = appState.userData;
  const [receivedMeeting, setReceivedMeeting] = useState<any>({});
  const [addedUser, setAddedUser] = useState<any>({});
  console.log(receivedMeeting.roomName);
  console.log(addedUser);

  useEffect(() => {
    const dyteMeetingCreation = {
      method: 'GET',
      url: `https://api.cluster.dyte.in/v1/organizations/${ORGANIZATION_ID}/meetings/${meetingID}`,
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
      url: 'https://api.cluster.dyte.in/v1/organizations/b7838bf7-5f4b-4e40-b240-8f61e3e85edf/meetings/c263ab82-a074-4a41-a779-c3b2580af880/participant',
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
  }, []);


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
      {/* <DyteParticipantsAudio meeting={meeting!}> */}
      <MyMeeting />
      {/* </DyteParticipantsAudio> */}
    </DyteProvider>
  );
};

export default DetailedMeeting;
