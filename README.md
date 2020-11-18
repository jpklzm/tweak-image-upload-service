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
Serverless: Packaging service…
Serverless: Uploading CloudFormation file to S3…
Serverless: Uploading service .zip file to S3…
Serverless: Updating Stack…
Serverless: Checking Stack update progress…
...........................
Serverless: Stack update finished…

Service Information
service: serverless-simple-http-endpoint
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  GET - https://2e16njizla.execute-api.us-east-1.amazonaws.com/test/upload
functions:
  serverless-simple-http-endpoint-dev-currentTime: arn:aws:lambda:us-east-1:488110005556:function:serverless-simple-http-endpoint-dev-currentTime
```

## Usage

At the end of the deployment, the url of our service will be displayed. I've tested it using postman, as shown in the image.

![postman request](https://res.cloudinary.com/practicaldev/image/fetch/s--cA5q2YHA--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/dwhaxx0cxvtkny1h1ub6.png)

If the image uploading was successful, the service will return a JSON, with the information of the processed image, such as the key, the name, the url of the original file and the thumbnail.
