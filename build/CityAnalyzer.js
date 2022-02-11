"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
class CityAnalyzer {
    constructor() { }
    static getInstance() {
        if (!CityAnalyzer.instance) {
            CityAnalyzer.instance = new CityAnalyzer();
        }
        return CityAnalyzer.instance;
    }
    getCityInfo(html, cityPid, cityId, className) {
        const $ = cheerio_1.default.load(html);
        const cityItems = $(className);
        const cityInfos = [];
        cityItems.map((index, element) => {
            const cityName = $(element).find('td:nth-child(2) a').html();
            if (cityName == null) {
                return;
            }
            const cityChild = $(element).find('td:nth-child(2) a').attr('href');
            cityInfos.push({
                id: cityId, pid: cityPid, name: cityName,
                level: 2, child: cityChild, childs: []
            });
            cityId++;
        });
        return {
            id: cityId,
            data: cityInfos
        };
    }
    analyze(html, cityPid, cityId, className) {
        return this.getCityInfo(html, cityPid, cityId, className);
    }
}
exports.default = CityAnalyzer;