import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions, Button, Pressable, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;
const hours = Array.from({ length: 24 }, (_, i) => (i + 5) % 24);


const Dashboard = () => {
  const [filledCells, setFilledCells] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadCells = async () => {
        try {
          const raw = await AsyncStorage.getItem('filledCells');
          const saved = raw ? JSON.parse(raw) : [];

          const now = new Date();
          const hour = now.getHours();
          const minute = now.getMinutes();
          const col = (hour - 5 + 24) % 24;
          const row = Math.floor(minute / 15);

          const deduped = saved.filter(
            (v, i, arr) =>
              i === arr.findIndex(b => b.row === v.row && b.col === v.col)
          );


          setFilledCells(deduped);
        } catch (e) {
          console.error('Error loading filledCells:', e);
        }
      };



      loadCells();
    }, [])
  );

  const clearFilledCells = async () => {
    try {
      await AsyncStorage.removeItem('filledCells');
      setFilledCells([]); // 즉시 UI 반영
      Alert.alert('초기화 완료', '학습잔디가 성공적으로 초기화되었습니다!');
    } catch (e) {
      console.error('초기화 실패:', e);
      Alert.alert('오류', '초기화 도중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.greeting}>OhMoRi님 반가워요!</Text>
        <Text style={styles.subtitle}>오늘도 열공해볼까요?</Text>

        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>총 학습량</Text>
            <View style={styles.comcircle}>
              <Text style={styles.percentText}>100%</Text>
            </View>
            <Text style={styles.cardFooter}>2000/2000단어</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>내 진도</Text>
            <View style={styles.circle}>
              <Text style={styles.percentText}>0%</Text>
            </View>
            <Text style={styles.cardFooter}>0/2000단어</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>내 진도</Text>
            <View style={styles.circle}>
              <Text style={styles.percentText}>0%</Text>
            </View>
            <Text style={styles.cardFooter}>0/2000단어</Text>
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleButtonActive}>
            <Text style={styles.toggleText}>일간</Text>
          </View>
          <View style={styles.toggleButton}>
            <Text style={styles.toggleText}>주간</Text>
          </View>
          <View style={styles.toggleButton}>
            <Text style={styles.toggleText}>월간</Text>
          </View>
        </View>

        <View style={styles.gridWrapper}>
          {/* 시간 라벨 */}
          <View style={styles.gridRow}>
            {hours.map((hour, i) => (
              <Text key={i} style={styles.hourLabel}>
                {hour}
              </Text>
            ))}
          </View>

          {/* 4줄짜리 격자 */}
          {Array.from({ length: 4 }, (_, row) => (
            <View key={row} style={styles.gridRow}>
              {hours.map((_, col) => {
                const filled = filledCells.some(
                  cell => cell.row === row && cell.col === col
                );
                return (
                  <View
                    key={col}
                    style={[
                      styles.gridCell,
                      filled && styles.gridCellFilled,
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.clearButtonWrapper}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilledCells}>
            <Text style={styles.clearButtonText}>학습잔디 초기화</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    padding: 24,
  },
  greeting: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fafafa',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 220,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  comcircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: '#f4ca3f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  percentText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardFooter: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#f4ca3f',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  toggleButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  gridWrapper: {
    marginTop: 5,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 33,
    height: 33,
    backgroundColor: '#f0f0f0',
    margin: 1,
    borderRadius: 2,
  },
  gridCellFilled: {
    backgroundColor: '#f4ca3f',
  },
  hourLabel: {
    width: 33,
    height: 33,
    lineHeight: 33,
    verticalAlign: 'middle',
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    margin: 1,
    color: '#333',
  },

  clearButtonWrapper: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  clearButton: {
    backgroundColor: '#f4ca3f',
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;
