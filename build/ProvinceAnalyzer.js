"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
class ProvinceAnalyzer {
    constructor() { }
    static getInstance() {
        if (!ProvinceAnalyzer.instance) {
            ProvinceAnalyzer.instance = new ProvinceAnalyzer();
        }
        return ProvinceAnalyzer.instance;
    }
    /** match data */
    getProvinceInfo(html, cityPid, cityId, className) {
        const $ = cheerio_1.default.load(html);
        const provinceItems = $(className);
        const provinceInfos = [];
        provinceItems.map((index, element) => {
            $(element).find('td').map((keys, tdElement) => {
                var _a;
                const provinceChild = $(tdElement).find('a').attr('href');
                const provinceName = (_a = $(tdElement).find('a').html()) === null || _a === void 0 ? void 0 : _a.replace('<br>', '');
                provinceInfos.push({
                    id: cityId, pid: cityPid, name: provinceName,
                    level: 1, child: provinceChild, childs: []
                });
                cityId++;
            });
        });
        return {
            id: cityId,
            data: provinceInfos
        };
    }
    analyze(html, cityPid, cityId, className) {
        return this.getProvinceInfo(html, cityPid, cityId, className);
    }
}
exports.default = ProvinceAnalyzer;
