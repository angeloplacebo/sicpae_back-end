import { Response, Request } from 'express';

import recordService from '../services/recordService';

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