import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { UISettingsProvider } from './src/context/UISettingsContext';
import { LanguageProvider } from "./src/context/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <UISettingsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </UISettingsProvider>
    </LanguageProvider>
  );
}
