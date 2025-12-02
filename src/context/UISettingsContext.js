import React, { createContext, useContext, useState } from 'react';

const UISettingsContext = createContext(null);

export function UISettingsProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [textSize, setTextSize] = useState('normal');

  const fontScale = textSize === 'normal' ? 1 : textSize === 'large' ? 1.15 : 1.3;

  const colors = theme === 'light'
    ? { bg: '#FFFFFF', text: '#222', card: '#FFFFFF', border: '#f0f0f0', accent: '#ff6b6b', muted: '#666' }
    : { bg: '#121212', text: '#EEEEEE', card: '#1E1E1E', border: '#2A2A2A', accent: '#ff6b6b', muted: '#999' };

  return (
    <UISettingsContext.Provider value={{ theme, setTheme, textSize, setTextSize, fontScale, colors }}>
      {children}
    </UISettingsContext.Provider>
  );
}

export const useUISettings = () => {
  const ctx = useContext(UISettingsContext);
  if (!ctx) throw new Error('useUISettings debe usarse dentro de UISettingsProvider');
  return ctx;
};