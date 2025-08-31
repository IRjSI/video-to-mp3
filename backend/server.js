import express from "express"
import cors from "cors"
import { exec } from "child_process";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express()

app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.get("/", (req,res) => {
    res.send("Oll Korrect")
})

app.post("/conversion", upload.single("input"), (req,res) => {
    const inputPath = req.file.path
    const outputPath = "./uploads"

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true })
    }

    const outputFile = path.join(
        outputPath,
        path.parse(req.file.originalname).name + "-converted.mp3"
    );

    const ffmpegCommand = `ffmpeg -i "${inputPath}" -vn -acodec mp3 "${outputFile}"`

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "conversion failed", error });
        }

        res.download(outputFile, (err) => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).json({ message: "could not send file" });
            }

            fs.unlink(inputPath, () => {});
            fs.unlink(outputFile, () => {});
        });
    });
})

app.listen(3000, () => {
    console.log("ristening on 3000")
})