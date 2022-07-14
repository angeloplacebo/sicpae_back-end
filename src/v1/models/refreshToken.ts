import mongoose,{ Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string,
  active: boolean,
}

const RefreshTokenSchema = new Schema({
  token:{
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  }
},{timestamps: {createdAt: true, updatedAt: false}, versionKey: false})


const RefreshToken = mongoose.model<IRefreshToken>('Refresh_Token',RefreshTokenSchema)

export default RefreshToken