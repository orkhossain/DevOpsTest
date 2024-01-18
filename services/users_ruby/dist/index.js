"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const url = (_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : "";
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
mongoose_1.default.Promise = global.Promise;
mongoose_1.default
    .connect(url)
    .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(process.env.PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.log(err);
});
app.get("/", (req, res) => {
    res.send(`⚡️[server]: Server is running at http://localhost:${port}`);
});
