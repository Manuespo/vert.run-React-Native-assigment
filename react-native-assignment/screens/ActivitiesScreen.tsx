import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  monthId: string;
};

type Activity = {
  id: string;
  name: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
};

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute();
  const { monthId } = route.params as RouteParams;

  const accessToken = '6a3a779f181c649021aae02a8c66096ac6d6d0f1'; // Token de acceso estático

  // Función para obtener actividades desde la API de Strava
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        setError('No se pudieron obtener las actividades.');
      }
    } catch (err) {
      console.error('Error al obtener actividades:', err);
      setError('Error al conectar con la API de Strava.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar actividades por el mes
  const filteredActivities = activities.filter((activity) => {
    const activityMonth = new Date(activity.start_date_local).getMonth() + 1; // Mes de la actividad
    return activityMonth.toString() === monthId;
  });
  

  // Función para crear una nueva actividad
  const createActivity = async () => {
    const url = 'https://www.strava.com/api/v3/activities';
    const activityData = {
      name: 'My Test Activity',
      sport_type: 'Run',
      start_date_local: new Date().toISOString(),
      elapsed_time: 3600, // 1 hora
      description: 'This is a test activity',
      distance: 5000, // 5 km
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });

      const data = await response.json();
      console.log('Activity created:', data);

      if (response.ok) {
        Alert.alert('Éxito', 'Actividad creada con éxito.');
        fetchActivities(); // Actualizar lista de actividades
      } else {
        console.error('Error al crear actividad:', data);
        Alert.alert('Error', 'No se pudo crear la actividad.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo conectar con la API.');
    }
  };

  // Cargar actividades al montar el componente
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Crear Actividad" onPress={createActivity} />
      {loading ? (
        <Text style={styles.loading}>Cargando actividades...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : filteredActivities.length === 0 ? (
        <Text style={styles.noActivities}>No hay actividades para este mes.</Text>
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>Nombre: {item.name}</Text>
              <Text>Fecha: {new Date(item.start_date_local).toLocaleDateString()}</Text>
              <Text>Distancia: {(item.distance / 1000).toFixed(2)} km</Text>
              <Text>Tiempo: {(item.moving_time / 60).toFixed(1)} min</Text>
              <Text>Elevación: {item.total_elevation_gain} m</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
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
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noActivities: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
