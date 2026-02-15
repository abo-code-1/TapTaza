import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Company {
  id: string;
  name: string;
  rating: number;
  price: string;
  verified?: boolean;
  reviews?: number;
  responseTime?: string;
}

interface CompanyCardProps {
  company: Company;
  index: number;
  onPress: () => void;
}

export const CompanyCard = ({ company, index, onPress }: CompanyCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 35).duration(400).damping(20).stiffness(90)}
      layout={LinearTransition.springify().damping(18).stiffness(100)}
    >
      <Pressable
        onPress={onPress}
        className="bg-white rounded-3xl mb-3 border border-slate-200 overflow-hidden active:scale-[0.98]"
        style={{
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Card Content */}
        <View className="p-5">
          {/* Header Row */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-2">
                <Text className="text-lg font-black text-slate-900 leading-tight flex-1">
                  {company.name}
                </Text>
                {company.verified && (
                  <View className="ml-2 bg-blue-100 px-2 py-1 rounded-lg">
                    <Ionicons name="checkmark-circle" size={16} color="#2563EB" />
                  </View>
                )}
              </View>

              {/* Rating & Reviews */}
              <View className="flex-row items-center">
                <View className="bg-amber-50 px-2.5 py-1 rounded-lg flex-row items-center mr-2">
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text className="text-amber-800 font-extrabold ml-1 text-sm">
                    {company.rating}
                  </Text>
                </View>

                {company.reviews && (
                  <Text className="text-slate-500 font-semibold text-xs">
                    {company.reviews} отзывов
                  </Text>
                )}
              </View>
            </View>

            {/* Logo/Icon */}
            <LinearGradient
              colors={['#EFF6FF', '#DBEAFE']}
              className="w-14 h-14 rounded-2xl items-center justify-center"
            >
              <Ionicons name="business" size={26} color="#2563EB" />
            </LinearGradient>
          </View>

          {/* Response Time Tag */}
          {company.responseTime && (
            <View className="mb-3">
              <View className="self-start bg-emerald-50 px-3 py-1.5 rounded-lg flex-row items-center">
                <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                <Text className="text-emerald-700 font-bold text-xs">
                  Ответ {company.responseTime}
                </Text>
              </View>
            </View>
          )}

          {/* Divider */}
          <View className="h-px bg-slate-100 my-3" />

          {/* Bottom Row - Price & CTA */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-slate-500 font-bold text-xs mb-1">
                От
              </Text>
              <Text className="text-blue-600 font-black text-xl tracking-tight">
                {company.price}
              </Text>
            </View>

            <View className="bg-blue-600 px-5 py-3 rounded-2xl flex-row items-center shadow-lg shadow-blue-600/25">
              <Text className="text-white font-extrabold text-sm mr-2">
                Открыть
              </Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </View>
          </View>
        </View>

        {/* Premium Badge (if premium) */}
        {company.verified && (
          <View className="absolute top-0 right-0">
            <View className="bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-1 rounded-bl-xl rounded-tr-3xl">
              <Text className="text-white font-black text-[10px] uppercase tracking-wider">
                Premium
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};