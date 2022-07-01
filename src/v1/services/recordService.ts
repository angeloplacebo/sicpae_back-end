import Record from '../models/record'

interface RecordParams {
  detection_time: Date,
  c_in: number,
  h_in: number,
  h_out: number,
  t_in: number,
  t_out: number
}

const recordService = {

  async create(recordParams: RecordParams){
    try {
      let records = await Record.create(recordParams)
      return records
    }catch (err) {
      return err
    }
  },


}

export default recordService