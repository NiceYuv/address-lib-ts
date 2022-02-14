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
const Requests_1 = __importDefault(require("../Common/Requests"));
const ProvinceAnalyzer_1 = __importDefault(require("./ProvinceAnalyzer"));
const CityAnalyzer_1 = __importDefault(require("./CityAnalyzer"));
const VillagetrAnalyzer_1 = __importDefault(require("./VillagetrAnalyzer"));
const Func_1 = require("../Common/Func");
class Child {
    constructor(url, urlPath, fileDir) {
        this.url = url;
        this.urlPath = urlPath;
        this.fileDir = fileDir;
        this.level = 1;
        this.cityId = 1;
        this.filePath = '';
        this.className = '';
        this.data = [];
        this.startProcess();
    }
    /** 开启进程 */
    startProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            Child.requests = Requests_1.default.getInstance();
            const content = [
                ['_', '.provincetr', ProvinceAnalyzer_1.default.getInstance()],
                ['__', '.citytr', CityAnalyzer_1.default.getInstance()],
                ['___', '.countytr', CityAnalyzer_1.default.getInstance()],
                ['____', '.towntr', CityAnalyzer_1.default.getInstance()],
                ['_____', '.villagetr', VillagetrAnalyzer_1.default.getInstance()]
            ];
            for (let i = 0; i < content.length; i++) {
                yield this.getAddress(i + 1, content[i][0], content[i][1], content[i][2]).commonProcessAction();
            }
        });
    }
    getAddress(level, fileName, className, analyzer) {
        this.level = level;
        this.filePath = this.fileDir + fileName + 'address.json';
        this.className = className;
        Child.analyzer = analyzer;
        return this;
    }
    /** 公共进程逻辑（1） - 读取文件 */
    commonProcessAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileInfo = (0, Func_1.readFile)(this.filePath);
            if (fileInfo.length !== 0) {
                this.data = fileInfo;
                this.cityId = (0, Func_1.getArrayLast)(fileInfo)[0]['id'];
                return;
            }
            yield this.commonParseAction();
        });
    }
    /** 公共进程逻辑（2） - 解析数组 */
    commonParseAction() {
        return __awaiter(this, void 0, void 0, function* () {
            let item = this.data;
            let url = this.url;
            let urlPath, parent, parents, parentStr = '';
            if (this.level > 1) {
                for (let i = 0; i < item.length; i++) {
                    parent = this.data[i]['child'] + '/';
                    urlPath = url + item[i]['child'] + '.html';
                    if (this.level > 2) {
                        for (let y = 0; y < item[i]['childs'].length; y++) {
                            urlPath = url + item[i]['childs'][y]['child'] + '.html';
                            if (this.level > 3) {
                                for (let k = 0; k < item[i]['childs'][y]['childs'].length; k++) {
                                    urlPath = url + parent + item[i]['childs'][y]['childs'][k]['child'] + '.html';
                                    if (this.level > 4) {
                                        for (let v = 0; v < item[i]['childs'][y]['childs'][k]['childs'].length; v++) {
                                            parentStr = this.data[i]['childs'][y]['childs'][k]['child'] + '';
                                            parents = parentStr.split("/")[0] + '/';
                                            urlPath = url + parent + parents + item[i]['childs'][y]['childs'][k]['childs'][v]['child'] + '.html';
                                            item[i]['childs'][y]['childs'][k]['childs'][v]['childs'] = yield this.commonToParser(urlPath);
                                        }
                                    }
                                    else {
                                        item[i]['childs'][y]['childs'][k]['childs'] = yield this.commonToParser(urlPath);
                                    }
                                }
                            }
                            else {
                                item[i]['childs'][y]['childs'] = yield this.commonToParser(urlPath);
                            }
                        }
                    }
                    else {
                        item[i]['childs'] = yield this.commonToParser(urlPath);
                    }
                }
            }
            else {
                item = yield this.commonToParser(this.url + this.urlPath);
            }
            this.data = item;
            yield (0, Func_1.writeFile)(this.filePath, JSON.stringify(item));
        });
    }
    /** 公共进程逻辑（3） - 将 html 内容放入解析器 */
    commonToParser(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield Child.requests.getWebHtml(url);
            const { id, data } = Child.analyzer.analyze(html, this.level, this.cityId, this.className);
            this.cityId = id;
            return data;
        });
    }
}
exports.default = Child;
