import Main from './Main';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { NotificationProvider } from "./context/NotificationContext";
import * as Notifications from 'expo-notifications';
import { Provider as PaperProvider } from 'react-native-paper';
export default function App() {
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


