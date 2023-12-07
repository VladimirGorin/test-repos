require("dotenv").config({ path: "../modules/.env" });
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const Tesseract = require("tesseract.js");

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "database/images")));

const imagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "database/images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

async function getFilesInfo(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    const fileInfoArray = [];

    for (const file of files) {
      const fileStats = fs.statSync(path.join(directoryPath, file));
      const fileExtension = path.extname(file).toLowerCase();

      let rarity;
      let fileName;
      let text;

      try {
        const imageMetadata = await sharp(fileStats).metadata();
        rarity = extractRarityFromMetadata(imageMetadata);
        fileName = imageMetadata ? imageMetadata.name : file;
        
        // Чтение текста с использованием Tesseract.js
        text = await readTextFromImage(path.join(directoryPath, file));
      } catch (err) {
        console.error(`Ошибка при анализе изображения ${file}: ${err.message}`);
        rarity = "undefined";
        fileName = file;
        text = "undefined";
      }

      fileInfoArray.push({
        name: fileName,
        extension: fileExtension,
        size: fileStats.size,
        rarity: rarity,
        text: text,
      });
    }

    return fileInfoArray;
  } catch (err) {
    console.error("Ошибка чтения каталога:", err.message);
    return [];
  }
}

async function readTextFromImage(imagePath) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imagePath,
      "ru",
      {
        logger: (info) => {
          console.log(info);
        },
      }
    )
      .then(({ data: { text } }) => {
        resolve(text);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const imagesDirectory = path.join(__dirname, "database/images");
const imagesJsonPath = path.join(__dirname, "../db/images/images.json");

getFilesInfo(imagesDirectory)
  .then((filesInfo) => {
    fs.writeFileSync(imagesJsonPath, JSON.stringify(filesInfo, null, 2));
    console.log("images.json сохранен");
  })
  .catch((error) => {
    console.error(error);
  });

const uploadAvatar = multer({ storage: imagesStorage });

app.listen(8000, () => {
  console.log("server started on port 8000");
});