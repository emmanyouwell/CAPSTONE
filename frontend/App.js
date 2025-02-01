import Main from './Main';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import { NotificationProvider } from "./context/NotificationContext";
import * as Notifications from 'expo-notifications';

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
        <Main/>
      </Provider>
    </NotificationProvider>
  );
}


