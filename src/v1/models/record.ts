import mongoose,{ Schema, Document, Model } from 'mongoose';

interface IRecord {
  detection_time: Date,
  c_in: number,
  h_in: number,
  h_out: number,
  t_in: number,
  t_out: number
}

interface IRecordDocument extends IRecord, Document {
  det_time: () => string
  created_at: () => string
}

interface IRecordModel extends Model<IRecordDocument> {
  
}

const recordSchema = new Schema({
  detection_time:{
    type: Date,
    trim: true,
    required: true
  },
  c_in: {
    type: Number,
    required: true
  },
  h_in: {
    type: Number,
    required: true
  },
  h_out: {
    type: Number,
    required: true
  },
  t_in: {
    type: Number,
    required: true
  },
  t_out: {
    type: Number,
    required: true
  }

},{timestamps: {createdAt: true, updatedAt: false}, versionKey: false})


recordSchema.methods.det_time = function() {
  return this.detection_time.toLocaleString()
}

recordSchema.methods.created_at = function() {
  return this.createdAt.toLocaleString()
}
const Record = mongoose.model<IRecordDocument, IRecordModel>('Record',recordSchema)

export default Record