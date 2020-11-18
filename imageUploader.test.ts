import * as AWS_MOCK from "aws-sdk-mock";

jest.mock("aws-sdk");

describe("can upload an image to S3", () => {
  afterAll(() => {
    AWS_MOCK.restore("S3");
  });

  it("constructs an AWS sdk instance for upload", async () => {
    AWS_MOCK.mock("S3", "upload", (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property("Bucket", "TestBucket");
      params.should.have.property("Key");
      params.should.have.property("Body", "TestBuffer");

      callback(null, {
        ETag: 'SomeETag"',
        Location: "PublicWebsiteLink",
        Key: "RandomKey",
        Bucket: "TestBucket",
      });
    });
  });
});
