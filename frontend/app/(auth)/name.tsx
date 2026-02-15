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
  const { verifyOtp, phone, isLoading, error: storeError, setError } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [localError, setLocalError] = useState('');

  const error = localError || storeError;
  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;

  const handleContinue = async () => {
    if (!isValid) return;

    setLocalError('');
    setError(null);

    try {
      // Re-verify with name to complete registration
      // The OTP was already verified, this call will register the user
      await verifyOtp('', firstName.trim(), lastName.trim());

      // Navigate to processing screen with smooth transition
      router.replace({
        pathname: '/(auth)/processing',
        params: { redirect: redirect || '' },
      });
    } catch (err: any) {
      setLocalError(err.message || 'Не удалось сохранить данные');
    }
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
              onChangeText={(text) => {
                setFirstName(text);
                setLocalError('');
                setError(null);
              }}
              placeholder="Введите имя"
              placeholderTextColor="#9CA3AF"
              className={`bg-gray-100 rounded-2xl px-4 py-4 text-base text-gray-900 ${error ? 'border border-red-500' : ''}`}
              autoFocus
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Фамилия</Text>
            <TextInput
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setLocalError('');
                setError(null);
              }}
              placeholder="Введите фамилию"
              placeholderTextColor="#9CA3AF"
              className={`bg-gray-100 rounded-2xl px-4 py-4 text-base text-gray-900 ${error ? 'border border-red-500' : ''}`}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          {error && <Text className="text-sm text-red-500 mb-4">{error}</Text>}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isValid || isLoading}
            className={`rounded-2xl py-4 items-center ${isValid && !isLoading ? 'bg-blue-600' : 'bg-gray-300'}`}
            activeOpacity={0.8}
          >
            <Text className={`font-semibold text-base ${isValid && !isLoading ? 'text-white' : 'text-gray-500'}`}>
              {isLoading ? 'Сохранение...' : 'Продолжить'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
