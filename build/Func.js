"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrayLast = exports.readFile = exports.writeFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/** write data to json file */
function writeFile(filePath, content) {
    const __filePath = path_1.default.resolve(__dirname, filePath);
    fs_1.default.writeFileSync(__filePath, content);
}
exports.writeFile = writeFile;
/** Read the content of the json file  */
function readFile(filePath) {
    const __filePath = path_1.default.resolve(__dirname, filePath);
    if (fs_1.default.existsSync(__filePath)) {
        return JSON.parse(fs_1.default.readFileSync(__filePath, 'utf-8'));
    }
    return [];
}
exports.readFile = readFile;
function getArrayLast(data) {
    if (data.slice(-1)[0]['childs'].length == 0) {
        return data.slice(-1);
    }
    return getArrayLast(data.slice(-1)[0]['childs']);
}
exports.getArrayLast = getArrayLast;
