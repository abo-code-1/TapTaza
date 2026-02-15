import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Input({ label, error, icon, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>}
      <View
        className={`bg-gray-100 rounded-xl px-4 py-3 flex-row items-center ${error ? 'border border-red-500' : ''}`}
      >
        {icon && <Ionicons name={icon} size={20} color="#9CA3AF" style={{ marginRight: 12 }} />}
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
