import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const SERVICES = [
  { id: 1, title: "Стандартная уборка", price: "от 6 000 ₸", info: "Поддерживающая чистота", companies: "450 предложений", tag: "Популярно" },
  { id: 2, title: "Генеральная уборка", price: "от 12 000 ₸", info: "Тщательная очистка всех зон", companies: "120 предложений", tag: null },
  { id: 3, title: "После ремонта", price: "от 18 000 ₸", info: "Удаление строительной пыли", companies: "85 предложений", tag: null },
];

export default function HomeScreen() {
  const [selectedId, setSelectedId] = useState(1);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>

        {/* HEADER */}
        <View className="px-5 pt-2 pb-4">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-2xl font-black tracking-tight text-[#212121]">Tap-Taza</Text>

            <View className="flex-row gap-4">

              <View>
                <Ionicons name="notifications-outline" size={24} color="#212121" />
                <View className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
              </View>
            </View>
          </View>



        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* STATS CHIPS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-5 mb-6">
            <View className="bg-[#E8F2FF] px-4 py-2 rounded-full mr-2 border border-[#CFE4FF]">
              <Text className="text-[#005BCC] font-semibold text-xs">120 компаний в Алматы</Text>
            </View>
            <View className="bg-[#F4F5F7] px-4 py-2 rounded-full mr-2 border border-gray-100">
              <Text className="text-gray-600 font-semibold text-xs">2.5K проверенных отзывов</Text>
            </View>
            <View className="bg-[#F4F5F7] px-4 py-2 rounded-full mr-5 border border-gray-100">
              <Text className="text-gray-600 font-semibold text-xs">Гарантия 24ч</Text>
            </View>
          </ScrollView>

          {/* MAIN CONTENT */}
          <View className="px-5">
            <Text className="text-xl font-bold text-[#212121] mb-4">Услуги клининга</Text>

            {SERVICES.map((item, index) => (
              <View
                key={item.id}

              >
                <Pressable
                  onPress={() => setSelectedId(item.id)}
                  className={`p-5 rounded-2xl mb-4 border ${selectedId === item.id
                    ? 'border-[#007BE5] bg-[#F9FBFF]'
                    : 'border-gray-100 bg-white'
                    }`}
                  style={selectedId !== item.id ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 } : {}}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      {item.tag && (
                        <Text className="text-red-500 font-bold text-[10px] uppercase tracking-tighter mb-1">
                          {item.tag}
                        </Text>
                      )}
                      <Text className={`text-xl font-bold ${selectedId === item.id ? 'text-[#007BE5]' : 'text-[#212121]'}`}>
                        {item.title}
                      </Text>
                    </View>
                    <Text className="text-lg font-black text-[#212121]">{item.price}</Text>
                  </View>

                  <Text className="text-gray-500 mb-4 leading-5">{item.info}</Text>

                  <View className="flex-row items-center justify-between pt-4 border-t border-gray-50">
                    <View className="flex-row items-center">
                      <Ionicons name="briefcase-outline" size={14} color="#959595" />
                      <Text className="text-[#959595] text-xs ml-1 font-medium">{item.companies}</Text>
                    </View>
                    <View className={`px-3 py-1.5 rounded-lg ${selectedId === item.id ? 'bg-[#007BE5]' : 'bg-[#F4F5F7]'}`}>
                      <Text className={`font-bold text-xs ${selectedId === item.id ? 'text-white' : 'text-[#212121]'}`}>
                        {selectedId === item.id ? 'Выбрано' : 'Выбрать'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            ))}

            {/* MINI BANNER */}
            <Pressable className="bg-[#212121] rounded-2xl p-6 mt-2 flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-white font-bold text-lg mb-1">После вызова заказа</Text>
                <Text className="text-gray-400 text-xs">Менеджер сам позвонит вам для деталей</Text>
              </View>
              <View className="bg-white/10 p-3 rounded-full">
                <Ionicons name="call" size={24} color="white" />
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* MODERN STICKY FOOTER */}
        <View className="absolute bottom-0  left-0 right-0 bg-white/90 px-5 pb-3 pt-4 border-t border-gray-100">
          <Pressable
            onPress={() => router.push("/companies/page")}
            className="bg-[#007BE5] h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-blue-500/20"
          >
            <Text className="text-white font-bold text-base mr-2">Показать компании</Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );
}