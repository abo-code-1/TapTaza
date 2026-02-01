import React, { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';



interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  iconColor: string;
  isLast?: boolean;
}

export default function ProfileScreen() {
  const [user, setUser] = useState({
    firstName: 'Сергей',
    lastName: 'Сергеев',
    phone: '+7 (777) 123-45-67',
    email: 'chlenososer@gmail.com',
    avatar: '',
    bonuses: 450,
  });

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser(prev => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ВЕРХНЯЯ ПАНЕЛЬ */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <Text className="text-2xl font-black text-slate-900">Кабинет</Text>
          <Pressable className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-100 shadow-sm">
            <Ionicons name="notifications-outline" size={20} color="#475569" />
          </Pressable>
        </View>

        {/* БЛОК ПОЛЬЗОВАТЕЛЯ (БОЛЕЕ ЖИВОЙ) */}
        <View className="px-6 mt-4">
          <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-row items-center">
            <View className="relative">
              <View className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-200">
                <Image source={{ uri: user.avatar }} className="w-full h-full" />
              </View>
              <Pressable
                onPress={handlePickImage}
                className="absolute -bottom-1 -right-1 bg-[#005BFF] w-7 h-7 rounded-full items-center justify-center border-2 border-white"
              >
                <Ionicons name="camera" size={14} color="white" />
              </Pressable>
            </View>

            <View className="ml-5 flex-1">
              <Text className="text-xl font-bold text-slate-900">{user.firstName} {user.lastName}</Text>
              <Text className="text-slate-400 text-sm">{user.email}</Text>
            </View>
          </View>
        </View>


        {/* БЫСТРЫЕ КНОПКИ УПРАВЛЕНИЯ */}
        <View className="flex-row px-6 mt-6 justify-between">
          <QuickAction icon="home-outline" label="Адреса" color="#6366F1" />
          <QuickAction icon="receipt-outline" label="Заказы" color="#F59E0B" />
          <QuickAction icon="card-outline" label="Оплата" color="#10B981" />
        </View>

        {/* ЛИЧНЫЕ ДАННЫЕ */}
        <View className="px-6 mt-8">
          <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Настройки аккаунта</Text>
          <View className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <InfoRow icon="phone" label="Телефон" value={user.phone} iconColor="#3B82F6" />
            <InfoRow icon="shield-check-outline" label="Безопасность" value="Пароль защищен" iconColor="#8B5CF6" isLast />
          </View>
        </View>

        {/* ВЫХОД */}
        <Pressable className="mt-8 flex-row items-center justify-center">
          <MaterialCommunityIcons name="logout" size={20} color="#F43F5E" />
          <Text className="text-rose-500 font-bold text-base ml-2">Выйти из профиля</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

// Компонент для плиток (Адреса, Заказы и т.д.)
function QuickAction({ icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <Pressable className="bg-white rounded-3xl p-4 items-center justify-center border border-slate-100 shadow-sm w-[30%]">
      <View style={{ backgroundColor: `${color}15` }} className="p-3 rounded-2xl mb-2">
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className="text-slate-600 font-bold text-xs">{label}</Text>
    </Pressable>
  );
}

function InfoRow({ icon, label, value, iconColor, isLast = false }: InfoRowProps) {
  return (
    <View className={`flex-row items-center p-4 ${!isLast ? 'border-b border-slate-50' : ''}`}>
      <View style={{ backgroundColor: `${iconColor}10` }} className="w-10 h-10 rounded-xl items-center justify-center">
        <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-slate-400 text-[10px] font-bold uppercase leading-3">{label}</Text>
        <Text className="text-slate-900 font-bold text-sm mt-0.5">{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
    </View>
  );
}