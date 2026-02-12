import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Platform, ToastAndroid, Vibration } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === 'android') {
          // ✅ Feedback en Android
          Vibration.vibrate(50); // vibración corta
          ToastAndroid.show("Tab presionado", ToastAndroid.SHORT);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
