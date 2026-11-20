import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import catalog from '../../data/seed-catalog.json';
import { CatalogItem } from '../../constants/types';
import { useLanguage } from '../../hooks/useLanguage';

interface Outfit {
  id: string;
  name: string;
  itemIds: string[];
}

const itemMap: Record<string, CatalogItem> = Object.fromEntries(
  (catalog.items as CatalogItem[]).map((item) => [item.id, item])
);

export default function OutfitsScreen() {
  const { t } = useLanguage();
  const [activeOutfit, setActiveOutfit] = useState<string>(catalog.outfits[0].id);

  const outfit = catalog.outfits.find((o) => o.id === activeOutfit) as Outfit;
  const items = outfit.itemIds.map((id) => itemMap[id]).filter(Boolean);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t.outfits_title}</Text>
        <Text style={styles.subtitle}>{t.outfits_subtitle}</Text>

        {/* Outfit selector tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {catalog.outfits.map((o) => (
            <TouchableOpacity
              key={o.id}
              style={[styles.tab, activeOutfit === o.id && styles.tabActive]}
              onPress={() => setActiveOutfit(o.id)}
            >
              <Text style={[styles.tabText, activeOutfit === o.id && styles.tabTextActive]}>{o.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items grid */}
        <View style={styles.itemsGrid}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total + Shop */}
        <View style={styles.totalBox}>
          <View>
            <Text style={styles.totalLabel}>{t.outfits_completeLook}</Text>
            <Text style={styles.totalPrice}>${total}</Text>
          </View>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => Linking.openURL('https://amazon.com/?tag=fashionid-20')}
          >
            <Text style={styles.shopBtnText}>{t.outfits_shopThisLook}</Text>
          </TouchableOpacity>
        </View>

        {/* Individual shop buttons */}
        <Text style={styles.sectionLabel}>{t.outfits_shopIndividual}</Text>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.shopItemRow}
            onPress={() => Linking.openURL(item.affiliateUrl)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.shopItemThumb} />
            <View style={styles.shopItemInfo}>
              <Text style={styles.shopItemName}>{item.name}</Text>
              <Text style={styles.shopItemBrand}>{item.brand} · ${item.price}</Text>
            </View>
            <Text style={styles.shopItemArrow}>→</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.affiliateNote}>{t.outfits_affiliateNote}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: 20, paddingBottom: 48 },
  pageTitle: { fontSize: 12, letterSpacing: 4, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.medGray, marginBottom: 20 },
  tabScroll: { marginBottom: 20, marginHorizontal: -4 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 20, marginHorizontal: 4 },
  tabActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  tabText: { fontSize: 13, color: Colors.medGray, fontWeight: '600' },
  tabTextActive: { color: Colors.white },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  itemCard: { width: '47%', backgroundColor: Colors.white, borderRadius: 8, overflow: 'hidden' },
  itemImage: { width: '100%', aspectRatio: 1, backgroundColor: Colors.lightGray },
  itemInfo: { padding: 10 },
  itemBrand: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  itemName: { fontSize: 12, color: Colors.black, fontWeight: '500', marginBottom: 4 },
  itemPrice: { fontSize: 13, color: Colors.black, fontWeight: '700' },
  totalBox: { backgroundColor: Colors.black, borderRadius: 8, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  totalLabel: { fontSize: 10, color: Colors.medGray, letterSpacing: 2, marginBottom: 4 },
  totalPrice: { fontSize: 28, fontWeight: '300', color: Colors.white },
  shopBtn: { backgroundColor: Colors.gold, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 4 },
  shopBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  sectionLabel: { fontSize: 10, letterSpacing: 3, fontWeight: '700', color: Colors.medGray, marginBottom: 12 },
  shopItemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 8, marginBottom: 8, padding: 12, gap: 12 },
  shopItemThumb: { width: 50, height: 50, borderRadius: 6, backgroundColor: Colors.lightGray },
  shopItemInfo: { flex: 1 },
  shopItemName: { fontSize: 13, fontWeight: '600', color: Colors.black, marginBottom: 2 },
  shopItemBrand: { fontSize: 12, color: Colors.medGray },
  shopItemArrow: { fontSize: 16, color: Colors.medGray },
  affiliateNote: { fontSize: 11, color: Colors.medGray, textAlign: 'center', marginTop: 12, lineHeight: 16 },
});
