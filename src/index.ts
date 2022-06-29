import './config';
import connectMongoDB from './libs/mongodb';
import { TelegramNotification } from './modules/telegram/telegram';
import { Notification } from './implements/notification';
import { FirebaseNotification } from './modules/firebase/firebase';

(async () => {
  connectMongoDB();

  const notification = new Notification();
  const telegram = new TelegramNotification(notification);
  // telegram.send({
  //   title: 'hello',
  //   content: 'Say hello',
  // });

  const firebase = new FirebaseNotification(telegram);
  firebase.send({
    title: 'hello',
    content: 'Say hello',
  });
})();
