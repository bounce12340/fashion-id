import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { loadProfile, clearProfile } from '../hooks/useProfile';
import { Profile } from '../constants/types';
import { useLanguage } from '../hooks/useLanguage';
import { Language, LANGUAGE_NAMES } from '../constants/translations';

export default function SettingsScreen() {
  const { t, language, setLanguage } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => { loadProfile().then(setProfile); }, []);

  function handleDeleteAccount() {
    Alert.alert(t.settings_deleteTitle, t.settings_deleteMessage, [
      { text: t.settings_deleteCancel, style: 'cancel' },
      {
        text: t.settings_deleteConfirm,
        style: 'destructive',
        onPress: async () => {
          await clearProfile();
          router.replace('/(onboarding)/welcome');
        },
      },
    ]);
  }

  function handleLanguage() {
    const options = (Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => ({
      text: LANGUAGE_NAMES[lang],
      onPress: () => setLanguage(lang),
    }));
    Alert.alert(t.settings_selectLanguage, undefined, [
      ...options,
      { text: t.settings_deleteCancel, style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {profile && (
          <View style={styles.idBadge}>
            <Text style={styles.idLabel}>{t.settings_yourFashionId}</Text>
            <Text style={styles.idCode}>{profile.fashionId}</Text>
            <TouchableOpacity onPress={() => Alert.alert(t.settings_copied, `Fashion ID: ${profile.fashionId}`)}>
              <Text style={styles.copyBtn}>{t.settings_copyId}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionLabel}>{t.settings_account}</Text>
        <View style={styles.section}>
          <SettingsRow label={t.settings_editMeasurements} onPress={() => router.push('/(onboarding)/measurements')} />
          <SettingsRow label={t.settings_managePhotos} onPress={() => Alert.alert(t.settings_comingSoon, t.settings_comingSoonMsg)} />
          <SettingsRow label={t.settings_exportData} onPress={() => Alert.alert(t.settings_export, t.settings_exportMsg)} />
        </View>

        <Text style={styles.sectionLabel}>{t.settings_preferences}</Text>
        <View style={styles.section}>
          <SettingsRow label={t.settings_measurementUnits} value={profile?.unit === 'in' ? 'Imperial (inches)' : 'Metric (cm)'} onPress={() => {}} />
          <SettingsRow label={t.settings_language} value={LANGUAGE_NAMES[language]} onPress={handleLanguage} />
          <SettingsRow label={t.settings_notifications} onPress={() => {}} />
        </View>

        <Text style={styles.sectionLabel}>{t.settings_about}</Text>
        <View style={styles.section}>
          <SettingsRow label={t.settings_privacy} onPress={() => {}} />
          <SettingsRow label={t.settings_terms} onPress={() => {}} />
          <SettingsRow label={t.settings_version} value="0.1.0 (Prototype)" onPress={() => {}} />
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={styles.deleteBtnText}>{t.settings_deleteAccount}</Text>
        </TouchableOpacity>

        <Text style={styles.ccpaNote}>{t.settings_ccpa}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({ label, value, onPress }: { label: string; value?: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Text style={styles.rowArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, paddingBottom: 48 },
  idBadge: { backgroundColor: Colors.black, borderRadius: 8, padding: 20, marginBottom: 28, alignItems: 'center' },
  idLabel: { fontSize: 10, letterSpacing: 3, color: Colors.gold, fontWeight: '700', marginBottom: 8 },
  idCode: { fontSize: 22, fontWeight: '600', color: Colors.white, letterSpacing: 3, marginBottom: 12 },
  copyBtn: { color: Colors.medGray, fontSize: 13 },
  sectionLabel: { fontSize: 10, letterSpacing: 3, fontWeight: '700', color: Colors.medGray, marginBottom: 8 },
  section: { backgroundColor: Colors.white, borderRadius: 8, overflow: 'hidden', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  rowLabel: { fontSize: 14, color: Colors.black },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowValue: { fontSize: 13, color: Colors.medGray },
  rowArrow: { fontSize: 18, color: Colors.medGray },
  deleteBtn: { borderWidth: 1, borderColor: Colors.error, borderRadius: 4, padding: 14, alignItems: 'center', marginBottom: 16 },
  deleteBtnText: { color: Colors.error, fontSize: 14, fontWeight: '600' },
  ccpaNote: { fontSize: 11, color: Colors.medGray, lineHeight: 16, textAlign: 'center' },
});
