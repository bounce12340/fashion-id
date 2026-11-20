import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { useLanguage } from '../../hooks/useLanguage';
import { loadProfile } from '../../hooks/useProfile';
import { runTryOn } from '../../services/fashn';

type Category = 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear';
const CATEGORIES: Category[] = ['Tops', 'Bottoms', 'Dresses', 'Outerwear'];

export default function TryOnScreen() {
  const { t } = useLanguage();
  const [productUrl, setProductUrl] = useState('');
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('Tops');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [modelPhoto, setModelPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadProfile().then((p) => { if (p?.frontPhoto) setModelPhoto(p.frontPhoto); });
  }, []);

  async function pickModelPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t.tryon_permissionNeeded, t.tryon_permissionMsg); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.8, aspect: [3, 4] });
    if (!res.canceled) setModelPhoto(res.assets[0].uri);
  }

  async function pickGarment() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t.tryon_permissionNeeded, t.tryon_permissionMsg); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.8 });
    if (!res.canceled) { setGarmentImage(res.assets[0].uri); setProductUrl(''); }
  }

  async function handleGenerate() {
    if (!modelPhoto) { Alert.alert(t.tryon_noModelPhoto ?? 'Model Photo Required', t.tryon_noModelPhotoMsg ?? 'Please add a photo of yourself to try on clothes.'); return; }
    if (!productUrl && !garmentImage) { Alert.alert(t.tryon_addClothing, t.tryon_addClothingMsg); return; }
    if (!garmentImage && !isHttpsUrl(productUrl)) { Alert.alert(t.tryon_invalidUrl, t.tryon_invalidUrlMsg); return; }
    setLoading(true); setResult(null);
    try {
      const garmentInput = garmentImage ?? productUrl.trim();
      const outputUrl = await runTryOn(modelPhoto, garmentInput, category);
      setResult(outputUrl);
    } catch (err: any) {
      Alert.alert('Try-On Failed', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() { setResult(null); setProductUrl(''); setGarmentImage(null); }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t.tryon_title}</Text>
        <Text style={styles.subtitle}>{t.tryon_subtitle}</Text>

        {result ? (
          <ResultView result={result} onReset={handleReset} t={t} />
        ) : (
          <>
            <Text style={styles.label}>{t.tryon_modelPhoto ?? 'YOUR PHOTO'}</Text>
            <TouchableOpacity style={styles.modelPhotoBtn} onPress={pickModelPhoto}>
              {modelPhoto
                ? <Image source={{ uri: modelPhoto }} style={styles.modelPhotoPreview} resizeMode="cover" />
                : <Text style={styles.uploadBtnText}>{t.tryon_addModelPhoto ?? 'Add a photo of yourself'}</Text>}
            </TouchableOpacity>

            <Text style={styles.label}>{t.tryon_clothingItem}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.urlInput} value={productUrl}
                onChangeText={(v) => { setProductUrl(v); setGarmentImage(null); }}
                placeholder={t.tryon_urlPlaceholder} placeholderTextColor={Colors.medGray}
                autoCapitalize="none" keyboardType="url"
              />
            </View>
            <Text style={styles.orDivider}>{t.tryon_or}</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickGarment}>
              {garmentImage ? <Image source={{ uri: garmentImage }} style={styles.garmentPreview} /> : <Text style={styles.uploadBtnText}>{t.tryon_uploadGarment}</Text>}
            </TouchableOpacity>

            <Text style={styles.label}>{t.tryon_category}</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat} style={[styles.catBtn, category === cat && styles.catBtnActive]} onPress={() => setCategory(cat)}>
                  <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.generateBtn, loading && styles.generateBtnLoading]} onPress={handleGenerate} disabled={loading}>
              {loading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <ActivityIndicator color={Colors.white} />
                  <Text style={styles.generateBtnText}>{t.tryon_generating}</Text>
                </View>
              ) : <Text style={styles.generateBtnText}>{t.tryon_generate}</Text>}
            </TouchableOpacity>

            {loading && <Text style={styles.loadingNote}>{t.tryon_loadingNote}</Text>}

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{t.tryon_howItWorks}</Text>
              <Text style={styles.infoText}>{t.tryon_how1}</Text>
              <Text style={styles.infoText}>{t.tryon_how2}</Text>
              <Text style={styles.infoText}>{t.tryon_how3}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultView({ result, onReset, t }: { result: string; onReset: () => void; t: any }) {
  return (
    <View>
      <Text style={styles.resultLabel}>{t.tryon_result}</Text>
      <Image source={{ uri: result }} style={styles.resultImage} resizeMode="cover" />
      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.resultBtn}><Text style={styles.resultBtnText}>{t.tryon_save}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.resultBtn}><Text style={styles.resultBtnText}>{t.tryon_share}</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.resultBtn, styles.shopBtn]}><Text style={[styles.resultBtnText, { color: Colors.white }]}>{t.tryon_shop}</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.tryAnotherBtn} onPress={onReset}>
        <Text style={styles.tryAnotherText}>{t.tryon_tryAnother}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, paddingBottom: 48 },
  pageTitle: { fontSize: 12, letterSpacing: 4, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.medGray, marginBottom: 28 },
  label: { fontSize: 10, letterSpacing: 3, fontWeight: '700', color: Colors.medGray, marginBottom: 10 },
  inputRow: { marginBottom: 8 },
  urlInput: { borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 4, padding: 14, fontSize: 14, color: Colors.black, backgroundColor: Colors.white },
  orDivider: { textAlign: 'center', color: Colors.medGray, fontSize: 12, marginVertical: 12 },
  uploadBtn: { borderWidth: 1, borderColor: Colors.lightGray, borderStyle: 'dashed', borderRadius: 4, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 28, overflow: 'hidden' },
  uploadBtnText: { color: Colors.medGray, fontSize: 14 },
  garmentPreview: { width: '100%', height: '100%' },
  categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  catBtn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 20, alignItems: 'center' },
  catBtnActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  catBtnText: { fontSize: 11, color: Colors.medGray, fontWeight: '600' },
  catBtnTextActive: { color: Colors.white },
  generateBtn: { backgroundColor: Colors.black, padding: 16, borderRadius: 2, alignItems: 'center', marginBottom: 12 },
  generateBtnLoading: { backgroundColor: Colors.medGray },
  generateBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  loadingNote: { textAlign: 'center', color: Colors.medGray, fontSize: 12, marginBottom: 20 },
  infoBox: { backgroundColor: Colors.white, borderRadius: 8, padding: 16 },
  infoTitle: { fontWeight: '700', fontSize: 13, color: Colors.black, marginBottom: 8 },
  infoText: { fontSize: 13, color: Colors.medGray, lineHeight: 20, marginBottom: 4 },
  resultLabel: { fontSize: 10, letterSpacing: 3, fontWeight: '700', color: Colors.gold, marginBottom: 12 },
  resultImage: { width: '100%', aspectRatio: 0.7, borderRadius: 8, marginBottom: 16 },
  resultActions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  resultBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 4, alignItems: 'center' },
  shopBtn: { backgroundColor: Colors.black, borderColor: Colors.black },
  resultBtnText: { fontSize: 13, fontWeight: '600', color: Colors.black },
  tryAnotherBtn: { padding: 16, alignItems: 'center' },
  tryAnotherText: { color: Colors.medGray, fontSize: 13 },
  modelPhotoBtn: { borderWidth: 1, borderColor: Colors.lightGray, borderStyle: 'dashed', borderRadius: 4, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 28, overflow: 'hidden' },
  modelPhotoPreview: { width: '100%', height: '100%' },
});

/** Only forward full https links to the try-on API (no http/file/data/other schemes). */
function isHttpsUrl(value: string): boolean {
  return /^https:\/\/[^\s/?#]+\.[^\s/?#]+([/?#]\S*)?$/i.test(value.trim());
}
