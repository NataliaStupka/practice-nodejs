import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnv(ENV_VARS.CLOUDINARY_CLOUD_NAME),
  api_key: getEnv(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: getEnv(ENV_VARS.CLOUDINARY_API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  //   const response = await cloudinary.v2.uploader.upload(file.path);
  //   await fs.unlink(file.path);
  //   return response.secure_url;

  try {
    const response = await cloudinary.v2.uploader.upload(file.path);

    return response.secure_url;
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Failed to upload an image to cloudinary');
  } finally {
    console.log('File.path_aveFileToCloudinary', file.path);
    await fs.unlink(file.path); //видаляємо з локального місця
  }
};
