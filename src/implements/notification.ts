import { Logger } from 'winston';
import { createLog } from '../libs/logger';
import { Message } from '../dto/message.dto';
import { NotifierInterface } from '../interface/notifier';

export class Notification implements NotifierInterface {
  protected logger: Logger;

  constructor() {
    this.logger = createLog('notification');
  }

  send(message: Message) {
    this.logger.info(message);
  }
}
