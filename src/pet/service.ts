"use strict";

import * as error from "../server/error";
import { IPet, Pet } from "./schema";
const mongoose = require("mongoose");

export async function findByCurrentUser(userId: string): Promise<Array<IPet>> {
  try {
    const result = await Pet.find({
      user: mongoose.Types.ObjectId(userId),
      enabled: true
    }).exec();
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function findById(userId: string, petId: string): Promise<IPet> {
  try {
    const result = await Pet.findOne({
      user: mongoose.Types.ObjectId(userId),
      _id: petId,
      enabled: true
    }).exec();
    if (!result) {
      throw error.ERROR_NOT_FOUND;
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function findByNFTId(userId: string, nftId: string): Promise<IPet> {
	try {
	  const result = await Pet.findOne({
		nftId: nftId,
		enabled: true
	  }).exec();
	  if (!result) {
		throw error.ERROR_NOT_FOUND;
	  }
	  return Promise.resolve(result);
	} catch (err) {
	  return Promise.reject(err);
	}
  }

async function validateUpdate(body: IPet): Promise<IPet> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };

  if (body.name && body.name.length > 256) {
    result.messages.push({ path: "name", message: "Hasta 256 caracteres solamente." });
  }

  if (body.description && body.description.length > 1024) {
    result.messages.push({ path: "description", message: "Hasta 2014 caracteres solamente." });
  }

  if (!body.nftId && body.nftId.length > 100) {
    result.messages.push({ path: "nftId", message: "Hasta 100 caracteres solamente." });
  }

  if (!body.nftId && body.ownerName.length > 100) {
    result.messages.push({ path: "ownerName", message: "Hasta 100 caracteres solamente." });
  }

  if (!body.ownerId && body.ownerId.length > 100) {
    result.messages.push({ path: "ownerId", message: "Hasta 100 caracteres solamente." });
  }

  if (result.messages.length > 0) {
    return Promise.reject(result);
  }

  return Promise.resolve(body);
}

export async function update(petId: string, userId: string, body: IPet): Promise<IPet> {
  try {
    let current: IPet;
    if (petId) {
      current = await Pet.findById(petId);
      if (!current) {
        throw error.ERROR_NOT_FOUND;
      }
    } else {
      current = new Pet();
      current.user = mongoose.Types.ObjectId.createFromHexString(userId);
    }

    const validBody = await validateUpdate(body);
    if (validBody.name) {
      current.name = validBody.name;
    }
    if (validBody.description) {
      current.description = validBody.description;
    }
    if (validBody.birthDate) {
      current.birthDate = validBody.birthDate;
    }
    if (validBody.nftId) {
      current.nftId = validBody.nftId;
    }
    if (validBody.ownerName) {
      current.ownerName = validBody.ownerName;
    }
    if (validBody.ownerId) {
      current.ownerId = validBody.ownerId;
    }

    await current.save();
    return Promise.resolve(current);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function remove(userId: string, petId: string): Promise<void> {
  try {
    const pet = await Pet.findOne({
      user: mongoose.Types.ObjectId(userId),
      _id: petId,
      enabled: true
    }).exec();
    if (!pet) {
      throw error.ERROR_NOT_FOUND;
    }
    pet.enabled = false;
    await pet.save();
  } catch (err) {
    return Promise.reject(err);
  }
}
