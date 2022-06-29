import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import firebaseAdmin from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import { NotifierInterface } from '../../interface/notifier';
import { BaseDecorator } from '../../decorator/base.decorator';
import { Message } from '../../dto/message.dto';
import FirebaseModel from './firebase.model';
import { FirebaseEntity } from './firebase.dto';
import { DeviceType } from './deviceType';

export class FirebaseNotification extends BaseDecorator {
  private messaging: Messaging;

  constructor(notifier: NotifierInterface) {
    super(notifier);

    const serviceAccountPath = join(__dirname, '../../..', 'config/serviceAccountKey.json');
    const isExist = existsSync(serviceAccountPath);
    if (isExist) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
      });

      this.messaging = firebaseAdmin.messaging();
    } else {
      this.logger.error('Please copy file serviceAccountKey.json to config/serviceAccountKey.json');
      process.exit(1);
    }
  }

  send(message: Message): void {
    this.notifier.send(message);
    this.sendFirebase(message);
  }

  private async sendFirebase(message: Message): Promise<void> {
    this.logger.info(message);

    const list: FirebaseEntity[] = await FirebaseModel.find({
      isEnable: true,
    });

    // https://firebase.google.com/docs/cloud-messaging/http-server-ref
    if(list && list.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for(const firebase of list) {
        switch (firebase.type) {
          case DeviceType.WEB:
            this.pushWeb(message, firebase);
            break;
          case DeviceType.ANDROID:
            this.pushAndroid(message, firebase);
            break;
          case DeviceType.IOS:
            this.pushIos(message, firebase);
            break;
          default: {
            // nothing
          }
        }
      }
    }
  }

  private async pushWeb(message: Message, firebase: FirebaseEntity) {
    await this.messaging.send({
      data: {
        firtName: firebase.firstName,
        lastName: firebase.lastName,
      },
      apns: {
        headers: {
          'apns-priority': '5',
        },
        payload: {
          aps: {
            category: 'NEW_MESSAGE_CATEGORY',
          },
        },
      },
      webpush: {
        // headers:{
        //   Urgency: "high",
        //   TTL: "86400"
        // },
        notification: {
          title: message.title,
          body: message.content,
          icon: '/notification.png',
          // click_action: 'https://yoururl.here',
        },
      },
      token: firebase.deviceId,
    });
  }

  private async pushAndroid(message: Message, firebase: FirebaseEntity) {
    await this.messaging.send({
      android: {
        data: {
          firtName: firebase.firstName,
          lastName: firebase.lastName,
          icon: '/notification.png',
          // clickAction: 'action-here',
        },
        notification: {
          title: message.title,
          body: message.content,
        },
      },
      token: firebase.deviceId,
    });
  }

  private async pushIos(message: Message, firebase: FirebaseEntity) {
    await this.messaging.send({
      data: {
        firtName: firebase.firstName,
        lastName: firebase.lastName,
      },
      notification: {
        title: message.title,
        body: message.content,
        // imageUrl: 'http://localhost:3000/notification.png',
      },
      apns: {
        headers: {
          'apns-priority': '5',
        },
        payload: {
          aps: {
            category: 'NEW_MESSAGE_CATEGORY',
          },
        },
      },
      token: firebase.deviceId,
    });
  }
}
