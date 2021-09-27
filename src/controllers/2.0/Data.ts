import { Request, Response } from "express";
import * as Service from '../../services/StoriesService';
import * as utils from '../../lib/misc';
import { default as P } from "bluebird";

export async function oscarsGet(req: Request, res: Response): P<any> {
  const data = await Service.oscarsGet( {} );
  utils.writeJSON(res, data);
};
