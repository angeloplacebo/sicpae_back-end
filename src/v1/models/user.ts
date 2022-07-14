import mongoose,{ Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string,
  password: string,
  refreshToken: boolean,
  admin: boolean
}

const UserSchema = new Schema({
  username:{
    type: String,
    required: true,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min:6,
    select: false
  },
  refreshToken: {
    type: Boolean,
    default:false,
    select: false
  },
  admin: {
    type: Boolean,
    default: false,
    select: false
  }
},{timestamps: {createdAt: true, updatedAt: true}, versionKey: false})

UserSchema.pre('save', async function(next) {

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(this.password, salt)
  
  this.password = hashPassword

  next()
})

const User = mongoose.model<IUser>('User',UserSchema)

export default User