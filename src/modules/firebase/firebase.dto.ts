import { DeviceType } from './deviceType';

export interface FirebaseEntity {
  _id: string;
  type: DeviceType;
  deviceId: string;
  firstName: string;
  lastName: string;
  username: string;
  title: string;
  isEnable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
