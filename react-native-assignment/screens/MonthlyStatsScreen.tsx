import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Activities: { monthId: string };
  MonthlyStats: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'MonthlyStats'>;

export default function MonthlyStatsScreen() {
  const navigation = useNavigation<NavigationProps>();

  const monthlyStats = [
    { id: '1', month: 'Noviembre 2024', totalDistance: '120 km', totalTime: '15 horas', totalElevation: '1,000 m' },
    { id: '2', month: 'Octubre 2024', totalDistance: '100 km', totalTime: '12 horas', totalElevation: '900 m' },
    { id: '3', month: 'Septiembre 2024', totalDistance: '80 km', totalTime: '10 horas', totalElevation: '800 m' },
  ];

  const handleMonthPress = (monthId: string) => {
    navigation.navigate('Activities', { monthId });
  };

  return (
    <View style={styles.container}>
      {monthlyStats.length === 0 ? (
        <Text style={styles.noStats}>No hay estadísticas disponibles.</Text>
      ) : (
        <FlatList
          data={monthlyStats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMonthPress(item.id)} style={styles.card}>
              <Text style={styles.month}>{item.month}</Text>
              <Text>Distancia Total: {item.totalDistance}</Text>
              <Text>Tiempo Total: {item.totalTime}</Text>
              <Text>Ganancia de Elevación: {item.totalElevation}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, marginVertical: 10, backgroundColor: '#e0e0e0', borderRadius: 5 },
  month: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  noStats: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
});
