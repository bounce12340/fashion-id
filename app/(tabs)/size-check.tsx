import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { loadProfile } from '../../hooks/useProfile';
import { useLanguage } from '../../hooks/useLanguage';
import { Profile } from '../../constants/types';

type SizeKey = 'XS' | 'S' | 'M' | 'L' | 'XL';
interface SizeChart { [size: string]: { bustMin?: number; bustMax?: number; waistMin?: number; waistMax?: number; hipsMin?: number; hipsMax?: number } }

const DEFAULT_CHART: SizeChart = {
  XS: { bustMin: 32, bustMax: 33, waistMin: 24, waistMax: 25, hipsMin: 34, hipsMax: 35 },
  S:  { bustMin: 34, bustMax: 35, waistMin: 26, waistMax: 27, hipsMin: 36, hipsMax: 37 },
  M:  { bustMin: 36, bustMax: 37, waistMin: 28, waistMax: 29, hipsMin: 38, hipsMax: 39 },
  L:  { bustMin: 38, bustMax: 40, waistMin: 30, waistMax: 32, hipsMin: 40, hipsMax: 42 },
  XL: { bustMin: 41, bustMax: 43, waistMin: 33, waistMax: 35, hipsMin: 43, hipsMax: 45 },
};

function recommendSize(profile: Profile, chart: SizeChart): { size: string; notes: string[] } {
  const bust  = profile.unit === 'cm' ? profile.bust  / 2.54 : profile.bust;
  const waist = profile.unit === 'cm' ? profile.waist / 2.54 : profile.waist;
  const hips  = profile.unit === 'cm' ? profile.hips  / 2.54 : profile.hips;
  const scores: Record<string, number> = {};
  for (const [size, r] of Object.entries(chart)) {
    let s = 0;
    if (r.bustMin !== undefined  && r.bustMax !== undefined)  s += bust  >= r.bustMin  && bust  <= r.bustMax  ? 3 : -(bust  < r.bustMin  ? r.bustMin  - bust  : bust  - r.bustMax);
    if (r.waistMin !== undefined && r.waistMax !== undefined) s += waist >= r.waistMin && waist <= r.waistMax ? 3 : -(waist < r.waistMin ? r.waistMin - waist : waist - r.waistMax);
    if (r.hipsMin !== undefined  && r.hipsMax !== undefined)  s += hips  >= r.hipsMin  && hips  <= r.hipsMax  ? 3 : -(hips  < r.hipsMin  ? r.hipsMin  - hips  : hips  - r.hipsMax);
    scores[size] = s;
  }
  const best = Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
  const bRange = chart[best];
  const notes: string[] = [];
  if (bRange?.bustMin && bRange?.bustMax) {
    notes.push(bust > bRange.bustMax
      ? `Your bust (${bust.toFixed(1)}") is at the top of ${best} — consider going up if you prefer more room`
      : `Your bust (${bust.toFixed(1)}") fits ${best} range (${bRange.bustMin}–${bRange.bustMax}")`);
  }
  return { size: best, notes };
}

