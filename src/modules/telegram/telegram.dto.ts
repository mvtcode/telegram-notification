import { GroupType } from './groupType';

export interface TelegramEntity {
  _id: string;
  type: GroupType;
  chatId: string;
  firstName: string;
  lastName: string;
  username: string;
  title: string;
  isEnable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
