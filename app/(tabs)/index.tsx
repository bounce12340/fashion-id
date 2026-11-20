import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { loadProfile } from '../../hooks/useProfile';
import { useLanguage } from '../../hooks/useLanguage';
import { Profile } from '../../constants/types';

export default function HomeScreen() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => { loadProfile().then(setProfile); }, []);

  if (!profile) return null;

  const fmt = (n: number | undefined) => n ? `${n}${profile.unit}` : '—';
  const photoCount = [profile.frontPhoto, profile.sidePhoto, profile.backPhoto].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {profile.firstName}</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardBrand}>FASHION ID</Text>
          <View style={styles.cardBody}>
            <View style={styles.silhouette}>
              <Text style={styles.silhouetteEmoji}>👤</Text>
            </View>
            <View style={styles.cardStats}>
              <StatRow label={t.meas_bust} value={fmt(profile.bust)} />
              <StatRow label={t.meas_waist} value={fmt(profile.waist)} />
              <StatRow label={t.meas_hips} value={fmt(profile.hips)} />
              <StatRow label={t.meas_height} value={fmt(profile.height)} />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardId}>{profile.fashionId}</Text>
            <View style={styles.tagRow}>
              {profile.styleTags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.chip}>
                  <Text style={styles.chipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.home_quickActions}</Text>
        <View style={styles.actionsGrid}>
          <QuickAction emoji="👗" label={t.home_tryOnLook} onPress={() => router.push('/(tabs)/tryon')} />
          <QuickAction emoji="📏" label={t.home_checkSize} onPress={() => router.push('/(tabs)/size-check')} />
          <QuickAction emoji="✨" label={t.home_outfitIdeas} onPress={() => router.push('/(tabs)/outfits')} />
          <QuickAction emoji="📤" label={t.home_shareId} onPress={() => {}} />
        </View>

        <Text style={styles.sectionTitle}>{t.home_bodyProfile}</Text>
        <View style={styles.profileBox}>
          <ProfileRow label={t.home_bodyRatio} value={profile.bodyRatio.replace('_', ' ')} />
          <ProfileRow label={t.home_unit} value={profile.unit === 'in' ? 'Imperial (inches)' : 'Metric (cm)'} />
          {profile.shoulderWidth ? <ProfileRow label={t.home_shoulderWidth} value={fmt(profile.shoulderWidth)} /> : null}
          {profile.armLength ? <ProfileRow label={t.home_armLength} value={fmt(profile.armLength)} /> : null}
          <ProfileRow label={t.home_photos} value={t.home_uploaded.replace('{n}', String(photoCount))} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

function QuickAction({ emoji, label, onPress }: { emoji: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: '300', color: Colors.black },
  settingsIcon: { fontSize: 20, color: Colors.medGray },
  card: { backgroundColor: Colors.black, borderRadius: 12, padding: 24, marginBottom: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  cardBrand: { color: Colors.gold, fontSize: 10, letterSpacing: 4, fontWeight: '700', marginBottom: 20 },
  cardBody: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  silhouette: { width: 70, height: 90, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  silhouetteEmoji: { fontSize: 36 },
  cardStats: { flex: 1, justifyContent: 'space-around' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: Colors.medGray, fontSize: 12 },
  statValue: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 },
  cardId: { color: Colors.white, fontSize: 18, fontWeight: '600', letterSpacing: 3, marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(201,168,76,0.2)' },
  chipText: { color: Colors.gold, fontSize: 11, fontWeight: '600' },
  sectionTitle: { fontSize: 11, letterSpacing: 3, fontWeight: '700', color: Colors.medGray, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  actionBtn: { width: '47%', backgroundColor: Colors.white, borderRadius: 8, padding: 16, alignItems: 'center', gap: 8 },
  actionEmoji: { fontSize: 24 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: Colors.black, textAlign: 'center' },
  profileBox: { backgroundColor: Colors.white, borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  profileLabel: { fontSize: 13, color: Colors.medGray },
  profileValue: { fontSize: 13, fontWeight: '600', color: Colors.black, textTransform: 'capitalize' },
});
