import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function ProcessingScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );

    // Navigate after delay
    const timer = setTimeout(() => {
      if (redirect) {
        router.replace(redirect as any);
      } else {
        router.replace('/(tabs)/home');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {/* Animated Circle */}
      <View className="mb-8">
        <Animated.View
          style={[
            {
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 4,
              borderColor: '#E5E7EB',
              borderTopColor: '#3B82F6',
            },
            animatedStyle,
          ]}
        />
      </View>

      {/* Processing Text */}
      <Text className="text-xl font-bold text-gray-900 text-center mb-2">
        Обработка данных
      </Text>
      <Text className="text-base text-gray-500 text-center">
        Пожалуйста, подождите...
      </Text>

      {/* Additional indicator */}
      <View className="mt-8">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    </View>
  );
}
