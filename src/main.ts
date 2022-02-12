import Requests from './Requests'
import ProvinceAnalyzer from './ProvinceAnalyzer'
import CityAnalyzer from './CityAnalyzer'
import VillagetrAnalyzer from './VillagetrAnalyzer'
import { writeFile, readFile, getArrayLast } from './Func'
import { Analyzer, CityInfo } from './MainType'
class Main {
    private cityId = 1

    private data: CityInfo[] | [] = []

    private async requestWeb(url: string) {
        const request = Requests.getInstance()
        return await request.getWebHtml(url)
    }

    /** 5. Villagetr */
    private async getVillagetr() {
        const fileInfo = readFile(this.fileDir + 'province_city_count_town_village.json')
        if (fileInfo.length !== 0) {
            const last: CityInfo[] = getArrayLast(fileInfo)
            this.data = fileInfo
            this.cityId = last[0]['id']
            return
        }

        let cityId = this.cityId
        for (let i = 0; i < this.data.length; i++) {
            const parents = this.data[i]['child'] + '/'
            for (let y = 0; y < this.data[i]['childs'].length; y++) {
                for (let k = 0; k < this.data[i]['childs'][y]['childs'].length; k++) {
                    for (let v = 0; v < this.data[i]['childs'][y]['childs'][k]['childs'].length; v++) {
                        const parentStr = this.data[i]['childs'][y]['childs'][k]['child'] + ''
                        const parent = parentStr.split("/")[0] + '/'
                        const items = this.data[i]['childs'][y]['childs'][k]['childs'][v]
                        const html = await this.requestWeb(this.url + parents + parent + items.child + '.html')
                        const analyzer = VillagetrAnalyzer.getInstance()
                        const { id, data } = analyzer.analyze(html, items.id, cityId, '.villagetr')
                        this.data[i]['childs'][y]['childs'][k]['childs'][v]['childs'] = data
                        cityId = id
                    }
                }
            }
        }

        this.cityId = cityId
        writeFile(this.fileDir + 'province_city_count_town_village.json', JSON.stringify(this.data))
    }

    /** 4. Towntr */
    private async getTowntr() {
        const fileInfo = readFile(this.fileDir + 'province_city_count_town.json')
        if (fileInfo.length !== 0) {
            const last: CityInfo[] = getArrayLast(fileInfo)
            this.data = fileInfo
            this.cityId = last[0]['id']
            return
        }

        let cityId = this.cityId
        for (let i = 0; i < this.data.length; i++) {

            const parent = this.data[i]['child'] + '/'

            for (let y = 0; y < this.data[i]['childs'].length; y++) {
                for (let k = 0; k < this.data[i]['childs'][y]['childs'].length; k++) {
                    const items = this.data[i]['childs'][y]['childs'][k]
                    const html = await this.requestWeb(this.url + parent + items.child + '.html')
                    const analyzer = CityAnalyzer.getInstance()
                    const { id, data } = analyzer.analyze(html, items.id, cityId, '.towntr')
                    this.data[i]['childs'][y]['childs'][k]['childs'] = data
                    cityId = id
                }
            }
        }
        this.cityId = cityId
        writeFile(this.fileDir + 'province_city_count_town.json', JSON.stringify(this.data))
    }

    /** 3. Countytr => CityAnalyzer */
    private async getCountytr() {
        const fileInfo = readFile(this.fileDir + 'province_city_count.json')
        if (fileInfo.length !== 0) {
            const last: CityInfo[] = getArrayLast(fileInfo)
            this.data = fileInfo
            this.cityId = last[0]['id']
            return
        }

        let cityId = this.cityId
        for (let i = 0; i < this.data.length; i++) {
            for (let y = 0; y < this.data[i]['childs'].length; y++) {
                const items = this.data[i]['childs'][y]
                const html = await this.requestWeb(this.url + items.child + '.html')
                const analyzer = CityAnalyzer.getInstance()
                const { id, data } = analyzer.analyze(html, items.id, cityId, '.countytr')
                this.data[i]['childs'][y]['childs'] = data
                cityId = id
            }
        }
        this.cityId = cityId
        writeFile(this.fileDir + 'province_city_count.json', JSON.stringify(this.data))
    }

    /** 2. CityAnalyzer */
    private async getCitytr() {
        const fileInfo = readFile(this.fileDir + 'province_city.json')
        if (fileInfo.length !== 0) {
            const last: CityInfo[] = getArrayLast(fileInfo)
            this.data = fileInfo
            this.cityId = last[0]['id']
            return
        }
        let cityId = this.cityId
        for (let i = 0; i < this.data.length; i++) {
            const items = this.data[i]
            const html = await this.requestWeb(this.url + items.child + '.html')
            const analyzer: Analyzer = CityAnalyzer.getInstance()
            const { id, data } = analyzer.analyze(html, items.id, cityId, '.citytr')
            this.data[i]['childs'] = data
            cityId = id
        }
        this.cityId = cityId
        writeFile(this.fileDir + 'province_city.json', JSON.stringify(this.data))
    }

    /** 1. ProvinceAnalyzer */
    private async getProvincetr() {
        const fileInfo = readFile(this.fileDir + 'province.json')
        if (fileInfo.length !== 0) {
            const last: CityInfo[] = getArrayLast(fileInfo)
            this.data = fileInfo
            this.cityId = last[0]['id']
            return
        }
        const html = await this.requestWeb(this.url + this.urlPath)
        const analyzer: Analyzer = ProvinceAnalyzer.getInstance()
        const { id, data } = analyzer.analyze(html, 0, this.cityId, '.provincetr')
        this.data = data
        this.cityId = id
        writeFile(this.fileDir + 'province.json', JSON.stringify(this.data))
    }

    private async startProcess() {
        /** get request */
        await this.getProvincetr()
        await this.getCitytr()
        await this.getCountytr()
        await this.getTowntr()
        await this.getVillagetr()
        console.log('city info grab ok');
    }

    constructor(
        private url: string,
        private urlPath: string,
        private fileDir: string
    ) {
        this.startProcess()
    }
}
const urlPath = 'index.html'
const fileDir = '../data/'
const url = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2021/`
const main = new Main(url, urlPath, fileDir)