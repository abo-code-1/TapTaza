import { View, Text, TextInput } from 'react-native';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChangeText, error }: PhoneInputProps) {
  const formatPhone = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');

    // Format as (XXX) XXX-XX-XX
    let formatted = '';
    if (digits.length > 0) formatted += '(' + digits.substring(0, 3);
    if (digits.length > 3) formatted += ') ' + digits.substring(3, 6);
    if (digits.length > 6) formatted += '-' + digits.substring(6, 8);
    if (digits.length > 8) formatted += '-' + digits.substring(8, 10);

    return formatted;
  };

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 10);
    onChangeText(digits);
  };

  return (
    <View className="mb-4">
      <View
        className={`bg-gray-100 rounded-xl px-4 py-4 flex-row items-center ${error ? 'border border-red-500' : ''}`}
      >
        <Text className="text-lg font-semibold text-gray-900 mr-2">+7</Text>
        <TextInput
          value={formatPhone(value)}
          onChangeText={handleChange}
          placeholder="(777) 123-45-67"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          className="flex-1 text-lg text-gray-900"
          maxLength={15}
        />
      </View>
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
