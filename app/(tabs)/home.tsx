import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Pressable } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context'; 
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { ServiceCard } from '../../src/components/ServiceCard';

const SERVICES = [
  { id: 1, title: "Стандарт", subtitle: "Поддерживающая уборка", price: "от 6000₸", badge: "Топ", icon: "broom", colors: ['#3b82f6', '#2563eb'] },
  { id: 2, title: "Генеральная", subtitle: "Полная дезинфекция", price: "от 12000₸", badge: "Выгодно", icon: "creation", colors: ['#8b5cf6', '#7c3aed'] },
  { id: 3, title: "После ремонта", subtitle: "Удаление строительной пыли", price: "от 18000₸", badge: null, icon: "hammer-wrench", colors: ['#f59e0b', '#d97706'] },
];

export default function HomeScreen() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <View className="flex-1 bg-[#F8F9FD]">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        
        <Animated.View entering={FadeInRight} className="px-6 py-4 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest">📍 Almaty, Kazakhstan</Text>
            <Text className="text-3xl font-black text-slate-900 "> Tap-Taza ✨</Text>
          </View>
          <Pressable className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 active:scale-90">
            <Ionicons name="notifications-outline" size={24} color="black" />
          </Pressable>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 160 }}>
          {SERVICES.map((item, index) => (
            <ServiceCard 
              key={item.id}
              item={item}
              index={index}
              active={selectedId === item.id}
              onPress={() => setSelectedId(item.id)}
            />
          ))}
        </ScrollView>

        <View className="absolute bottom-4 left-6 right-6">
          <Pressable 
            onPress={() => router.push("/companies/page")}
            className="bg-slate-900 h-18 rounded-[28px] items-center justify-center shadow-2xl shadow-black active:scale-95"
            style={{ height: 60 }}
          >
            <Text className="text-white font-black text-xl">Выбрать компанию</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}