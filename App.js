import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import GameScreen from './src/screens/GameScreen';
import StatsScreen from './src/screens/StatsScreen';
import {
  HistoryContext,
  ThemeModeContext,
  useAppBootstrap,
} from './src/context/AppContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const { historyValue, themeValue, paperTheme, navTheme, themeMode } = useAppBootstrap();
  const palette = themeValue.palette;

  return (
    <SafeAreaProvider>
      <ThemeModeContext.Provider value={themeValue}>
        <HistoryContext.Provider value={historyValue}>
          <PaperProvider theme={paperTheme}>
            <NavigationContainer theme={navTheme}>
              <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
              <Stack.Navigator
                initialRouteName="Game"
                screenOptions={{
                  headerStyle: { backgroundColor: palette.sidebar },
                  headerTintColor: palette.fg,
                  headerTitleStyle: { fontWeight: '800' },
                  contentStyle: { backgroundColor: palette.bg },
                }}
              >
                <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Verbo & Hino' }} />
                <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Estatísticas' }} />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </HistoryContext.Provider>
      </ThemeModeContext.Provider>
    </SafeAreaProvider>
  );
}
