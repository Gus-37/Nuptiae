import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { UISettingsProvider } from './src/context/UISettingsContext';

export default function App() {
  return (
    <UISettingsProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UISettingsProvider>
  );
}
