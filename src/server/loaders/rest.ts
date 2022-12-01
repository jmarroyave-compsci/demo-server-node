import * as fs from 'fs'
import log from 'common/log';
import config from 'common/config';
import express from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { default as P }  from "bluebird";
import * as utils from '../lib/misc';
import { Request, Response } from "express";
import { getServices, loadClass, classExists } from 'common/files'

export const loadREST = async function(app){
    log.info("LOADING REST ROUTES")
    const router = express.Router();

    const loadSpecs = async function ( service ) {
        const routesEndpointsPath = `${service.versionPath}/ports/rest/`
        log.info(routesEndpointsPath)
        if( !classExists(routesEndpointsPath) ) {
            log.info(`     SKIPPING: SPECS FILE NOT FOUND`);
            return
        }

        const endpoints = (await loadClass(routesEndpointsPath)).default
        if(config.LOCAL){
            updateJSONRoutes(routesEndpointsPath, endpoints)    
        }
        for( const endpoint of Object.keys(endpoints).sort().reverse()){
            const routeEndpoint = `/${service.name}/${service.version}/${endpoint}`.replace("//", "/")
            log.info(`     - ${routeEndpoint}`);

            if( endpoints[endpoint] == null ) continue

            const handler = ( endpoints[endpoint]['handler'] ) ? endpoints[endpoint]['handler'] : endpoints[endpoint]
            const contentType = ( endpoints[endpoint]['contentType'] ) ? endpoints[endpoint]['contentType'] : "application/json"

            switch(contentType){
                case "application/json":
                    router.use(routeEndpoint, asyncHandler( async function( req: Request, res: Response ): P<any>{
                        const session = req?.['session'] ?? { id: 1 }
                        log.info(`> ${routeEndpoint} | qry: ${ JSON.stringify(req.query) } | params: ${JSON.stringify(req.params)} | session: ${JSON.stringify(session)}`);
                        const data = await handler( req.query, req.params, session )
                        utils.writeJSON(res, data);
                    }, endpoint));
                    break;
                case "text/plain":
                    router.use(routeEndpoint, asyncHandler( async function( req: Request, res: Response ): P<any>{
                        const session = req?.['session'] ?? { id: 1 }
                        const data = await handler( req.query, req.params, session )
                        res.set('content-type', contentType);
                        res.send(data)
                    }, endpoint));
                    break;                
            }
        }
    }

    for( const service of getServices()){
        log.info(`  SERVICE: ${service.name} v.${service.version}`);
        await loadSpecs( service )   
    }

    app.use('/', router);
}

function updateJSONRoutes( path, endpoints ){
    console.log("updating JSON routes")
    const data = Object.keys(endpoints).map( k => k )
    path = `${path}/routes.txt`
    if(fs.existsSync(path)) return
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}
