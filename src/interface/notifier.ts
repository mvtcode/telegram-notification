import { Message } from '../dto/message.dto';

export interface NotifierInterface {
  send(message: Message): void;
}
