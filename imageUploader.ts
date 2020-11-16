"use strict";
import AWS = require("aws-sdk");
import uuid = require("uuid/v4");
import Jimp = require("jimp");
import { parser as formParser } from "./formParser";
const s3: any = new AWS.S3();

const bucket: string = process.env.Bucket!;
const MAX_SIZE: number = 4500000; // 4MB

const PNG_MIME_TYPE: string = "image/png";
const JPEG_MIME_TYPE: string = "image/jpeg";
const JPG_MIME_TYPE: string = "image/jpg";

const MIME_TYPES = [PNG_MIME_TYPE, JPEG_MIME_TYPE, JPG_MIME_TYPE];

module.exports.handler = async (event) => {
  try {
    const formData: any = await (formParser as any).parser(event, MAX_SIZE);
    const file: any = formData.files[0];

    if (!isAllowedFile(file.content.byteLength, file.contentType))
      getErrorMessage("File size or type not allowed");

    const uid: string = uuid();

    const originalKey: string = `${uid}_original_${file.filename}`;
    const thumbnailKey: string = `${uid}_thumbnail_${file.filename}`;

    const fileResizedBuffer: any = await resize(
      file.content,
      file.contentType,
      460
    );

    const [originalFile, thumbnailFile]: any = await Promise.all([
      uploadToS3(bucket, originalKey, file.content, file.contentType),
      uploadToS3(bucket, thumbnailKey, fileResizedBuffer, file.contentType),
    ]);

    const signedOriginalUrl: any = s3.getSignedUrl("getObject", {
      Bucket: originalFile.Bucket,
      Key: originalKey,
      Expires: 60000,
    });

    const signedThumbnailUrl: any = s3.getSignedUrl("getObject", {
      Bucket: thumbnailFile.Bucket,
      Key: thumbnailKey,
      Expires: 60000,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: uid,
        mimeType: file.contentType,
        originalKey: originalFile.key,
        thumbnailKey: thumbnailFile.key,
        bucket: originalFile.Bucket,
        fileName: file.filename,
        originalUrl: signedOriginalUrl,
        thumbnailUrl: signedThumbnailUrl,
        originalSize: file.content.byteLength,
      }),
    };
  } catch (e) {
    return getErrorMessage(e.message);
  }
};

const getErrorMessage = (message: any) => ({
  statusCode: 500,
  body: JSON.stringify({
    message,
  }),
});

const isAllowedSize = (size: number) => size <= MAX_SIZE;

const isAllowedMimeType = (mimeType: string) =>
  MIME_TYPES.find((type: string) => type === mimeType);

const isAllowedFile = (size, mimeType) =>
  isAllowedSize(size) && isAllowedMimeType(mimeType);

const uploadToS3 = (bucket: string, key: string, buffer: any, mimeType: any) =>
  new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      },
      function (err, data) {
        if (err) reject(err);
        resolve(data);
      }
    );
  });

const resize = (buffer: any, mimeType: any, width: number) =>
  new Promise((resolve, reject) => {
    Jimp.read(buffer)
      .then((image) =>
        image.resize(width, Jimp.AUTO).quality(70).getBufferAsync(mimeType)
      )
      .then((resizedBuffer) => resolve(resizedBuffer))
      .catch((error) => reject(error));
  });
