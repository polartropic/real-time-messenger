export const dyteMeetingFunc = (baseURL: string, orgID: string, meetingID: string | undefined, apiKey: string) => {
  const dyteMeetingCreation = {
    method: 'GET',
    url: `${baseURL}/organizations/${orgID}/meetings/${meetingID}`,
    headers: { 'Content-Type': 'application/json', 'Authorization': `${apiKey}`, 'Access-Control-Allow-Origin': '*' },
  };

  return dyteMeetingCreation;
};

export const dyteParticipantFunc =
(baseURL: string, orgID: string, meetingID: string | undefined, apiKey: string, username: string | undefined,
  name: string | undefined, imgURL: string) => {
  const dyteParticipantCreation = {
    method: 'POST',
    url: `${baseURL}/organizations/${orgID}/meetings/${meetingID}/participant`,
    headers: { 'Content-Type': 'application/json', 'Authorization': `${apiKey}`, 'Access-Control-Allow-Origin': '*' },
    data: {
      clientSpecificId: username,
      userDetails: {
        name: name,
        picture: imgURL,
      },
      roleName: 'host',
    },
  };
  return dyteParticipantCreation;
};

export const dyteMeetingCreationFunc = (baseURL: string, orgID: string, apiKey: string, name: string) => {
  const meetingCreation = {
    method: 'POST',
    url: `${baseURL}/organizations/${orgID}/meeting`,
    headers: { 'Content-Type': 'application/json', 'Authorization': `${apiKey}` },
    data: { title: name, authorization: { waitingRoom: false } },
  };
  return meetingCreation;
};

export const dyteMeetingClosureFunc = (baseURL: string, orgID: string, meetingID: string | undefined, apiKey: string, title: string) => {
  const dyteMeetingClosure = {
    method: 'PUT',
    url: `${baseURL}/organizations/${orgID}/meetings/${meetingID}`,
    headers: { 'Content-Type': 'application/json', 'Authorization': `${apiKey}`, 'Access-Control-Allow-Origin': '*' },
    data: { title: title, status: 'CLOSED' },
  };
  return dyteMeetingClosure;
};

