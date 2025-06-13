import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
            headerShown: false, // 상단 네비게이션 바 제거
            drawerStyle: {
              backgroundColor: '#fff',
              width: 240,
            },
          }}
        >
          <Drawer.Screen name="메인" component={HomeScreen} />
          <Drawer.Screen name="풀이" component={SolveScreen} />
          <Drawer.Screen name="탭3" component={Tab3Screen} />
          <Drawer.Screen name="탭4" component={Tab4Screen} />
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
