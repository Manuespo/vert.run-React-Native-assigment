import React, { useState } from 'react';
import { Button, Text, View, FlatList, StyleSheet } from 'react-native';

const ACCESS_TOKEN = '6a3a779f181c649021aae02a8c66096ac6d6d0f1'; // Token de acceso estático

export default function App() {
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener actividades del usuario
  const getActivities = async () => {
    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setActivities(data); // Guardar actividades en el estado
      } else {
        setError('No se pudieron obtener actividades.');
      }
    } catch (err) {
      console.error('Error obteniendo actividades:', err);
      setError('Error obteniendo actividades.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Obtener Actividades" onPress={getActivities} />
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Nombre: {item.name}</Text>
            <Text>Distancia: {item.distance} metros</Text>
            <Text>Tiempo: {item.moving_time} segundos</Text>
            <Text>Elevación: {item.total_elevation_gain} metros</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
