import mongoose,{ Schema, Document, Model } from 'mongoose';

interface IDwRecordDay {
  c_in: number,
  h_in: number,
  h_out: number,
  t_in: number,
  t_out: number
}

interface IDwRecordDayDocument extends IDwRecordDay, Document {
  date: () => string
  created_at: () => string
}

interface IDwRecordDayModel extends Model<IDwRecordDayDocument> {
  
}

const DwRecordDaySchema = new Schema({
  date:{
    type: Date,
    trim: true,
    required: true
  },
  c_in: {
    type: Number,
    required: true,
    default: -1
  },
  h_in: {
    type: Number,
    required: true,
    default: -1
  },
  h_out: {
    type: Number,
    required: true,
    default: -1
  },
  t_in: {
    type: Number,
    required: true,
    default: -1
  },
  t_out: {
    type: Number,
    required: true,
    default: -1
  }

},{timestamps: {createdAt: true, updatedAt: false}, versionKey: false})


DwRecordDaySchema.methods.created_at = function() {
  return this.createdAt.toLocaleString()
}
const DwRecordDay = mongoose.model<IDwRecordDayDocument, IDwRecordDayModel>('DW_Records_Day',DwRecordDaySchema)

export default DwRecordDay