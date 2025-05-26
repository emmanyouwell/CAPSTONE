import Main from './Main';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { NotificationProvider } from "./context/NotificationContext";
import * as Notifications from 'expo-notifications';
import { Provider as PaperProvider } from 'react-native-paper';
import { setupAxiosInterceptors } from './api/interceptor';

import { useEffect } from 'react'
export default function App() {
  useEffect(() => {
    setupAxiosInterceptors();
    console.log('[Setup] Axios interceptors initialized');

  }, [])
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  return (
    <NotificationProvider>
      <Provider store={store}>
        <PaperProvider>
          <Main />
        </PaperProvider>
      </Provider>
    </NotificationProvider>
  );
}


