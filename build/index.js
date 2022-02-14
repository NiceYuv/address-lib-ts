"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Child_1 = __importDefault(require("./Child/Child"));
class Main {
    constructor(mode, fileDir, url) {
        this.fileDir = fileDir;
        this.url = url;
        (mode) ? this.childsProcess() : this.sortProcess();
        console.log('grab end');
    }
    childsProcess() {
        /** get request */
        new Child_1.default(this.url, 'index.html', this.fileDir);
        console.log('city info grab ok - childs mode');
    }
    sortProcess() {
        console.log('sortProcess ???');
    }
}
const url = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2021/`;
new Main(true, '../../data/', url);
