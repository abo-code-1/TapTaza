import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'rounded-2xl py-4 items-center justify-center flex-row';

  const variantStyles = {
    primary: 'bg-blue-600',
    secondary: 'bg-white border border-gray-200',
    ghost: 'bg-transparent',
  };

  const textStyles = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-gray-900 font-semibold text-base',
    ghost: 'text-blue-600 font-semibold text-base',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563EB'} />
      ) : (
        <Text className={textStyles[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
