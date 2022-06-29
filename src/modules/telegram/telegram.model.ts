import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  _id: Types.ObjectId,
  type: {
    type: String,
    index: false,
    required: true,
    // enum: ['private', 'group']
  },
  chatId: {
    type: Number,
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
    default: false,
  },
  createdAt: Date,
  updatedAt: Date,
}, {
  collection: 'telegrams',
  timestamps: true,
  versionKey: false,
});

const Model = model('telegrams', schema);

export default Model;
