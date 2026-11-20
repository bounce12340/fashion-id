import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { StyleTag, BodyRatio } from '../../constants/types';
import { useLanguage } from '../../hooks/useLanguage';

const STYLE_TAGS: StyleTag[] = ['Casual', 'Minimalist', 'Bold', 'Romantic', 'Formal', 'Streetwear'];

export default function MeasurementsScreen() {
  const { t } = useLanguage();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [firstName, setFirstName] = useState('');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [height, setHeight] = useState('');
  const [shoulder, setShoulder] = useState('');
  const [armLength, setArmLength] = useState('');
  const [bodyRatio, setBodyRatio] = useState<BodyRatio>('equal');
  const [styleTags, setStyleTags] = useState<StyleTag[]>([]);

  const BODY_RATIOS: { value: BodyRatio; label: string }[] = [
    { value: 'longer_torso', label: t.meas_longerTorso },
    { value: 'equal', label: t.meas_equal },
    { value: 'longer_legs', label: t.meas_longerLegs },
  ];

  function toggleTag(tag: StyleTag) {
    setStyleTags((prev) => prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]);
  }

  function handleNext() {
    router.push({
      pathname: '/(onboarding)/photos',
      params: { firstName, bust, waist, hips, height, shoulder, armLength, bodyRatio, styleTags: styleTags.join(','), unit },
    });
  }

  const canProceed = firstName && bust && waist && hips && height && styleTags.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.step}>{t.meas_step}</Text>
          <Text style={styles.title}>{t.meas_title}</Text>
          <Text style={styles.subtitle}>{t.meas_subtitle}</Text>

          <View style={styles.unitToggle}>
            {(['in', 'cm'] as const).map((u) => (
              <TouchableOpacity key={u} style={[styles.unitBtn, unit === u && styles.unitBtnActive]} onPress={() => setUnit(u)}>
                <Text style={[styles.unitBtnText, unit === u && styles.unitBtnTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <InputField label={t.meas_firstName} value={firstName} onChangeText={setFirstName} placeholder={t.meas_firstNamePlaceholder} keyboardType="default" />
          <InputField label={`${t.meas_bust} (${unit})`} value={bust} onChangeText={setBust} placeholder={unit === 'in' ? 'e.g. 36' : 'e.g. 91'} />
          <InputField label={`${t.meas_waist} (${unit})`} value={waist} onChangeText={setWaist} placeholder={unit === 'in' ? 'e.g. 28' : 'e.g. 71'} />
          <InputField label={`${t.meas_hips} (${unit})`} value={hips} onChangeText={setHips} placeholder={unit === 'in' ? 'e.g. 38' : 'e.g. 96'} />
          <InputField label={`${t.meas_height} (${unit === 'in' ? 'inches' : 'cm'})`} value={height} onChangeText={setHeight} placeholder={unit === 'in' ? 'e.g. 65' : 'e.g. 165'} />
          <InputField label={`${t.meas_shoulder} (${unit}) — ${t.meas_optional}`} value={shoulder} onChangeText={setShoulder} placeholder={unit === 'in' ? 'e.g. 15' : 'e.g. 38'} />
          <InputField label={`${t.meas_armLength} (${unit}) — ${t.meas_optional}`} value={armLength} onChangeText={setArmLength} placeholder={unit === 'in' ? 'e.g. 23' : 'e.g. 58'} />

          <Text style={styles.label}>{t.meas_bodyRatio}</Text>
          <View style={styles.ratioRow}>
            {BODY_RATIOS.map(({ value, label }) => (
              <TouchableOpacity key={value} style={[styles.ratioBtn, bodyRatio === value && styles.ratioBtnActive]} onPress={() => setBodyRatio(value)}>
                <Text style={[styles.ratioBtnText, bodyRatio === value && styles.ratioBtnTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t.meas_styleTags}</Text>
          <View style={styles.tagRow}>
            {STYLE_TAGS.map((tag) => (
              <TouchableOpacity key={tag} style={[styles.tag, styleTags.includes(tag) && styles.tagActive]} onPress={() => toggleTag(tag)}>
                <Text style={[styles.tagText, styleTags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]} onPress={handleNext} disabled={!canProceed}>
            <Text style={styles.nextBtnText}>{t.meas_continue}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputField({ label, value, onChangeText, placeholder, keyboardType = 'decimal-pad' }: {
  label: string; value: string; onChangeText: (v: string) => void; placeholder: string; keyboardType?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={Colors.medGray} keyboardType={keyboardType as any} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 24, paddingBottom: 48 },
  step: { fontSize: 11, letterSpacing: 3, color: Colors.gold, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '300', color: Colors.black, marginBottom: 8 },
  subtitle: { fontSize: 13, color: Colors.medGray, marginBottom: 24, lineHeight: 18 },
  unitToggle: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  unitBtn: { paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 2 },
  unitBtnActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  unitBtnText: { color: Colors.medGray, fontSize: 13, fontWeight: '600' },
  unitBtnTextActive: { color: Colors.white },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 1, color: Colors.medGray, marginBottom: 6, textTransform: 'uppercase' },
  input: { borderBottomWidth: 1, borderColor: Colors.lightGray, paddingVertical: 10, fontSize: 16, color: Colors.black },
  ratioRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  ratioBtn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 2, alignItems: 'center' },
  ratioBtnActive: { borderColor: Colors.black, backgroundColor: Colors.black },
  ratioBtnText: { fontSize: 12, color: Colors.medGray, fontWeight: '600' },
  ratioBtnTextActive: { color: Colors.white },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 20 },
  tagActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  tagText: { fontSize: 13, color: Colors.medGray },
  tagTextActive: { color: Colors.white, fontWeight: '600' },
  nextBtn: { backgroundColor: Colors.black, padding: 16, alignItems: 'center', borderRadius: 2 },
  nextBtnDisabled: { backgroundColor: Colors.lightGray },
  nextBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
});
