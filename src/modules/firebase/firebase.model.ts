import { Schema, model, Types } from 'mongoose';
import { DeviceType } from './deviceType';

const schema = new Schema({
  _id: Types.ObjectId,
  type: {
    type: String,
    index: false,
    required: true,
    enum: DeviceType,
  },
  deviceId: {
    type: String,
    index: false,
    required: false,
  },
  firstName: {
    type: String,
    index: false,
    required: false,
  },
  lastName: {
    type: String,
    index: false,
    required: false,
  },
  username: {
    type: String,
    index: false,
    required: false,
  },
  title: {
    type: String,
    index: false,
    required: false,
  },
  isEnable: {
    type: Boolean,
    index: false,
    required: true,
    default: true,
  },
  createdAt: Date,
  updatedAt: Date,
}, {
  collection: 'firebases',
  timestamps: true,
  versionKey: false,
});

const Model = model('firebases', schema);

export default Model;
