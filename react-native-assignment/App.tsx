import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

const STRAVA_BASE_URL = 'https://www.strava.com/oauth';
const CLIENT_ID = '141532'; // Tu Client ID de Strava
const CLIENT_SECRET = '9b4b4265aa2c40d4ce83be893d9a97b091b3abe5'; // Tu Client Secret de Strava
const REDIRECT_URI = AuthSession.makeRedirectUri(); // URL de redirección generada por Expo
const SCOPES = 'read'; // Alcance de permisos requeridos

export default function App() {
  const [authCode, setAuthCode] = React.useState<string | null>(null);

  const authenticateWithStrava = async () => {
    const authUrl = `${STRAVA_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

    if (result.type === 'success' && result.url) {
      const params = new URLSearchParams(result.url.split('?')[1]);
      const code = params.get('code');
      setAuthCode(code); // Guarda el código de autorización
      console.log('Authorization code:', code);
    } else {
      console.error('Autenticación fallida:', result);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Iniciar sesión con Strava" onPress={authenticateWithStrava} />
      {authCode && <Text>Authorization code: {authCode}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
