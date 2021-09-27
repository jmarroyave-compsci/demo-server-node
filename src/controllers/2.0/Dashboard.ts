import { Request, Response } from "express";
import * as Service from '../../services/DashboardService';
import * as utils from '../../lib/misc';
import { default as P } from "bluebird";

export async function dashboardHomeGet(req: Request, res: Response): P<any> {
  const data = await Service.dashboardHomeGet( {} );
  utils.writeJSON(res, data);
};

export async function dashboardMoviesGet(req: Request, res: Response): P<any> {
  const data = await Service.dashboardMoviesGet( {} );
  utils.writeJSON(res, data);
};

export async function dashboardPodcastsGet(req: Request, res: Response): P<any> {
  const data = await Service.dashboardPodcastsGet( {} );
  utils.writeJSON(res, data);
};

export async function dashboardPeopleGet(req: Request, res: Response): P<any> {
  const data = await Service.dashboardPeopleGet( {} );
  utils.writeJSON(res, data);
};
