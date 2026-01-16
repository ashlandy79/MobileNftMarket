import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Alibaba': require('../assets/fonts/Alibaba.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // 即使加载失败也设为true，避免阻塞应用
      }
    };

    loadFonts();
  }, []);

  return { fontsLoaded };
};