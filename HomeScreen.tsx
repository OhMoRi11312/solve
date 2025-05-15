import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.greeting}>Jaehoo님 반가워요!</Text>
        <Text style={styles.subtitle}>오늘도 열공해볼까요?</Text>

        <View style={styles.horizontalSection}>
          {/* 왼쪽 1/2 */}
          <View style={styles.leftHalfBox}>
            <Text style={styles.progressTitle}>내 진도</Text>
            <Text style={styles.progressText}>0%</Text>
            <Text style={styles.progressSubText}>0 / 2000단어</Text>
          </View>

          {/* 오른쪽 1/2 - 수평 3등분 */}
          <View style={styles.rightHalfRow}>
            <View style={styles.rightBox}>
              <Text style={styles.rightBoxText}>내 진도</Text>
            </View>
            <View style={styles.rightBox}>
              <Text style={styles.rightBoxText}>내 진도</Text>
            </View>
            <View style={styles.rightBox}>
              <Text style={styles.rightBoxText}>내 진도</Text>
            </View>
          </View>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>공지사항</Text>
          <Text style={styles.noticeContent}>IOS 15.8 업데이트 안내</Text>
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
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    marginBottom: 24,
  },
  horizontalSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  leftHalfBox: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2f80ed',
  },
  progressSubText: {
    fontSize: 16,
    color: '#888',
  },
  rightHalfRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightBox: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  rightBoxText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noticeCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  noticeContent: {
    fontSize: 16,
    color: '#856404',
  },
});

export default App;
