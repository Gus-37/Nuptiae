import React from 'react';
import { Text } from 'react-native';
import { useUISettings } from '../context/UISettingsContext';

export function ThemedText({ style, muted, ...props }) {
  const { colors } = useUISettings();
  const color = muted ? colors.muted : colors.text;
  
  return <Text style={[{ color }, style]} {...props} />;
}
