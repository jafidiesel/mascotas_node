"use strict";

import * as express from "express";
import * as error from "../server/error";
import { onlyLoggedIn } from "../token/passport";
import { ISessionRequest } from "../user/service";
import * as service from "./service";

/**
 * Modulo de mascotas de usuario
 */
export function initModule(app: express.Express) {
  // Rutas de acceso a mascotas
  app
    .route("/v1/pet")
    .get(onlyLoggedIn, findByCurrentUser)
    .post(onlyLoggedIn, create);

  app
    .route("/v1/pet/:petId")
    .get(onlyLoggedIn, readById)
    .post(onlyLoggedIn, updateById)
    .delete(onlyLoggedIn, removeById);
  app
	.route("/v1/pet/nft/:nftId")
	.get(onlyLoggedIn, readByNFTId);
}


/**
 * @api {get} /v1/pet Listar Mascota
 * @apiName Listar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Obtiene un listado de las mascotas del usuario actual.
 *
 * @apiSuccessExample {json} Mascota
 *  [
 *    {
 *      "id": "Id de mascota"
 *      "name": "Nombre de la mascota",
 *      "description": "Descripción de la mascota",
 *      "birthDate": date (DD/MM/YYYY),
 * 		"nftId": "id del NFT",
 * 		"ownerName": "Nombre del dueño de la mascota",
 * 		"ownerId": "documento identificatorio de la persona"
 *    }, ...
 *  ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */
async function findByCurrentUser(req: ISessionRequest, res: express.Response) {
  const result = await service.findByCurrentUser(req.user.user_id);
  res.json(result.map(u => {
    return {
      id: u.id,
      name: u.name,
      description: u.description,
      birthDate: u.birthDate,
      nftId: u.nftId,
      ownerName: u.ownerName,
      ownerId: u.ownerId
    };
  }));
}

/**
 * @apiDefine IMascotaResponse
 *
 * @apiSuccessExample {json} Mascota
 *    {
 *      "id": "Id de mascota",
 *      "name": "Nombre de la mascota",
 *      "description": "Descripción de la mascota",
 *      "birthDate": date (DD/MM/YYYY),
 *		"nftId": "id del NFT",
 * 		"ownerName": "Nombre del dueño de la mascota",
 * 		"ownerId": "documento identificatorio de la persona"
 *    }
 */

/**
 * @api {post} /v1/pet Crear Mascota
 * @apiName Crear Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Crea una mascota.
 *
 * @apiExample {json} Mascota
 *    {
 *      "id": "Id mascota"
 *    }
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function create(req: ISessionRequest, res: express.Response) {
  const result = await service.update(undefined, req.user.user_id, req.body);
  res.json({
    id: result.id
  });
}


/**
 * @api {get} /v1/pet/:petId Buscar Mascota
 * @apiName Buscar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Busca una mascota por id.
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function readById(req: ISessionRequest, res: express.Response) {
  const result = await service.findById(req.user.user_id, req.params.petId);
  res.json({
    id: result.id,
    name: result.name,
    description: result.description,
    birthDate: result.birthDate,
    nftId: result.nftId,
    ownerName: result.ownerName,
    ownerId: result.ownerId
  });
}

/**
 * @api {get} /v1/pet/nft/:nftId Buscar Mascota por nftId
 * @apiName Buscar Mascota por nftId
 * @apiGroup Mascotas
 *
 * @apiDescription Busca una mascota por nftId
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
 async function readByNFTId(req: ISessionRequest, res: express.Response) {
	const result = await service.findByNFTId(req.user.user_id, req.params.nftId);
	res.json({
	  id: result.id,
	  name: result.name,
	  description: result.description,
	  birthDate: result.birthDate,
	  nftId: result.nftId,
	  ownerName: result.ownerName,
	  ownerId: result.ownerId
	});
  }

/**
 * @api {post} /v1/pet/:petId Actualizar Mascota
 * @apiName Actualizar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Actualiza los datos de una mascota.
 *
 * @apiExample {json} Mascota
 *    {
 *      "id": "Id de mascota",
 *      "name": "Nombre de la mascota",
 *      "description": "Description de la mascota",
 *      "birthDate": date (DD/MM/YYYY),
 * 		"nftId": "id del NFT",
 * 		"ownerName": "Nombre del dueño de la mascota",
 * 		"ownerId": "documento identificatorio de la persona"
 *    }
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function updateById(req: ISessionRequest, res: express.Response) {
  const result = await service.update(req.params.petId, req.user.user_id, req.body);
  res.json({
    id: result.id,
    name: result.name,
    description: result.description,
    birthDate: result.birthDate,
    ownerName: result.ownerName,
    ownerId: result.ownerId
  });
}

/**
 * @api {delete} /v1/pet/:petId Eliminar Mascota
 * @apiName Eliminar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Eliminar una mascota.
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */

async function removeById(req: ISessionRequest, res: express.Response) {
  await service.remove(req.user.user_id, req.params.petId);
  res.send();
}