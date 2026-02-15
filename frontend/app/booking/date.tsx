import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../src/store/bookingStore';

const TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const getDaysInMonth = () => {
  const today = new Date();
  const days = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
};

const formatDate = (date: Date) => {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return {
    dayName: days[date.getDay()],
    dayNum: date.getDate(),
    month: date.toLocaleString('ru', { month: 'short' }),
    full: date.toISOString().split('T')[0],
  };
};

export default function DateScreen() {
  const router = useRouter();
  const { setDateTime, company } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const days = getDaysInMonth();

  const canContinue = selectedDate && selectedTime;

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setDateTime(selectedDate, selectedTime);
      router.push('/booking/address');
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
          Выберите дату и время
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View className="px-5 pt-6">
          <Text className="text-base font-semibold text-gray-900 mb-4">Дата</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <View className="flex-row gap-2">
              {days.map((date) => {
                const formatted = formatDate(date);
                const isSelected = selectedDate === formatted.full;
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <TouchableOpacity
                    key={formatted.full}
                    onPress={() => setSelectedDate(formatted.full)}
                    className={`w-16 py-3 rounded-2xl items-center ${
                      isSelected ? 'bg-blue-600' : 'bg-white'
                    }`}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text
                      className={`text-xs ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}
                    >
                      {isToday ? 'Сегодня' : formatted.dayName}
                    </Text>
                    <Text
                      className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}
                    >
                      {formatted.dayNum}
                    </Text>
                    <Text
                      className={`text-xs ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}
                    >
                      {formatted.month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View className="px-5">
          <Text className="text-base font-semibold text-gray-900 mb-4">Время</Text>
          <View className="flex-row flex-wrap gap-2">
            {TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  className={`px-5 py-3 rounded-xl ${isSelected ? 'bg-blue-600' : 'bg-white'}`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text
                    className={`text-base font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-5 py-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!canContinue}
          className={`rounded-2xl py-4 items-center ${canContinue ? 'bg-blue-600' : 'bg-gray-300'}`}
          activeOpacity={0.8}
        >
          <Text
            className={`font-semibold text-base ${canContinue ? 'text-white' : 'text-gray-500'}`}
          >
            Продолжить
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
