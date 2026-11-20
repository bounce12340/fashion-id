import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../hooks/useLanguage';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { t } = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Image source={{ uri: 'https://picsum.photos/seed/fashion-hero/600/800' }} style={styles.heroImage} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.content}>
        <Text style={styles.brand}>FASHION ID</Text>
        <Text style={styles.tagline}>{t.welcome_tagline}</Text>
        <Text style={styles.subtitle}>{t.welcome_subtitle}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(onboarding)/measurements')}>
          <Text style={styles.buttonText}>{t.welcome_button}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  hero: { height: height * 0.5, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,26,26,0.3)' },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 32, paddingBottom: 16, justifyContent: 'space-between' },
  brand: { fontSize: 12, fontWeight: '700', letterSpacing: 4, color: Colors.gold },
  tagline: { fontSize: 32, fontWeight: '300', color: Colors.black, lineHeight: 40, marginTop: 8 },
  subtitle: { fontSize: 15, color: Colors.medGray, lineHeight: 22, marginTop: 8 },
  button: { backgroundColor: Colors.black, borderRadius: 2, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: Colors.white, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
});
