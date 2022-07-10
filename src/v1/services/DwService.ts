import DwRecordDay from "../models/dwRecordDay";

interface DW_Records_Day{
  date: Date,
  c_in: number,
  h_in: number,
  h_out: number,
  t_in: number,
  t_out: number
}

const DwRecordDayService = {
  async create(day_params: DW_Records_Day) {
    Object.keys(day_params).forEach((key)=>{
      day_params[key] ||= -1
    })
    let dw_record = await DwRecordDay.create(day_params)
    return dw_record
  },

  async getAll(){
    let records = await DwRecordDay.find()
    return records
  },

  async getByDate(date: Date){

    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let end = new Date(start.getTime())

    start.setHours(0, 0, 0)
    end.setHours(23, 59, 59)

    let dw_record = await DwRecordDay.findOne({ date: {
      $gte: start,
      $lte: end
    }}).sort({ 'date': "asc"})

    if (!dw_record) return false
    let record = dw_record.toObject()
    Object.entries(record).map( ([key, value]) => ( record[key] = (value === -1) ? null : value))

    return record

  }
}

export {DwRecordDayService}