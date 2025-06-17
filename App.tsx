import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import SolveScreen from './screens/SolveScreen';
import TimerScreen from './screens/TimerScreen.tsx';
import ScoreAnalysisScreen from './screens/ScoreAnalysisScreen';

enableScreens();




function NotificationScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>お知らせ</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Setting</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerType="permanent"
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: '#fff',
              width: 240,
            },
          }}
        >
          <Drawer.Screen name="홈화면" component={HomeScreen} />
          <Drawer.Screen name="학습" component={SolveScreen} />
          <Drawer.Screen name="타이머" component={TimerScreen} />
          <Drawer.Screen name="성적분석" component={ScoreAnalysisScreen} />
          <Drawer.Screen name="알림" component={NotificationScreen} />
          <Drawer.Screen name="설정" component={SettingsScreen} />
        </Drawer.Navigator>
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
