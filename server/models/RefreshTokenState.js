import { Schema, model } from 'mongoose';

const refreshTokenStateSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  currentRefreshTokenJti: {
    type: String,
    default: null,
  },
  revokedAt: {
    type: Date,
    default: null,
  },
  compromisedAt: {
    type: Date,
    default: null,
  },
  lastRotatedAt: {
    type: Date,
    default: null,
  },
}, {
  versionKey: false,
  timestamps: true,
});

const RefreshTokenState = model('RefreshTokenState', refreshTokenStateSchema);

export default RefreshTokenState;
