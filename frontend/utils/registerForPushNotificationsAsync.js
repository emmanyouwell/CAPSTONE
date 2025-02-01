import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants'
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        });
    }
      let token;
  
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
        alert('Push notification permission denied!');
        return;
        }

        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new Error("Project Id not found")
        }
        try {
            const pushTokenString = (await Notifications.getExpoPushTokenAsync({
                projectId,
            })).data
            console.log(pushTokenString)
            return pushTokenString
        } catch (error) {
            throw new Error(error)
        }
    } else {
        alert('Must use a physical device for Push Notifications');
    }


    return token;
}