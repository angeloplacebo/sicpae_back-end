import { Response, Request } from 'express';

import recordService from '../services/recordService';

const PageOptions = (req: Request) => {
  return {
    page: parseInt(req.query.page as string, 10) -1 || 0,
    limit: parseInt(req.query.limit as string, 10) || 10
  }
}

const RecordController = {

  async create(req: Request, res: Response){
    try {
      let records = await recordService.create(req.body)
      return res.status(201).json(records)
    }catch (err) {
      return err
    }
  },

  async getCurrent(req: Request, res: Response){
    try {
      let record = await recordService.getCurrent()
      return res.status(200).json(record)
    }catch (err) {
      return err
    }
  },

  async getAll(req: Request, res: Response){
    try {
      let pagination = PageOptions(req)
      let records = await recordService.getAll(pagination)
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  },

  async today(req: Request, res: Response){
    try {
      let records = await recordService.today()
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  },

  async getDay(req: Request, res: Response){
    try {
      if (!req.query.date) return res.status(400).json({message: 'Invalid date'})
      let date = new Date(req.query.date + " 00:00:00")
      let records = await recordService.getDay(date)
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  },

  async getDayDetails(req: Request, res: Response){
    try {
      if (!req.query.date) return res.status(400).json({message: 'Invalid date'})
      let date = new Date(req.query.date + " 00:00:00")
      let records = await recordService.getDayDetails(date)
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  },

  async getMonth(req: Request, res: Response){
    try {
      if (!req.query.date) return res.status(400).json({message: 'Invalid date'})
      let date = new Date(req.query.date+" 00:00:00")
      let records = await recordService.getMonth(date)
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  },

  async getMonthDetails(req: Request, res: Response){
    try {
      if (!req.query.date) return res.status(400).json({message: 'Invalid date'})
      let date = new Date(req.query.date+" 00:00:00")
      let records = await recordService.getMonthDetails(date)
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  },

  async getYear(req: Request, res: Response){
    try {
      if (!req.query.date) return res.status(400).json({message: 'Invalid date'})
      let date = new Date(req.query.date+" 00:00:00")
      let records = await recordService.getYear(date)
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  },

  async getYearDetails(req: Request, res: Response){
    try {
      if (!req.query.date) return res.status(400).json({message: 'Invalid date'})
      let date = new Date(req.query.date+" 00:00:00")
      let records = await recordService.getYearDetails(date)
      return res.status(200).json(records)
    }catch (err) {
      return err
    }
  }
}

export default RecordController