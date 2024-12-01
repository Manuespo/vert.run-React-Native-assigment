import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

const STRAVA_BASE_URL = 'https://www.strava.com/oauth';
const CLIENT_ID = '141532'; // Tu Client ID
const CLIENT_SECRET = '9b4b4265aa2c40d4ce83be893d9a97b091b3abe5'; // Tu Client Secret
const REDIRECT_URI = AuthSession.makeRedirectUri(); // Redirección automáticamente manejada por Expo
const SCOPES = 'read'; // Permisos requeridos

export async function authenticateWithStrava() {
  const authUrl = `${STRAVA_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;

  // Usar WebBrowser para abrir la URL de autenticación en un navegador
  const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

  if (result.type === 'success' && result.url) {
    const params = new URLSearchParams(result.url.split('?')[1]);
    const code = params.get('code');
    console.log('Authorization code:', code);
    return code;
  } else {
    console.error('Autenticación fallida:', result);
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${STRAVA_BASE_URL}/token`, {
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
    return data; // Nuevo access_token y refresh_token
  } catch (error) {
    console.error('Error al renovar el token:', error);
    return null;
  }
}
