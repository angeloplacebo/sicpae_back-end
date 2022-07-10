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

}

export default RecordController