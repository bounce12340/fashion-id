import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useLanguage } from '../../hooks/useLanguage';

export default function TabsLayout() {
  const { t } = useLanguage();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightGray,
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 28,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.medGray,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 1 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tab_myId, tabBarIcon: ({ color }) => <TabIcon emoji="✦" color={color} /> }} />
      <Tabs.Screen name="tryon" options={{ title: t.tab_tryOn, tabBarIcon: ({ color }) => <TabIcon emoji="👗" color={color} /> }} />
      <Tabs.Screen name="size-check" options={{ title: t.tab_size, tabBarIcon: ({ color }) => <TabIcon emoji="📏" color={color} /> }} />
      <Tabs.Screen name="outfits" options={{ title: t.tab_outfits, tabBarIcon: ({ color }) => <TabIcon emoji="✨" color={color} /> }} />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 18, opacity: color === Colors.black ? 1 : 0.4 }}>{emoji}</Text>;
}
