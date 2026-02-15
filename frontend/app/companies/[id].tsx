import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '../../src/store/authStore';
import { useBookingStore } from '../../src/store/bookingStore';

export default function CompanyDetailScreen() {
  const { id, name, rating, price } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const { isAuthenticated } = useAuthStore();
  const { setCompany } = useBookingStore();

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const handleOrderPress = () => {
    // Set company in booking store
    setCompany({
      id: parseInt(String(id || '1'), 10),
      name: String(name || 'CleanMaster'),
      rating: parseFloat(String(rating) || '4.9'),
      reviewCount: 234,
      priceRange: String(price || 'от 5 000 ₸'),
      verified: true,
      minPrice: 5000,
    });

    if (isAuthenticated) {
      // User is logged in, go directly to booking
      router.push('/booking/date');
    } else {
      // User not logged in, redirect to auth with return URL
      router.push('/(auth)/phone?redirect=/booking/date');
    }
  };

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [80, 150], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, [80, 150], [-10, 0], Extrapolation.CLAMP) }]
  }));

  return (
    <View className="flex-1 bg-[#F8FAFC]">

      <Animated.View
        style={[{ paddingTop: insets.top }, headerStyle]}
        className="absolute left-0 right-0 z-10 bg-white h-[100px] items-center justify-center border-b border-[#F1F5F9]"
      >
        <Text className="text-[18px] font-bold text-[#1E293B] mt-[10px]" numberOfLines={1}>{name}</Text>
      </Animated.View>


      <Pressable
        onPress={() => router.back()}
        style={{ top: insets.top + 5 }}
        className="absolute left-5 z-20 w-[38px] h-[38px] rounded-full bg-white items-center justify-center shadow-lg"
      >
        <Ionicons name="arrow-back" size={22} color="#1E293B" />
      </Pressable>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >

        <View className="bg-white px-6 pt-[100px] pb-8 rounded-bl-[40px] rounded-br-[40px]">
          <View className="flex-row justify-between items-start mb-5">
            <View className="w-[72px] h-[72px] rounded-[24px] bg-[#005BFF] items-center justify-center">
              <Text className="text-white text-[32px] font-extrabold">{name?.[0]}</Text>
            </View>
            <View className="flex-row items-center bg-[#EFF6FF] px-3 py-1.5 rounded-xl">
              <Ionicons name="checkmark-circle" size={16} color="#005BFF" />
              <Text className="text-[#005BFF] text-[12px] font-bold ml-1">Проверено</Text>
            </View>
          </View>

          <Text className="text-[32px] font-extrabold text-[#1E293B] tracking-[-0.5px]">{name}</Text>

          <View className="flex-row items-center mt-3">
            <View className="flex-row items-center bg-[#FFFBEB] px-2 py-1 rounded-lg border border-[#FEF3C7]">
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text className="text-[14px] font-bold text-[#B45309] ml-1">{rating}</Text>
            </View>
            <Text className="text-[14px] text-[#94A3B8] ml-2.5 font-medium">• N отзывов</Text>
          </View>
        </View>


        <View className="px-5 pt-6">
          <View className="bg-white rounded-[24px] p-5 flex-row justify-between items-center mb-4 border border-[#F1F5F9]">
            <View>
              <Text className="text-[12px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Стоимость услуг</Text>
              <Text className="text-[24px] font-extrabold text-[#1E293B]">{price}</Text>
            </View>
            <Pressable>
              <Ionicons name="information-circle-outline" size={24} color="#94A3B8" />
            </Pressable>
          </View>

          <View className="flex-row mb-6">
            <View className="flex-1 bg-white rounded-[24px] p-5 border border-[#F1F5F9] mr-3">
              <Ionicons name="time-outline" size={24} color="#005BFF" />
              <Text className="text-[18px] font-extrabold text-[#1E293B] mt-3">2-3 ч.</Text>
              <Text className="text-[12px] text-[#64748B] mt-0.5 font-medium">Время уборки</Text>
            </View>
            <View className="flex-1 bg-white rounded-[24px] p-5 border border-[#F1F5F9]">
              <Ionicons name="shield-checkmark-outline" size={24} color="#005BFF" />
              <Text className="text-[18px] font-extrabold text-[#1E293B] mt-3">100%</Text>
              <Text className="text-[12px] text-[#64748B] mt-0.5 font-medium">Гарантия</Text>
            </View>
          </View>

          <Text className="text-[20px] font-extrabold text-[#1E293B] mb-3">О сервисе</Text>
          <Text className="text-[16px] leading-[26px] text-[#64748B] font-normal">
            Профессиональный клининг нового поколения. Мы используем только гипоаллергенные
            средства и современное оборудование. Каждый исполнитель проходит проверку безопасности.
          </Text>
        </View>
      </Animated.ScrollView>


      <View
        style={{ paddingBottom: insets.bottom + 20 }}
        className="absolute bottom-0 left-0 right-0 px-5"
      >
        <BlurView intensity={30} className="rounded-[30px] overflow-hidden border border-white/50">
          <Pressable
            className="bg-[#005BFF] h-16 rounded-[24px] items-center justify-center shadow-lg"
            onPress={handleOrderPress}
          >
            <Text className="text-white text-[18px] font-bold">Заказать клининг</Text>
          </Pressable>
        </BlurView>
      </View>
    </View>
  );
}