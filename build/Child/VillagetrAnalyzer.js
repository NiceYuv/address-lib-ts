"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
class VillagetrAnalyzer {
    constructor() { }
    static getInstance() {
        if (!VillagetrAnalyzer.instance) {
            VillagetrAnalyzer.instance = new VillagetrAnalyzer();
        }
        return VillagetrAnalyzer.instance;
    }
    getCityInfo(html, cityPid, cityId, className) {
        const $ = cheerio_1.default.load(html);
        const cityItems = $(className);
        const cityInfos = [];
        cityItems.map((index, element) => {
            let cityChild = $(element).find('td:nth-child(1)').html();
            if (cityChild == null) {
                return;
            }
            const cityName = $(element).find('td:nth-child(3)').html();
            console.log(cityId, cityName);
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
exports.default = VillagetrAnalyzer;
