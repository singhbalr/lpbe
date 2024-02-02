// gkc_hash_code : 01EST23SHKBRP7F4R29V47FH94
const path = require("path");
const fs = require("fs");
const readChunk = require("read-chunk");
const fileType = require("file-type");
const AWS = require("aws-sdk");
const { findLastIndex } = require("ramda");

// Configs
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;
const DISTRIBUTIONID = process.env.AWS_CF_DISTRIBUTIONID;
const isOverwrite = false
// End Configs

const IMAGES = path.join(__dirname, "images");
const REMOTE_DIR = "files";

const getMineType = async (filePath) => {
  try {
    const buffer = await readChunk.sync(filePath, 0, 262);
    return await (await fileType.fromBuffer(buffer)).mime;
  } catch (error) {
    console.log("error");
    return null;
  }
};

const s3 = new AWS.S3({ region: REGION });
const cloudFront = new AWS.CloudFront({ region: REGION });

const cloudFrontClearCache = async (fileKeys) => {
  try {
    await cloudFront
      .createInvalidation({
        DistributionId: DISTRIBUTIONID,
        InvalidationBatch: {
          CallerReference: `${Date.now()}`,
          Paths: {
            Quantity: fileKeys.length,
            Items: fileKeys,
          },
        },
      })
      .promise();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const s3FileExits = async (fileKey) => {
  try {
    const { $response } = await s3
      .headObject({
        Bucket: BUCKET,
        Key: fileKey,
      })
      .promise();
    //console.log($response.data)
    return !!$response.data;
  } catch (error) {
    //console.log("error" , error)
  }
  return false;
};

const s3UploadFile = async (filePath, fileKey, fileMineType) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const { $response } = await s3
      .putObject({
        Bucket: BUCKET,
        Key: fileKey,
        ACL: "public-read",
        ContentType: fileMineType,
        Body: fileStream,
      })
      .promise();
    fileStream.close();
    return true;
  } catch (error) {
    //console.log('upload error ' + error.message)
    return false;
  }
};

(async () => {
  console.log(`Start Sync to S3 with isOverwrite: ${isOverwrite}`);

  const files = fs.readdirSync(IMAGES);
  const length = files.length;
  const listCleanCache = [];
  for (var i = 0; i < length; i++) {
    const file = files[i];
    if (file != ".DS_Store") {
      const fileKey = `${REMOTE_DIR}/${file}`;
      const filePath = path.join(IMAGES, file);
      const fileExits = await s3FileExits(fileKey);
      if (!fileExits || isOverwrite) {
        const fileMineType = await getMineType(filePath);
        const isUpload = await s3UploadFile(filePath, fileKey, fileMineType);
        console.log(`File ${file} uploaded: ${isUpload}`);
      } else {
        console.log(`File ${file} exited`);
      }
      if (isOverwrite && fileExits) {
        listCleanCache.push(`/${fileKey}`);
      }
      //console.log("File: " + file + " " + (await getMineType(filePath)));
    }
  }

  // Clear cache
  if (listCleanCache.length > 0) {
    const isOk = await cloudFrontClearCache(listCleanCache);
    console.log(`Clear cache cloudfront ${isOk}`);
  }
})();
