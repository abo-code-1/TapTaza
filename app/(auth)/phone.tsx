import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, TextInput } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function PhoneScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { setPhone: setStorePhone } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidPhone = phone.replace(/\D/g, '').length === 10;

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    let formatted = '';
    if (digits.length > 0) formatted += '(' + digits.substring(0, 3);
    if (digits.length > 3) formatted += ') ' + digits.substring(3, 6);
    if (digits.length > 6) formatted += '-' + digits.substring(6, 8);
    if (digits.length > 8) formatted += '-' + digits.substring(8, 10);
    return formatted;
  };

  const handleSendCode = async () => {
    if (!isValidPhone) {
      setError('Введите корректный номер телефона');
      return;
    }

    setLoading(true);
    setError('');

    // Store phone in auth store
    const fullPhone = '+7' + phone.replace(/\D/g, '');
    setStorePhone(fullPhone);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: fullPhone, redirect: redirect || '' },
      });
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12">
          {/* Logo */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-blue-600 rounded-3xl items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">T</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">Tap-Taza</Text>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            Добро пожаловать!
          </Text>
          <Text className="text-base text-gray-500 text-center mb-8">
            Введите номер телефона для входа
          </Text>

          {/* Phone Input */}
          <View
            className={`bg-gray-100 rounded-2xl px-4 py-4 flex-row items-center mb-2 ${error ? 'border border-red-500' : ''}`}
          >
            <Text className="text-lg font-semibold text-gray-900 mr-2">+7</Text>
            <TextInput
              value={formatPhone(phone)}
              onChangeText={(text) => {
                setPhone(text.replace(/\D/g, ''));
                setError('');
              }}
              placeholder="(777) 123-45-67"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              className="flex-1 text-lg text-gray-900"
              maxLength={15}
              autoFocus
            />
          </View>

          {error ? (
            <Text className="text-sm text-red-500 mb-4">{error}</Text>
          ) : (
            <Text className="text-sm text-gray-400 mb-4">Мы отправим SMS с кодом для входа</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSendCode}
            disabled={!isValidPhone || loading}
            className={`rounded-2xl py-4 items-center ${isValidPhone ? 'bg-blue-600' : 'bg-gray-300'}`}
            activeOpacity={0.8}
          >
            <Text
              className={`font-semibold text-base ${isValidPhone ? 'text-white' : 'text-gray-500'}`}
            >
              {loading ? 'Отправка...' : 'Получить код'}
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text className="text-xs text-gray-400 text-center mt-6 px-4">
            Нажимая кнопку, вы соглашаетесь с{' '}
            <Text className="text-blue-600">Условиями использования</Text> и{' '}
            <Text className="text-blue-600">Политикой конфиденциальности</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
