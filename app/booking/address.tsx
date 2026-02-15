import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../src/store/bookingStore';

const SAVED_ADDRESSES = [
  { id: '1', label: 'Дом', street: 'ул. Абая 150', apartment: 'кв. 45', icon: 'home' },
  { id: '2', label: 'Офис', street: 'пр. Достык 5', apartment: 'офис 301', icon: 'business' },
];

export default function AddressScreen() {
  const router = useRouter();
  const { setAddress, setOptions } = useBookingStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roomCount, setRoomCount] = useState(2);
  const [hasPets, setHasPets] = useState(false);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [notes, setNotes] = useState('');

  const handleContinue = () => {
    const selectedAddress = SAVED_ADDRESSES.find((a) => a.id === selectedId);
    if (selectedAddress) {
      setAddress({
        id: selectedAddress.id,
        label: selectedAddress.label,
        street: selectedAddress.street,
        apartment: selectedAddress.apartment,
      });
      setOptions({
        roomCount,
        hasPets,
        ecoFriendly,
        notes: notes.trim() || undefined,
      });
      router.push('/booking/confirm');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-gray-900 text-center mr-8">
          Адрес уборки
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Saved Addresses */}
        <View className="px-5 pt-6">
          <Text className="text-base font-semibold text-gray-900 mb-3">Сохраненные адреса</Text>
          {SAVED_ADDRESSES.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              onPress={() => setSelectedId(addr.id)}
              className={`flex-row items-center bg-white rounded-2xl p-4 mb-2 ${
                selectedId === addr.id ? 'border-2 border-blue-600' : ''
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                className={`w-12 h-12 rounded-xl items-center justify-center ${
                  selectedId === addr.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <Ionicons
                  name={addr.icon as any}
                  size={24}
                  color={selectedId === addr.id ? '#2563EB' : '#6B7280'}
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-gray-900">{addr.label}</Text>
                <Text className="text-sm text-gray-500">
                  {addr.street}, {addr.apartment}
                </Text>
              </View>
              {selectedId === addr.id && (
                <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="flex-row items-center justify-center py-3">
            <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
            <Text className="text-blue-600 font-medium ml-2">Добавить новый адрес</Text>
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View className="px-5 pt-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Детали</Text>

          {/* Room Count */}
          <View
            className="bg-white rounded-2xl p-4 mb-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-sm text-gray-500 mb-2">Количество комнат</Text>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setRoomCount(Math.max(1, roomCount - 1))}
                className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
              >
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900">{roomCount}</Text>
              <TouchableOpacity
                onPress={() => setRoomCount(roomCount + 1)}
                className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center"
              >
                <Ionicons name="add" size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Options */}
          <TouchableOpacity
            onPress={() => setHasPets(!hasPets)}
            className="flex-row items-center bg-white rounded-2xl p-4 mb-2"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
                hasPets ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}
            >
              {hasPets && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text className="flex-1 text-base text-gray-900 ml-3">Есть домашние животные</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setEcoFriendly(!ecoFriendly)}
            className="flex-row items-center bg-white rounded-2xl p-4 mb-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View
              className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
                ecoFriendly ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}
            >
              {ecoFriendly && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text className="flex-1 text-base text-gray-900 ml-3">Эко-средства для уборки</Text>
            <View className="bg-emerald-100 px-2 py-1 rounded-lg">
              <Text className="text-xs text-emerald-700">+500 ₸</Text>
            </View>
          </TouchableOpacity>

          {/* Notes */}
          <Text className="text-sm text-gray-500 mb-2">Комментарий (необязательно)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Дополнительные пожелания..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            className="bg-white rounded-2xl p-4 text-base text-gray-900 min-h-[100px]"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
              textAlignVertical: 'top',
            }}
          />
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-5 py-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedId}
          className={`rounded-2xl py-4 items-center ${selectedId ? 'bg-blue-600' : 'bg-gray-300'}`}
          activeOpacity={0.8}
        >
          <Text
            className={`font-semibold text-base ${selectedId ? 'text-white' : 'text-gray-500'}`}
          >
            Продолжить
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
