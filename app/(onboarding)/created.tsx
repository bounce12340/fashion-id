import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { Colors } from '../../constants/Colors';
import { useLanguage } from '../../hooks/useLanguage';

export default function CreatedScreen() {
  const { t } = useLanguage();
  const { fashionId, firstName } = useLocalSearchParams<{ fashionId: string; firstName: string }>();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.congrats}>{t.created_congrats.replace('{name}', firstName || 'Fashion Fan')}</Text>
        <Text style={styles.title}>{t.created_title}</Text>

        <Animated.View style={[styles.idCard, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <Text style={styles.cardBrand}>FASHION ID</Text>
          <View style={styles.silhouette}>
            <Text style={styles.silhouetteEmoji}>👤</Text>
          </View>
          <Text style={styles.cardId}>{fashionId}</Text>
          <Text style={styles.cardSub}>{t.created_sub}</Text>
        </Animated.View>

        <Text style={styles.description}>{t.created_description}</Text>

        <TouchableOpacity style={styles.startBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.startBtnText}>{t.created_start}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  container: { flex: 1, padding: 28, alignItems: 'center', justifyContent: 'center' },
  congrats: { fontSize: 14, color: Colors.gold, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '300', color: Colors.black, textAlign: 'center', lineHeight: 40, marginBottom: 40 },
  idCard: { width: 280, backgroundColor: Colors.black, borderRadius: 12, padding: 28, alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16 },
  cardBrand: { color: Colors.gold, fontSize: 11, letterSpacing: 4, fontWeight: '700', marginBottom: 24 },
  silhouette: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  silhouetteEmoji: { fontSize: 40 },
  cardId: { color: Colors.white, fontSize: 22, fontWeight: '600', letterSpacing: 3, marginBottom: 8 },
  cardSub: { color: Colors.medGray, fontSize: 11, letterSpacing: 2 },
  description: { fontSize: 14, color: Colors.medGray, textAlign: 'center', lineHeight: 22, marginBottom: 40, paddingHorizontal: 8 },
  startBtn: { backgroundColor: Colors.gold, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 2 },
  startBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
});
