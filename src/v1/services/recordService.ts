import Record from '../models/record'
import { DwRecordDayService } from './DwService'

interface RecordParams {
  detection_time: Date,
  c_in: number,
  h_in: number,
  h_out: number,
  t_in: number,
  t_out: number
}

interface RecordData {
  c_in: number,
  h_in: number,
  h_out: number,
  t_in: number,
  t_out: number
}

interface PageOptions {
  page: number,
  limit: number
}

function getDateInfo(date: Date){

  let current_date = new Date()
  let last_valid = new Date(date.getFullYear(), date.getMonth()+1, 0)

  let last_month = last_valid.getMonth()
  let last_day = last_valid.getDate()

  if (date.getMonth() === current_date.getMonth()) {
    last_day = current_date.getDate()
  }

  if (date.getFullYear() === current_date.getFullYear()) {
    last_month = current_date.getMonth()
  }

  return {
    year: date.getFullYear(),
    last_month,
    last_day
  }

}

async function getMonth(date: Date){
  try {

    let media = {
      "c_in" : null,
      "h_in": null,
      "h_out": null,
      "t_in": null,
      "t_out": null
    }

    let ndays = getDateInfo(date).last_day
    let qty = 0

    for(let i = 1; i <= ndays; i++){
      let day = new Date(date.getFullYear(), date.getMonth(), i);
      let data = await getDayMedia(day)
      if(data.length){
        media.c_in += data[0].c_in
        media.h_in += data[0].h_in
        media.h_out += data[0].h_out
        media.t_in += data[0].t_in
        media.t_out += data[0].t_out
        qty += 1
      }
    }

    return [{
      "c_in": Math.round(media.c_in / qty),
      "h_in": Math.round(media.h_in / qty),
      "h_out": Math.round(media.h_out / qty),
      "t_in": media.t_in,
      "t_out": media.t_out
    }]

  }catch (err) {
    return err
  }
}

async function getMonthDetailed(date: Date){
    let ndays = getDateInfo(date).last_day

    let result = {}

    for(let i = 1; i <= ndays; i++){
      let day = new Date(date.getFullYear(), date.getMonth(), i);
      day.setHours(0, 0, 0, 0)

      let data = await getDayMedia(day)
      result[day.toISOString().split('T')[0]] = data[0] || null
    }

    return result
}

async function getDayMedia(date: Date){
  try {

    let media = {
      "c_in" : null,
      "h_in": null,
      "h_out": null,
      "t_in": null,
      "t_out": null
    }
    console.log("getting data from "+date.toLocaleDateString())

    let record = await DwRecordDayService.getByDate(date)
    if (record) {
      console.log("found on dw!")
      return [{
        "c_in": record.c_in,
        "h_in": record.h_in,
        "h_out":record.h_out,
        "t_in": record.t_in,
        "t_out":record.t_out
      }]  
    } else {
      console.log("processing now...")
      let data = await getHourMedia(date, 0, 23)
      let records = data.filter(record => record)
      let qty = records.length

      records.forEach((record: RecordData) => {
        media.c_in += record.c_in
        media.h_in += record.h_in
        media.h_out += record.h_out
      })

      let last_record = records[records.length-1]
      let media_data = {
        "c_in": Math.round(media.c_in / qty),
        "h_in": Math.round(media.h_in / qty),
        "h_out": Math.round(media.h_out / qty),
        "t_in": (last_record || {}).t_in || NaN,
        "t_out": (last_record || {}).t_out || NaN
      }

      DwRecordDayService.create({date: date, ...media_data})
      return [media_data]
    }

  }catch (err) {
    return err
  }
}

async function getHourMedia(date: Date, start_hour: number, end_hour: number){
  try {

    let startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let endOfDate = new Date(startOfDate.getTime())

    let media = []

    for(let i = start_hour; i<=end_hour; i++){

      startOfDate.setHours(i, 0, 0, 0)
      endOfDate.setHours(i+1, 0, 0, 0)

      let data = await getMedia(startOfDate, endOfDate)
      media.push(data)

    }
    return media
  }catch (err) {
    return err
  }
}

async function getDayDetailed(date: Date, start_hour: number, end_hour: number){
  try {
    let data = await getHourMedia(date, start_hour, end_hour)
    let media = {}
    for (let i = start_hour; i <= end_hour; i++){
      date.setHours(i, 0, 0, 0)
      media[date.toLocaleString()] = data[i]
    }
    return media

  }catch (err) {
    return err
  }
}

async function getMedia(start: Date, end: Date){
  let records = await Record.find({ detection_time: {
    $gte: start,
    $lte: end
  }}).sort({ 'detection_time': "asc"});

  let qty = records.length

  if (qty == 0) return null

  let data = {
    "c_in" : null,
    "h_in": null,
    "h_out": null,
    "t_in": null,
    "t_out": null
  }

  records.forEach((record) => {
    data.c_in += record.c_in
    data.h_in += record.h_in
    data.h_out += record.h_out
  })

  let last_record = records[records.length-1]
  return {
    "c_in": Math.round(data.c_in / qty),
    "h_in": Math.round(data.h_in / qty),
    "h_out": Math.round(data.h_out / qty),
    "t_in": last_record.t_in,
    "t_out": last_record.t_out
  }

}

async function getLastFromDate(date: Date){
  try {
    let start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let end = new Date(start.getTime())
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 59)
    let record = await Record.findOne({ detection_time: {
      $gte: start,
      $lte: end
    }}).sort({ 'detection_time': "desc"});
    return record || {}
  }catch (err) {
    return err
  }
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

  async getAll(pageOptions: PageOptions){
    try {
      let records = await Record
        .find()
        .sort({ 'createdAt': "asc"})
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        
      return records
    }catch (err) {
      return err
    }
  },

  async getCurrent(){
    try {
      let now = new Date();
      let record = await getLastFromDate(now)
      return record
    }catch (err) {
      return err
    }
  },

  async today(){
    try {
      let now = new Date();
      let records = await getDayDetailed(now, 0, now.getHours())
      return records
    }catch (err) {
      return err
    }
  },

  async getDay(date: Date){
    try {
      let record = await getDayMedia(date)
      return record[0]
    }catch (err) {
      return err
    }
  },

  async getDayDetails(date: Date){
    try {
      let records = await getDayDetailed(date, 0, 23)
      return records
    }catch (err) {
      return err
    }
  },

  async getMonth(date: Date){
    let data = await getMonth(date)
    return data[0]
  },

  async getMonthDetails(date: Date){
    let data = await getMonthDetailed(date)
    return data
  },

  async getYear(date: Date){

    let data = {}
    let date_info = getDateInfo(date)
    
    let months = {}
    for (let i = 0; i <= date_info.last_month; i++){
      date.setMonth(i)
      let month_data = await getMonth(date)
      months[i+1] = month_data[0]
    }

    data[date_info.year] = months

    return data
  },

  async getYearDetails(date: Date){

    let data = {}
    let date_info = getDateInfo(date)

    let months = {}
    for (let i = 0; i <= date_info.last_month; i++){
      date.setMonth(i)
      let month_data = await getMonthDetailed(date)

      let days_data = {}
      Object.keys(month_data).forEach( (key) => {
        let day_number = key.split('-')[2]
        days_data[day_number] = month_data[key]
      })

      months[i+1] = days_data
    }

    data[date_info.year] = months

    return data
  }

}

export default recordService