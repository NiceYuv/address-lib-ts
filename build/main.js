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
const Requests_1 = __importDefault(require("./Requests"));
const ProvinceAnalyzer_1 = __importDefault(require("./ProvinceAnalyzer"));
const CityAnalyzer_1 = __importDefault(require("./CityAnalyzer"));
const VillagetrAnalyzer_1 = __importDefault(require("./VillagetrAnalyzer"));
const Func_1 = require("./Func");
class Main {
    constructor(url, urlPath, fileDir) {
        this.url = url;
        this.urlPath = urlPath;
        this.fileDir = fileDir;
        this.cityId = 1;
        this.data = [];
        this.startProcess();
    }
    requestWeb(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = Requests_1.default.getInstance();
            return yield request.getWebHtml(url);
        });
    }
    /** 5. Villagetr */
    getVillagetr() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileInfo = (0, Func_1.readFile)(this.fileDir + 'province_city_count_town_village.json');
            if (fileInfo.length !== 0) {
                const last = (0, Func_1.getArrayLast)(fileInfo);
                this.data = fileInfo;
                this.cityId = last[0]['id'];
                return;
            }
            let cityId = this.cityId;
            // for (let i = 19; i < 20; i++) {
            for (let i = 0; i < this.data.length; i++) {
                const parents = this.data[i]['child'] + '/';
                for (let y = 0; y < this.data[i]['childs'].length; y++) {
                    // for (let y = 3; y < 4; y++) {
                    for (let k = 0; k < this.data[i]['childs'][y]['childs'].length; k++) {
                        // for (let k = 6; k < 7; k++) {
                        for (let v = 0; v < this.data[i]['childs'][y]['childs'][k]['childs'].length; v++) {
                            // for (let v = 1; v < 2; v++) {
                            const parentStr = this.data[i]['childs'][y]['childs'][k]['child'] + '';
                            const parent = parentStr.split("/")[0] + '/';
                            const items = this.data[i]['childs'][y]['childs'][k]['childs'][v];
                            const html = yield this.requestWeb(this.url + parents + parent + items.child + '.html');
                            const analyzer = VillagetrAnalyzer_1.default.getInstance();
                            const { id, data } = analyzer.analyze(html, items.id, cityId, '.villagetr');
                            this.data[i]['childs'][y]['childs'][k]['childs'][v]['childs'] = data;
                            cityId = id;
                        }
                    }
                }
            }
            this.cityId = cityId;
            (0, Func_1.writeFile)(this.fileDir + 'province_city_count_town_village.json', JSON.stringify(this.data));
        });
    }
    /** 4. Towntr */
    getTowntr() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileInfo = (0, Func_1.readFile)(this.fileDir + 'province_city_count_town.json');
            if (fileInfo.length !== 0) {
                const last = (0, Func_1.getArrayLast)(fileInfo);
                this.data = fileInfo;
                this.cityId = last[0]['id'];
                return;
            }
            let cityId = this.cityId;
            for (let i = 0; i < this.data.length; i++) {
                const parent = this.data[i]['child'] + '/';
                for (let y = 0; y < this.data[i]['childs'].length; y++) {
                    for (let k = 0; k < this.data[i]['childs'][y]['childs'].length; k++) {
                        const items = this.data[i]['childs'][y]['childs'][k];
                        const html = yield this.requestWeb(this.url + parent + items.child + '.html');
                        const analyzer = CityAnalyzer_1.default.getInstance();
                        const { id, data } = analyzer.analyze(html, items.id, cityId, '.towntr');
                        this.data[i]['childs'][y]['childs'][k]['childs'] = data;
                        cityId = id;
                    }
                }
            }
            this.cityId = cityId;
            (0, Func_1.writeFile)(this.fileDir + 'province_city_count_town.json', JSON.stringify(this.data));
        });
    }
    /** 3. Countytr => CityAnalyzer */
    getCountytr() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileInfo = (0, Func_1.readFile)(this.fileDir + 'province_city_count.json');
            if (fileInfo.length !== 0) {
                const last = (0, Func_1.getArrayLast)(fileInfo);
                this.data = fileInfo;
                this.cityId = last[0]['id'];
                return;
            }
            let cityId = this.cityId;
            for (let i = 0; i < this.data.length; i++) {
                for (let y = 0; y < this.data[i]['childs'].length; y++) {
                    const items = this.data[i]['childs'][y];
                    const html = yield this.requestWeb(this.url + items.child + '.html');
                    const analyzer = CityAnalyzer_1.default.getInstance();
                    const { id, data } = analyzer.analyze(html, items.id, cityId, '.countytr');
                    this.data[i]['childs'][y]['childs'] = data;
                    cityId = id;
                }
            }
            this.cityId = cityId;
            (0, Func_1.writeFile)(this.fileDir + 'province_city_count.json', JSON.stringify(this.data));
        });
    }
    /** 2. CityAnalyzer */
    getCitytr() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileInfo = (0, Func_1.readFile)(this.fileDir + 'province_city.json');
            if (fileInfo.length !== 0) {
                const last = (0, Func_1.getArrayLast)(fileInfo);
                this.data = fileInfo;
                this.cityId = last[0]['id'];
                return;
            }
            let cityId = this.cityId;
            for (let i = 0; i < this.data.length; i++) {
                const items = this.data[i];
                const html = yield this.requestWeb(this.url + items.child + '.html');
                const analyzer = CityAnalyzer_1.default.getInstance();
                const { id, data } = analyzer.analyze(html, items.id, cityId, '.citytr');
                this.data[i]['childs'] = data;
                cityId = id;
            }
            this.cityId = cityId;
            (0, Func_1.writeFile)(this.fileDir + 'province_city.json', JSON.stringify(this.data));
        });
    }
    /** 1. ProvinceAnalyzer */
    getProvincetr() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileInfo = (0, Func_1.readFile)(this.fileDir + 'province.json');
            if (fileInfo.length !== 0) {
                const last = (0, Func_1.getArrayLast)(fileInfo);
                this.data = fileInfo;
                this.cityId = last[0]['id'];
                return;
            }
            const html = yield this.requestWeb(this.url + this.urlPath);
            const analyzer = ProvinceAnalyzer_1.default.getInstance();
            const { id, data } = analyzer.analyze(html, 0, this.cityId, '.provincetr');
            this.data = data;
            this.cityId = id;
            (0, Func_1.writeFile)(this.fileDir + 'province.json', JSON.stringify(this.data));
        });
    }
    startProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            /** get request */
            yield this.getProvincetr();
            yield this.getCitytr();
            yield this.getCountytr();
            yield this.getTowntr();
            yield this.getVillagetr();
            console.log('city info grab ok');
        });
    }
}
const urlPath = 'index.html';
const fileDir = '../data/';
const url = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2021/`;
const main = new Main(url, urlPath, fileDir);
