import { saveExpoToken } from '@/api/Notification';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const registerPushToken = async (userId: number) => {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus = existingStatus === 'granted'
    ? existingStatus
    : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;

  const {data}= await saveExpoToken({userId, expoToken:token})
  return data;
};