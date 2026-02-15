import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';

export default function NameScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { phone, login } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;

  const handleContinue = async () => {
    if (!isValid) return;

    setLoading(true);

    // Simulate API call to save user
    setTimeout(() => {
      setLoading(false);

      // Login the user
      login({
        id: '1',
        phone: phone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Redirect to the intended destination or home
      if (redirect) {
        router.replace(redirect as any);
      } else {
        router.replace('/(tabs)/home');
      }
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6 pt-8">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Как вас зовут?</Text>
          <Text className="text-base text-gray-500 text-center mb-8">
            Эти данные будут видны компаниям при заказе
          </Text>

          {/* Name Inputs */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Имя</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Введите имя"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 rounded-2xl px-4 py-4 text-base text-gray-900"
              autoFocus
              autoCapitalize="words"
            />
          </View>

          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-700 mb-2">Фамилия</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Введите фамилию"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 rounded-2xl px-4 py-4 text-base text-gray-900"
              autoCapitalize="words"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isValid || loading}
            className={`rounded-2xl py-4 items-center ${isValid ? 'bg-blue-600' : 'bg-gray-300'}`}
            activeOpacity={0.8}
          >
            <Text className={`font-semibold text-base ${isValid ? 'text-white' : 'text-gray-500'}`}>
              {loading ? 'Сохранение...' : 'Продолжить'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
