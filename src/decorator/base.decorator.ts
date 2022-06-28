import { Logger } from 'winston';
import { createLog } from '../libs/logger';
import { Message } from '../dto/message.dto';
import { NotifierInterface } from '../interface/notifier';

export abstract class BaseDecorator implements NotifierInterface {
  protected notifier: NotifierInterface;

  protected logger: Logger;

  constructor(notifier: NotifierInterface) {
    this.notifier = notifier;
    this.logger = createLog(this.constructor.name);
  }

  send(message: Message) {
    this.notifier.send(message);
  }
}