export default function SizeCheckScreen() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ size: string; notes: string[] } | null>(null);

  useEffect(() => { loadProfile().then(setProfile); }, []);

  async function handleCheck() {
    if (!profile) return;
    setChecking(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResult(recommendSize(profile, DEFAULT_CHART));
    setChecking(false);
  }

  const sizes = Object.keys(DEFAULT_CHART) as SizeKey[];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t.size_title}</Text>
        <Text style={styles.subtitle}>{t.size_subtitle}</Text>

        <Text style={styles.label}>{t.size_chart}</Text>
        <View style={styles.chartTable}>
          <View style={styles.chartRow}>
            <Text style={[styles.chartCell, styles.chartHeader]}>{t.size_sizeHeader}</Text>
            <Text style={[styles.chartCell, styles.chartHeader]}>{t.size_bustHeader}</Text>
            <Text style={[styles.chartCell, styles.chartHeader]}>{t.size_waistHeader}</Text>
            <Text style={[styles.chartCell, styles.chartHeader]}>{t.size_hipsHeader}</Text>
          </View>
          {sizes.map((size) => (
            <View key={size} style={styles.chartRow}>
              <Text style={[styles.chartCell, styles.chartSizeLabel]}>{size}</Text>
              <Text style={styles.chartCell}>{DEFAULT_CHART[size].bustMin}–{DEFAULT_CHART[size].bustMax}"</Text>
              <Text style={styles.chartCell}>{DEFAULT_CHART[size].waistMin}–{DEFAULT_CHART[size].waistMax}"</Text>
              <Text style={styles.chartCell}>{DEFAULT_CHART[size].hipsMin}–{DEFAULT_CHART[size].hipsMax}"</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.checkBtn, checking && styles.checkBtnLoading]} onPress={handleCheck} disabled={checking || !profile}>
          {checking ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.checkBtnText}>{t.size_findMySize}</Text>}
        </TouchableOpacity>

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>{t.size_recommendedSize}</Text>
            <Text style={styles.resultSize}>{result.size}</Text>
            {result.notes.map((note, i) => <Text key={i} style={styles.resultNote}>• {note}</Text>)}
            {profile && (
              <View style={styles.fitBars}>
                <FitBar label={t.size_bustHeader} value={profile.bust} unit={profile.unit} min={DEFAULT_CHART[result.size]?.bustMin} max={DEFAULT_CHART[result.size]?.bustMax} />
                <FitBar label={t.size_waistHeader} value={profile.waist} unit={profile.unit} min={DEFAULT_CHART[result.size]?.waistMin} max={DEFAULT_CHART[result.size]?.waistMax} />
                <FitBar label={t.size_hipsHeader} value={profile.hips} unit={profile.unit} min={DEFAULT_CHART[result.size]?.hipsMin} max={DEFAULT_CHART[result.size]?.hipsMax} />
              </View>
            )}
          </View>
        )}

        {profile && (
          <View style={styles.yourMeasurements}>
            <Text style={styles.label}>{t.size_yourMeasurements}</Text>
            <View style={styles.measRow}>
              <MeasChip label={t.size_bustHeader} value={`${profile.bust}${profile.unit}`} />
              <MeasChip label={t.size_waistHeader} value={`${profile.waist}${profile.unit}`} />
              <MeasChip label={t.size_hipsHeader} value={`${profile.hips}${profile.unit}`} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FitBar({ label, value, unit, min, max }: { label: string; value: number; unit: string; min?: number; max?: number }) {
  if (!min || !max) return null;
  const valIn = unit === 'cm' ? value / 2.54 : value;
  const pct = Math.max(0, Math.min(1, (valIn - min) / (max - min)));
  const inRange = valIn >= min && valIn <= max;
  return (
    <View style={fitStyles.row}>
      <Text style={fitStyles.label}>{label}</Text>
      <View style={fitStyles.bar}>
        <View style={[fitStyles.fill, { width: `${pct * 100}%` as any, backgroundColor: inRange ? Colors.gold : Colors.error }]} />
      </View>
      <Text style={fitStyles.value}>{value}{unit}</Text>
    </View>
  );
}

const fitStyles = StyleSheet.create({
  row: { marginBottom: 10 },
  label: { fontSize: 12, color: Colors.medGray, marginBottom: 4 },
  bar: { height: 6, backgroundColor: Colors.lightGray, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  value: { fontSize: 11, color: Colors.medGray, marginTop: 2, textAlign: 'right' },
});

function MeasChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={measStyles.chip}>
      <Text style={measStyles.label}>{label}</Text>
      <Text style={measStyles.value}>{value}</Text>
    </View>
  );
}

const measStyles = StyleSheet.create({
  chip: { flex: 1, backgroundColor: Colors.white, borderRadius: 8, padding: 12, alignItems: 'center' },
  label: { fontSize: 10, color: Colors.medGray, letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 15, fontWeight: '600', color: Colors.black },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, paddingBottom: 48 },
  pageTitle: { fontSize: 12, letterSpacing: 4, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.medGray, marginBottom: 28 },
  label: { fontSize: 10, letterSpacing: 2, fontWeight: '700', color: Colors.medGray, marginBottom: 10 },
  chartTable: { backgroundColor: Colors.white, borderRadius: 8, overflow: 'hidden', marginBottom: 20 },
  chartRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  chartCell: { flex: 1, padding: 10, fontSize: 12, color: Colors.black, textAlign: 'center' },
  chartHeader: { fontWeight: '700', color: Colors.medGray, fontSize: 10, backgroundColor: Colors.lightGray },
  chartSizeLabel: { fontWeight: '700', color: Colors.gold },
  checkBtn: { backgroundColor: Colors.black, padding: 16, borderRadius: 2, alignItems: 'center', marginBottom: 20 },
  checkBtnLoading: { backgroundColor: Colors.medGray },
  checkBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  resultBox: { backgroundColor: Colors.white, borderRadius: 8, padding: 20, marginBottom: 20 },
  resultLabel: { fontSize: 10, letterSpacing: 3, fontWeight: '700', color: Colors.gold, marginBottom: 8 },
  resultSize: { fontSize: 48, fontWeight: '300', color: Colors.black, marginBottom: 8 },
  resultNote: { fontSize: 13, color: Colors.medGray, lineHeight: 20, marginBottom: 4 },
  fitBars: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.lightGray },
  yourMeasurements: { marginTop: 8 },
  measRow: { flexDirection: 'row', gap: 8 },
});
