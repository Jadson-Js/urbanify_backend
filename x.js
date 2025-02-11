const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const aws = require("aws-sdk");
const stream = require("stream");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const s3 = new aws.S3({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "YOUR_REGION",
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const transformer = sharp().resize(800).jpeg({ quality: 80 });

    const pass = new stream.PassThrough();
    req.file.stream.pipe(transformer).pipe(pass);

    const uploadParams = {
      Bucket: "YOUR_BUCKET_NAME",
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: pass,
      ContentType: "image/jpeg",
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error uploading file");
      }
      res.status(200).send(`File uploaded successfully. ${data.Location}`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
