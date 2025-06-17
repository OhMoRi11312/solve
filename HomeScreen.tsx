import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;

const Dashboard = () => {
  return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <Text style={styles.greeting}>Jaehoo님 반가워요!</Text>
          <Text style={styles.subtitle}>오늘도 열공해볼까요?</Text>

          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>총 학습량</Text>
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

            <View style={styles.card}>
              <Text style={styles.cardTitle}>내 진도</Text>
              <View style={styles.circle}>
                <Text style={styles.percentText}>0%</Text>
              </View>
              <Text style={styles.cardFooter}>0/2000단어</Text>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleButtonActive}><Text style={styles.toggleText}>일간</Text></View>
            <View style={styles.toggleButton}><Text style={styles.toggleText}>주간</Text></View>
            <View style={styles.toggleButton}><Text style={styles.toggleText}>월간</Text></View>
          </View>

          <View style={styles.graphContainer}>
            {Array.from({ length: 30 }, (_, i) => (
                <View
                    key={i}
                    style={[styles.bar, i === 5 || i === 9 || i === 11 || i === 18 || i === 21 ? styles.barActive : null]}
                />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

const BAR_WIDTH = 10;


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
    fontWeight: '600',
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
    marginHorizontal: 6, // 카드 사이 여백
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
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  toggleButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingTop: 12,
  },
  bar: {
    width: BAR_WIDTH,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  barActive: {
    height: 60,
    backgroundColor: '#f4ca3f',
  },
});

export default Dashboard;
