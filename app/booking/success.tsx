import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        {/* Success Icon */}
        <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="checkmark" size={48} color="#10B981" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Заказ оформлен!</Text>
        <Text className="text-base text-gray-500 text-center mb-2">Номер заказа</Text>
        <Text className="text-xl font-bold text-blue-600 mb-6">#12345</Text>

        {/* Info */}
        <View className="bg-blue-50 rounded-2xl p-4 w-full mb-8">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#2563EB" />
            <Text className="flex-1 ml-2 text-gray-700">
              CleanMaster свяжется с вами в течение 15 минут для подтверждения
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          className="bg-blue-600 rounded-2xl py-4 w-full items-center mb-3"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">Мои заказы</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          className="py-3 w-full items-center"
          activeOpacity={0.6}
        >
          <Text className="text-gray-500 font-medium">На главную</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
