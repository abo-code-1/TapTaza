import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  FadeInDown 
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ServiceCardProps {
  item: any;
  index: number;
  active: boolean;
  onPress: () => void;
}

export const ServiceCard = ({ item, index, active, onPress }: ServiceCardProps) => {
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(active ? 1.03 : 1) }],
    backgroundColor: withTiming(active ? 'white' : '#f8fafc'),
  }));

  return (
    // Обертка только для анимации появления (FadeInDown)
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Pressable onPress={onPress}>
        <Animated.View 
          style={rStyle}
          className={`rounded-[32px] mb-4 overflow-hidden border-2 ${active ? 'border-blue-500 shadow-xl' : 'border-transparent shadow-sm'}`}
        >
          <View className="p-5 flex-row items-center">
            <LinearGradient
              colors={item.colors}
              className="w-16 h-16 rounded-2xl items-center justify-center shadow-lg shadow-blue-200"
            >
              <MaterialCommunityIcons name={item.icon as any} size={30} color="white" />
            </LinearGradient>

            <View className="flex-1 ml-4">
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-slate-900">{item.title}</Text>
                {item.badge && (
                  <View className="ml-2 bg-blue-100 px-2 py-0.5 rounded-md">
                    <Text className="text-blue-600 text-[10px] font-black uppercase tracking-tighter">{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-400 text-sm font-medium">{item.subtitle}</Text>
              <Text className="text-blue-600 font-black text-xl mt-1 tracking-tight">{item.price}</Text>
            </View>

            <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${active ? 'border-blue-500 bg-blue-500' : 'border-gray-200'}`}>
              {active && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};