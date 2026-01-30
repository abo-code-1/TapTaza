import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  TextInput, 
  StatusBar, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInRight, 
  ZoomIn, 
  FadeIn, 
  LinearTransition 
} from 'react-native-reanimated';
import { CompanyCard } from '../../src/components/companyCard';


const CATEGORIES = ["Все", "Хуйня", "Залупа"];

const ALL_COMPANIES = [
  { id: '1', name: 'CleanMaster', rating: 4.9, price: '6 000 ₸'},
  { id: '2', name: 'EcoCleaning', rating: 4.8, price: '5 500 ₸'},
  { id: '3', name: 'Блеск и Порядок', rating: 4.7,  price: '7 000 ₸' },
  { id: '4', name: 'FastClean', rating: 4.5,  price: '5 000 ₸'},
];

export default function CompaniesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    return ALL_COMPANIES.filter((c) => {
      const matchesFilter = activeFilter === "Все" 
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <View className="flex-1 bg-[#F8F9FD]">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        
        {/* HEADER & SEARCH */}
        <View className="px-6 pb-4 bg-white/80 border-b border-gray-100">
          <View className="flex-row items-center py-4">
            <Pressable onPress={() => router.back()} className="p-2 -ml-2">
              <Ionicons name="chevron-back" size={28} color="black" />
            </Pressable>
            <Text className="text-2xl font-black text-slate-900 ml-2">Компании</Text>
          </View>

          <Animated.View entering={FadeInRight} className="flex-row items-center bg-gray-100 px-4 py-3 rounded-2xl">
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput 
              placeholder="Поиск по названию..."
              className="flex-1 ml-3 font-semibold text-slate-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Animated.View>
        </View>

        {/* FILTERS */}
        <View className="py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {CATEGORIES.map((cat, i) => (
              <Animated.View key={cat} entering={ZoomIn.delay(i * 50)}>
                <Pressable 
                  onPress={() => setActiveFilter(cat)}
                  className={`mr-3 px-5 py-2.5 rounded-full border ${
                    activeFilter === cat ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className={`font-bold ${activeFilter === cat ? 'text-white' : 'text-slate-500'}`}>
                    {cat}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* LIST */}
        <Animated.FlatList
          data={filteredCompanies}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
       
          itemLayoutAnimation={LinearTransition.springify().damping(15)}
          renderItem={({ item, index }) => (
            <CompanyCard 
              company={item} 
              index={index} 
              onPress={() => alert(`Выбрано: ${item.name}`)} 
            />
          )}
          ListEmptyComponent={() => (
            <Animated.View entering={FadeIn} className="items-center mt-20">
              <Text className="text-slate-400 font-bold text-lg">Ничего не найдено</Text>
            </Animated.View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}