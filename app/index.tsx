import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { loadProfile } from '../hooks/useProfile';
import { Colors } from '../constants/Colors';

export default function Index() {
  useEffect(() => {
    loadProfile().then((profile) => {
      if (profile) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/welcome');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.ivory }}>
      <ActivityIndicator color={Colors.gold} />
    </View>
  );
}
