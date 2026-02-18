import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInRight,
  FadeIn,
  LinearTransition
} from 'react-native-reanimated';

import { CompanyCard } from '../../src/components/companyCard';

const CATEGORIES = ["Все", "Квартира", "Офис", "Коттедж"];

const ALL_COMPANIES = [
  { id: '1', name: 'CleanMaster', rating: 4.9, price: '6 000 ₸', verified: true, reviews: 342, responseTime: '< 10 мин' },
  { id: '2', name: 'EcoCleaning', rating: 4.8, price: '5 500 ₸', verified: true, reviews: 218, responseTime: '< 30 мин' },
  { id: '3', name: 'Блеск и Порядок', rating: 4.7, price: '7 000 ₸', verified: false, reviews: 156, responseTime: '1-2 ч' },
  { id: '4', name: 'FastClean', rating: 4.5, price: '5 000 ₸', verified: true, reviews: 89, responseTime: '< 15 мин' },
];

export default function CompaniesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');

  const filteredCompanies = useMemo(() => {
    if (activeFilter !== "Все") return [];

    const filtered = ALL_COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return parseInt(a.price) - parseInt(b.price);
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return 0;
    });
  }, [activeFilter, searchQuery, sortBy]);

  // ИСПРАВЛЕНО: убираем eslint(no-unused-expressions)
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const renderScrollableHeader = () => (
    <View className="pt-2">
      <Animated.View
        entering={FadeInRight.delay(80).duration(400)}
        className="flex-row items-center bg-white px-4 py-3.5 rounded-2xl border border-slate-200 mb-4 shadow-sm"
      >
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          placeholder="Название компаний..."
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-3 text-base font-semibold text-slate-900"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      <View className="pb-3 -mx-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {CATEGORIES.map((cat, i) => (
            <View key={cat}>
              <Pressable
                onPress={() => setActiveFilter(cat)}
                className={`mr-2.5 px-6 py-2.5 rounded-full border ${activeFilter === cat ? 'bg-black border-black' : 'bg-white border-slate-200'
                  }`}
              >
                <Text className={`font-bold text-md ${activeFilter === cat ? 'text-white' : 'text-slate-600'}`}>
                  {cat}
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="pb-3 flex-row items-center">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mr-5">
          {[
            { key: 'rating', label: 'Рейтинг', icon: 'star' },
            { key: 'price', label: 'Цена', icon: 'cash-outline' },
            { key: 'reviews', label: 'Отзывы', icon: 'chatbubbles-outline' },
          ].map((sort) => (
            <Pressable
              key={sort.key}
              onPress={() => setSortBy(sort.key as any)}
              className={`mr-2 px-3 py-1.5 rounded-lg flex-row items-center ${sortBy === sort.key ? 'bg-slate-900' : 'bg-slate-100'}`}
            >
              <Ionicons name={sort.icon as any} size={14} color={sortBy === sort.key ? '#FFF' : '#64748B'} />
              <Text className={`ml-1.5 text-xs font-bold ${sortBy === sort.key ? 'text-white' : 'text-slate-600'}`}>
                {sort.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      {/* ФИКСИРОВАННАЯ ЧАСТЬ (Не скроллится) */}
      <View className="z-50 bg-white border-b border-slate-100 shadow-sm">
        <SafeAreaView edges={['top']}>
          <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                onPress={handleBack}
                className="w-10 h-10 items-center justify-center -ml-2 active:opacity-60 bg-slate-50 rounded-full"
              >
                <Ionicons name="chevron-back" size={24} color="#0F172A" />
              </Pressable>
              <View className="ml-3">
                <Text className="text-xl font-black text-slate-900 tracking-tight">
                  Компании
                </Text>
                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {activeFilter === "Все" ? `${filteredCompanies.length} найдено` : "0 вариантов"}
                </Text>
              </View>
            </View>
            <View className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
              <Ionicons name="options-outline" size={18} color="#0F172A" />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* СКРОЛЛЯЩАЯСЯ ЧАСТЬ */}
      <Animated.FlatList
        data={filteredCompanies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 }}
        itemLayoutAnimation={LinearTransition.duration(350).damping(20).stiffness(90)}
        ListHeaderComponent={renderScrollableHeader}

        ListEmptyComponent={() => (
          <Animated.View entering={FadeIn.duration(400)} className="items-center justify-center mt-20 px-10">
            <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
              <Ionicons
                name={activeFilter !== "Все" ? "construct-outline" : "search-outline"}
                size={36}
                color="#94A3B8"
              />
            </View>
            <Text className="text-slate-900 font-bold text-xl text-center">
              {activeFilter !== "Все" ? "Скоро появится" : "Ничего не найдено"}
            </Text>
            <Text className="text-slate-500 text-sm text-center mt-2">
              {activeFilter !== "Все"
                ? ""
                : "Попробуйте изменить параметры поиска."}
            </Text>
          </Animated.View>
        )}

        renderItem={({ item, index }) => (
          <CompanyCard
            company={item}
            index={index}
            onPress={() => {
              router.push({
                pathname: "/companies/[id]",
                params: { id: item.id, name: item.name, rating: item.rating, price: item.price }
              });
            }}
          />
        )}
      />
    </View>
  );
}