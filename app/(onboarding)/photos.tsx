import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { saveProfile, generateFashionId } from '../../hooks/useProfile';
import { Profile, StyleTag, BodyRatio } from '../../constants/types';
import { useLanguage } from '../../hooks/useLanguage';

type PhotoSlot = 'front' | 'side' | 'back';

export default function PhotosScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams<Record<string, string>>();
  const [photos, setPhotos] = useState<Record<PhotoSlot, string | null>>({ front: null, side: null, back: null });
  const [saving, setSaving] = useState(false);

  async function pickPhoto(slot: PhotoSlot) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.tryon_permissionNeeded, 'Please allow photo access to upload your photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, aspect: [3, 4], quality: 0.8 });
    if (!result.canceled) setPhotos((prev) => ({ ...prev, [slot]: result.assets[0].uri }));
  }

  async function handleCreate() {
    setSaving(true);
    const profile: Profile = {
      fashionId: generateFashionId(),
      firstName: params.firstName || 'Fashion Fan',
      bust: parseFloat(params.bust), waist: parseFloat(params.waist),
      hips: parseFloat(params.hips), height: parseFloat(params.height),
      weight: params.weight ? parseFloat(params.weight) : undefined,
      shoulderWidth: params.shoulder ? parseFloat(params.shoulder) : undefined,
      armLength: params.armLength ? parseFloat(params.armLength) : undefined,
      bodyRatio: (params.bodyRatio as BodyRatio) || 'equal',
      styleTags: params.styleTags ? (params.styleTags.split(',') as StyleTag[]) : [],
      unit: (params.unit as 'in' | 'cm') || 'in',
      frontPhoto: photos.front || undefined,
      sidePhoto: photos.side || undefined,
      backPhoto: photos.back || undefined,
    };
    await saveProfile(profile);
    setSaving(false);
    router.replace({ pathname: '/(onboarding)/created', params: { fashionId: profile.fashionId, firstName: profile.firstName } });
  }

  const SLOT_LABELS: Record<PhotoSlot, string> = { front: 'FRONT', side: 'SIDE', back: 'BACK' };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.step}>{t.photos_step}</Text>
        <Text style={styles.title}>{t.photos_title}</Text>
        <Text style={styles.subtitle}>{t.photos_subtitle}</Text>

        <View style={styles.photoRow}>
          {(['front', 'side', 'back'] as PhotoSlot[]).map((slot) => (
            <TouchableOpacity key={slot} style={styles.photoSlot} onPress={() => pickPhoto(slot)}>
              {photos[slot] ? (
                <Image source={{ uri: photos[slot]! }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoIcon}>+</Text>
                  <Text style={styles.photoLabel}>{SLOT_LABELS[slot]}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>{t.photos_guideTitle}</Text>
          <Text style={styles.guideText}>{t.photos_guide1}</Text>
          <Text style={styles.guideText}>{t.photos_guide2}</Text>
          <Text style={styles.guideText}>{t.photos_guide3}</Text>
        </View>

        <TouchableOpacity style={[styles.createBtn, saving && styles.createBtnDisabled]} onPress={handleCreate} disabled={saving}>
          <Text style={styles.createBtnText}>{saving ? t.photos_creating : t.photos_create}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleCreate}>
          <Text style={styles.skipBtnText}>{t.photos_skip}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  container: { flex: 1, padding: 24 },
  step: { fontSize: 11, letterSpacing: 3, color: Colors.gold, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '300', color: Colors.black, marginBottom: 8 },
  subtitle: { fontSize: 13, color: Colors.medGray, marginBottom: 32, lineHeight: 18 },
  photoRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  photoSlot: { flex: 1, aspectRatio: 3 / 4, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 4, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
  photoIcon: { fontSize: 28, color: Colors.lightGray, fontWeight: '300' },
  photoLabel: { fontSize: 11, color: Colors.medGray, marginTop: 4, fontWeight: '600', letterSpacing: 1 },
  guideBox: { backgroundColor: Colors.white, padding: 16, borderRadius: 4, marginBottom: 32 },
  guideTitle: { fontSize: 13, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  guideText: { fontSize: 13, color: Colors.medGray, lineHeight: 20 },
  createBtn: { backgroundColor: Colors.black, padding: 16, alignItems: 'center', borderRadius: 2 },
  createBtnDisabled: { backgroundColor: Colors.medGray },
  createBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  skipBtn: { padding: 16, alignItems: 'center', marginTop: 4 },
  skipBtnText: { color: Colors.medGray, fontSize: 13 },
});
