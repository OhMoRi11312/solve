import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ 추가

import HomeScreen from './screens/HomeScreen';
import SolveScreen from './screens/SolveScreen';


enableScreens();

function Tab3Screen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>탭 3 화면</Text>
    </View>
  );
}

function Tab4Screen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>탭 4 화면</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.hide(); // 앱 로딩 완료되자마자 숨김
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* ✅ 여기로 감쌈 */}
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            height: 60,
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 4,
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ focused }) => {
            let icon = '❓';
            if (route.name === '메인') icon = '🏠';
            else if (route.name === '풀이') icon = '✏️';
            else if (route.name === '탭3') icon = '📄';
            else if (route.name === '탭4') icon = '⚙️';

            return (
              <Text style={{ fontSize: 20, marginBottom: -4 }}>
                {icon}
              </Text>
            );
          },
        })}
      >
        <Tab.Screen
          name="메인"
          component={HomeScreen}
          options={{ tabBarLabel: '메인' }}
        />
        <Tab.Screen
          name="풀이"
          component={SolveScreen}
          options={{ tabBarLabel: '풀이' }}
        />
        <Tab.Screen
          name="탭3"
          component={Tab3Screen}
          options={{ tabBarLabel: '탭3' }}
        />
        <Tab.Screen
          name="탭4"
          component={Tab4Screen}
          options={{ tabBarLabel: '탭4' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
