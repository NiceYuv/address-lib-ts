"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
class Requests {
    constructor() { }
    static getInstance() {
        if (!Requests.instance) {
            Requests.instance = new Requests();
        }
        return Requests.instance;
    }
    /** Get html source code from remote address */
    getWebHtml(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield superagent_1.default.get(url)
                .timeout({
                response: 5000,
                deadline: 60000, // 但允许文件用 1 分钟完成加载。
            })
                .retry(3);
            return result.text;
        });
    }
}
exports.default = Requests;
