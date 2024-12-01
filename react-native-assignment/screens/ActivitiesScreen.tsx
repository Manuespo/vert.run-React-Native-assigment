import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  monthId: string;
};

export default function ActivitiesScreen() {
  const activities = [
    { id: '1', name: 'Running', date: '2024-11-30', distance: '5 km', time: '25 min', elevation: '100 m', monthId: '1' },
    { id: '2', name: 'Cycling', date: '2024-10-15', distance: '20 km', time: '60 min', elevation: '500 m', monthId: '2' },
  ];

  const route = useRoute();
  const { monthId } = route.params as RouteParams;

  const filteredActivities = activities.filter((activity) => activity.monthId === monthId);

  return (
    <View style={styles.container}>
      {filteredActivities.length === 0 ? (
        <Text style={styles.noActivities}>No hay actividades para este mes.</Text>
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>Nombre: {item.name}</Text>
              <Text>Fecha: {item.date}</Text>
              <Text>Distancia: {item.distance}</Text>
              <Text>Tiempo: {item.time}</Text>
              <Text>Elevación: {item.elevation}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 10, marginVertical: 5, backgroundColor: '#f0f0f0', borderRadius: 5 },
  noActivities: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
});
