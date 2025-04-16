import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title: string;
  variant?: 'primary' | 'outline' | 'danger';
  icon?: React.ReactNode;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, variant = 'primary', icon, ...touchableProps }, ref) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return 'border border-secondary bg-transparent';
      case 'danger':
        return 'bg-red-600';
      default: // primary
        return 'bg-secondary';
    }
  };

  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      className={`items-center rounded-lg shadow-md p-4 flex-row justify-center ${getButtonStyle()} ${touchableProps.className || ''}`}>
      {icon && <View className="mr-2">{icon}</View>}
      <Text className={`text-white text-lg font-semibold text-center ${variant === 'outline' ? 'text-secondary' : 'text-white'}`}>{title}</Text>
    </TouchableOpacity>
  );
});

const styles = {
  button: 'items-center bg-indigo-500 rounded-[28px] shadow-md p-4',
  buttonText: 'text-white text-lg font-semibold text-center',
};
