import { config } from 'dotenv';
import connectMongoDB from './libs/mongodb';
import { TelegramNotification } from './decorator/telegram.decorator';
import { Notification } from './implements/notification';

config();

(async () => {
  connectMongoDB();

  const notification = new Notification();
  const telegram = new TelegramNotification(notification);
  telegram.send({
    to: '-638589359',
    msg: 'Say hello',
  });
})();
