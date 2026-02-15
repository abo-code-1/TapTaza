import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';

export default function OTPScreen() {
  const router = useRouter();
  const { phone, redirect } = useLocalSearchParams<{ phone: string; redirect?: string }>();
  const { login } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (text && index === 3) {
      const fullCode = newCode.join('');
      verifyCode(fullCode);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (fullCode: string) => {
    setLoading(true);

    // Simulate API verification
    setTimeout(() => {
      setLoading(false);
      if (fullCode === '1234') {
        // Check if new user (simulate - for now always new user for demo)
        const isNewUser = true;
        if (isNewUser) {
          router.push({
            pathname: '/(auth)/name',
            params: { redirect: redirect || '' },
          });
        } else {
          // Existing user - log them in and redirect
          login({
            id: '1',
            phone: phone || '',
            firstName: 'Пользователь',
          });
          if (redirect) {
            router.replace(redirect as any);
          } else {
            router.replace('/(tabs)/home');
          }
        }
      } else {
        setError('Неверный код. Попробуйте еще раз.');
        setCode(['', '', '', '']);
        inputs.current[0]?.focus();
      }
    }, 1000);
  };

  const resendCode = () => {
    setTimer(60);
    setCode(['', '', '', '']);
    setError('');
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
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Введите код</Text>
          <Text className="text-base text-gray-500 text-center mb-2">Код отправлен на номер</Text>
          <Text className="text-base font-semibold text-gray-900 text-center mb-8">{phone}</Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-center gap-3 mb-4">
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputs.current[index] = ref;
                }}
                value={code[index]}
                onChangeText={(text) => handleChange(text.slice(-1), index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                className={`w-16 h-16 bg-gray-100 rounded-2xl text-center text-2xl font-bold text-gray-900 ${error ? 'border-2 border-red-500' : ''}`}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {error ? (
            <Text className="text-sm text-red-500 text-center mb-4">{error}</Text>
          ) : (
            <Text className="text-sm text-gray-400 text-center mb-4">
              {timer > 0 ? `Код действителен ${timer} сек.` : 'Код истек'}
            </Text>
          )}

          {/* Resend */}
          <TouchableOpacity onPress={resendCode} disabled={timer > 0} className="items-center mb-4">
            <Text className={`font-semibold ${timer > 0 ? 'text-gray-400' : 'text-blue-600'}`}>
              Отправить повторно
            </Text>
          </TouchableOpacity>

          {/* Change number */}
          <TouchableOpacity onPress={() => router.back()} className="items-center">
            <Text className="text-gray-500">Изменить номер</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
