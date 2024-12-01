// auth.ts
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

const STRAVA_BASE_URL = 'https://www.strava.com/oauth';
const CLIENT_ID = '141532';  // Tu Client ID
const CLIENT_SECRET = '9b4b4265aa2c40d4ce83be893d9a97b091b3abe5';  // Tu Client Secret
const SCOPES = 'read';  // Los permisos que necesitas
const REDIRECT_URI = AuthSession.makeRedirectUri();  // URL generada por Expo

// Función de autenticación con Strava
export const authenticateWithStrava = async () => {
  const authUrl = `${STRAVA_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
  const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

  if (result.type === 'success' && result.url) {
    const params = new URLSearchParams(result.url.split('?')[1]);
    const code = params.get('code');
    if (code) {
      return code;
    }
  }
  return null;
};

// Función para intercambiar el código de autorización por tokens
export const exchangeCodeForTokens = async (code: string) => {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    });
  
    const data = await response.json();
    console.log('Access Token:', data.access_token);
    console.log('Refresh Token:', data.refresh_token);
    console.log('Expires At:', data.expires_at);
    return data;
  };
  

// Función para renovar el access token utilizando el refresh token
export const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  console.log('New Access Token:', data.access_token);
  console.log('New Refresh Token:', data.refresh_token);
  console.log('Expires At:', data.expires_at);
  return data;
};

export const getAthleteData = async (accessToken: string) => {
    const response = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const data = await response.json();
    console.log('Athlete Data:', data);
  };

  export const deauthorizeApp = async (accessToken: string) => {
    const response = await fetch('https://www.strava.com/oauth/deauthorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken }),
    });
  
    if (response.ok) {
      console.log('Application deauthorized successfully');
    } else {
      console.error('Error deauthorizing application');
    }
  };
  
