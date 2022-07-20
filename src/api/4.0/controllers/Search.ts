import { Request, Response } from "express";
import * as Service from 'v4/services/SearchService';
import * as HistoryService from 'api/global/services/HistoryService';
import * as utils from 'lib/misc';
import { default as P } from "bluebird";

export async function searchResultsGet(req: Request, res: Response): P<any> {
  const params = { qry: "", entities: [], page: null }
  params.qry = decodeURIComponent(req?.query?.qry.toString())
  params['entities'] = JSON.parse(decodeURIComponent(req?.query?.entities?.toString()))
  params.page = (req?.query?.page) ? req?.query?.page : 1;
  HistoryService.addSearched(req, params.qry)
   
  const data = await Service.searchResults( params );
  utils.writeJSON(res, data);
};


export async function searchSuggestionsGet(req: Request, res: Response): P<any> {
  const data = await Service.searchSuggestions( { qry: req.query.qry } );
  utils.writeJSON(res, data);
};
