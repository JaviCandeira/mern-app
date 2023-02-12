import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postsRoutes from "./routes/posts.js";
import {register} from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users, posts} from "./data/index.js";
//Configs

const _filename = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_filename);
dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assets", express.static(path.join(_dirName, "public/assets")));

//Storage

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets")
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    },
});
const upload = multer ({storage});

// Routes with files

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
//Routes

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);
// Mongodb set up

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, ()=> console.log(`Server Port ${PORT}`));

    
}).catch((error) => console.log(`${error} did not connected`));