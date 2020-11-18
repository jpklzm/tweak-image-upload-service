# Upload binary image with serverless

This project is an implementation of an image uploader in serverless with aws provider.

## Requirements

To be able to run this project, `aws-cli` must be installed and a profile must be configured (read https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html for further information)

## Deploy

In order to deploy the endpoint, simply run:

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Compiling with Typescript...
Serverless: Typescript compiled.
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
........
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service file-UploaderService-tweak.zip file to S3 (10.02 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
....................................
Serverless: Stack update finished...
Service Information
service: file-UploaderService-tweak
region: us-east-1
stack: imageUploader
resources: 13
api keys:
  None
endpoints:
  POST - https://pchtgrwmid.execute-api.us-east-1.amazonaws.com/test/upload
functions:
  UploadImage: file-UploaderService-tweak-test-UploadImage
layers:
  None
```

## Usage

At the end of the deployment, the url of our service will be displayed. I've tested it using postman, as shown in the image.

![postman request](https://res.cloudinary.com/practicaldev/image/fetch/s--cA5q2YHA--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/dwhaxx0cxvtkny1h1ub6.png)

If the image uploading was successful, the service will return a JSON, with the information of the processed image, such as the key, the name, the url of the original file and the thumbnail.
