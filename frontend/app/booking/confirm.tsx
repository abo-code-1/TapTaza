import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../src/store/bookingStore';

export default function ConfirmScreen() {
  const router = useRouter();
  const {
    company,
    service,
    date,
    time,
    address,
    options,
    totalPrice,
    isLoading,
    error,
    createBooking,
    reset,
  } = useBookingStore();
  const [paymentMethod, setPaymentMethod] = useState<string>('kaspi');

  // Format date for display
  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return 'Не выбрана';
    const d = new Date(dateStr);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return `${d.getDate()} ${months[d.getMonth()]}, ${days[d.getDay()]}`;
  };

  const handleOrder = async () => {
    try {
      await createBooking();
      router.replace('/booking/success');
    } catch (err: any) {
      Alert.alert('Ошибка', err.message || 'Не удалось создать заказ');
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between py-2">
      <Text className="text-gray-500">{label}</Text>
      <Text className="font-medium text-gray-900">{value}</Text>
    </View>
  );

  // Calculate display price
  const basePrice = service?.price || 5000;
  const additionalPrice = totalPrice - basePrice;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-gray-900 text-center mr-8">
          Подтверждение
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Company */}
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
          <Text className="text-sm text-gray-500 mb-2">Компания</Text>
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center">
              <Text className="text-blue-600 font-bold">{company?.name?.[0] || 'C'}</Text>
            </View>
            <View className="flex-1 ml-3">
              <View className="flex-row items-center">
                <Text className="text-base font-semibold text-gray-900">{company?.name || 'Компания'}</Text>
                {company?.verified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#10B981"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text className="text-sm text-gray-500 ml-1">{company?.rating || 4.9} ({company?.reviewCount || 0} отзывов)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Details */}
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
          <Text className="text-sm text-gray-500 mb-2">Детали заказа</Text>
          <InfoRow label="Услуга" value={service?.name || 'Стандартная уборка'} />
          <InfoRow label="Комнат" value={`${options?.roomCount || 2} комнаты`} />
          <InfoRow label="Площадь" value={`${options?.area || 50} м²`} />
          <InfoRow label="Дата" value={formatDisplayDate(date)} />
          <InfoRow label="Время" value={time || 'Не выбрано'} />
          <InfoRow label="Адрес" value={address ? `${address.street}${address.apartment ? ', кв. ' + address.apartment : ''}` : 'Не выбран'} />
          {options?.hasPets && <InfoRow label="Есть питомцы" value="Да" />}
          {options?.ecoFriendly && <InfoRow label="Эко-средства" value="Да" />}
        </View>

        {/* Price */}
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
          <View className="flex-row justify-between py-1">
            <Text className="text-gray-500">{service?.name || 'Стандартная уборка'}</Text>
            <Text className="text-gray-900">{basePrice.toLocaleString()} ₸</Text>
          </View>
          {additionalPrice > 0 && (
            <View className="flex-row justify-between py-1">
              <Text className="text-gray-500">Дополнительно</Text>
              <Text className="text-gray-900">+{additionalPrice.toLocaleString()} ₸</Text>
            </View>
          )}
          <View className="border-t border-gray-100 mt-2 pt-2 flex-row justify-between">
            <Text className="text-base font-semibold text-gray-900">Итого</Text>
            <Text className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()} ₸</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View
          className="bg-white rounded-2xl p-4 mb-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-sm text-gray-500 mb-3">Способ оплаты</Text>

          {[
            { id: 'kaspi', label: 'Kaspi Pay', icon: 'card' },
            { id: 'card', label: 'Банковская карта', icon: 'card-outline' },
            { id: 'cash', label: 'Наличные', icon: 'cash-outline' },
          ].map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setPaymentMethod(method.id)}
              className={`flex-row items-center p-3 rounded-xl mb-2 ${
                paymentMethod === method.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                  paymentMethod === method.id ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                {paymentMethod === method.id && (
                  <View className="w-3 h-3 rounded-full bg-blue-600" />
                )}
              </View>
              <Ionicons name={method.icon as any} size={20} color="#374151" />
              <Text className="flex-1 ml-2 text-base text-gray-900">{method.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Error message */}
        {error && (
          <Text className="text-sm text-red-500 text-center mb-4">{error}</Text>
        )}

        {/* Notes */}
        {options?.notes && (
          <View
            className="bg-white rounded-2xl p-4 mb-6"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-sm text-gray-500 mb-2">Примечания</Text>
            <Text className="text-gray-900">{options.notes}</Text>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-5 py-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleOrder}
          disabled={isLoading}
          className={`rounded-2xl py-4 items-center ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            {isLoading ? 'Оформление...' : 'Оформить заказ'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
