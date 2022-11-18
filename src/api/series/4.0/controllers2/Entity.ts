import { Request, Response } from "express";
import * as HistoryService from 'api/global/1.0/services/HistoryService';
import * as Service from '../services/EntitiesService';
import * as ListsService from '../services/ListsService';
import * as utils from 'lib/misc';
import { default as P } from "bluebird";

export async function movieGet(req: Request, res: Response): P<any> {
  const data = await Service.entityGet( { id: req.params.id  } );
  utils.writeJSON(res, data);
};

export async function tvShowGet(req: Request, res: Response): P<any> {
  const data = await Service.entityGet( { id: req.params.id  } );
  if(data != null) HistoryService.addTVShow(req, req.params.id)
  utils.writeJSON(res, data);
};

export async function videoGameGet(req: Request, res: Response): P<any> {
  const data = await Service.entityGet( { id: req.params.id  } );
  utils.writeJSON(res, data);
};

export async function moviesGet(req: Request, res: Response): P<any> {
  const data = await Service.entitiesGet( req.query, "movie" );
  utils.writeJSON(res, data);
};

export async function tvShowsListGet(req: Request, res: Response): P<any> {
  const list = req.params.list
  const limit = req.query['limit'] ?? 10
  const page = req.query['page'] ?? 1
  const shuffle = req.query?.['shuffle'] ?? "true"

  var data;
  switch (list){
    case "user_recent":
      data = await HistoryService.getListItems( list, page, limit, req );
      break;
    default:
      data = await ListsService.getListItems( list, page, limit, shuffle == "true" );
  }

  utils.writeJSON(res, data);
};

export async function tvShowsGet(req: Request, res: Response): P<any> {
  const data = await Service.entitiesGet( req.query, "tvShow" );
  utils.writeJSON(res, data);
};

export async function videoGamesGet(req: Request, res: Response): P<any> {
  const data = await Service.entitiesGet( req.query, "videoGame" );
  utils.writeJSON(res, data);
};

