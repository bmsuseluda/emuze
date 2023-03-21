export const clientId = "wrys9qyv68d1ydnc7gs0g1wzsu55j9";
const authenticationUrl = "https://id.twitch.tv/oauth2/token";
const authenticationRequestParams = {
  client_id: clientId,
  client_secret: "2colzk78fd7q1e7y2hib1bznbfuvrl",
  grant_type: "client_credentials",
};

const authenticationRequest = new Request(
  `${authenticationUrl}?${new URLSearchParams(
    authenticationRequestParams
  ).toString()}`,
  {
    method: "POST",
    headers: {
      Accept: "application/json",
      Content_Type: "application/json",
    },
  }
);

type Result = {
  access_token: string;
  expires_in: number;
};

let accessToken: Result;
export const getAccessToken = async () => {
  if (accessToken?.access_token) {
    return accessToken.access_token;
  } else {
    const response = await fetch(authenticationRequest);
    const result = (await response.json()) as Result;

    if (result.access_token) {
      accessToken = result;
      return accessToken.access_token;
    }
  }
};
getAccessToken();
