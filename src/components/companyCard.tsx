import React from 'react';
import { View, Text, Pressable } from 'react-native';
// ИСПОЛЬЗУЕМ LinearTransition для живой перестановки
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const CompanyCard = ({ company, index, onPress }: any) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).springify()}
      // ТЕПЕРЬ МАГИЯ ТУТ: карточка сама знает, как ей двигаться при фильтрации
      layout={LinearTransition.springify().damping(15)} 
    >
      <Pressable 
        onPress={onPress}
        className="bg-white rounded-[32px] p-5 mb-4 flex-row items-center border border-gray-50 active:scale-95 shadow-sm"
        style={{ elevation: 3 }}
      >
        <LinearGradient
          colors={['#F0F7FF', '#E0F2FE']}
          className="w-16 h-16 rounded-[22px] items-center justify-center"
        >
          <MaterialCommunityIcons name="shield-check-outline" size={32} color="#2563EB" />
        </LinearGradient>

        <View className="flex-1 ml-4">
          <Text className="text-lg font-black text-slate-900 leading-tight">{company.name}</Text>
          <View className="flex-row items-center mt-1">
            <View className="bg-amber-50 px-2 py-0.5 rounded-lg flex-row items-center">
              <Ionicons name="star" size={14} color="#D97706" />
              <Text className="text-amber-700 font-bold ml-1 text-xs">{company.rating}</Text>
            </View>
            
          </View>
        </View>

        <View className="items-end">
          <Text className="text-blue-600 font-black text-lg">{company.price}</Text>
          <View className="bg-blue-50 p-1 rounded-full mt-1">
            <Ionicons name="chevron-forward" size={16} color="#2563EB" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};