import Busboy = require("busboy");

export const parser = (event: any, fileSize: any) =>
  new Promise((resolve, reject) => {
    const busboy: any = new Busboy({
      headers: {
        "content-type":
          event.headers["content-type"] || event.headers["Content-Type"],
      },
      limits: {
        fileSize,
      },
    });
    const result: any = {
      files: [],
    };
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const uploadFile: any = {};
      file.on("data", (data) => {
        uploadFile.content = data;
      });
      file.on("end", () => {
        if (uploadFile.content) {
          uploadFile.filename = filename;
          uploadFile.contentType = mimetype;
          uploadFile.encoding = encoding;
          uploadFile.fieldname = fieldname;
          result.files.push(uploadFile);
        }
      });
    });
    busboy.on("field", (fieldname, value) => {
      result[fieldname] = value;
    });
    busboy.on("error", (error) => {
      reject(error);
    });
    busboy.on("finish", () => {
      resolve(result);
    });
    busboy.write(event.body, event.isBase64Encoded ? "base64" : "binary");
    busboy.end();
  });
