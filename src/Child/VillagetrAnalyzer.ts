import cheerio, { CheerioAPI } from 'cheerio'
import { Analyzer, CityInfo, AnalyzerReturn } from '../Common/MainType'
export default class VillagetrAnalyzer {
    private static instance: VillagetrAnalyzer

    private constructor() { }

    public static getInstance() {
        if (!VillagetrAnalyzer.instance) {
            VillagetrAnalyzer.instance = new VillagetrAnalyzer()
        }
        return VillagetrAnalyzer.instance
    }
    private getCityInfo(html: string, cityPid: number, cityId: number, className: string): AnalyzerReturn {
        const $: CheerioAPI = cheerio.load(html);
        const cityItems = $(className)
        const cityInfos: CityInfo[] = []
        cityItems.map((index, element) => {
            let cityChild = $(element).find('td:nth-child(1)').html()
            if (cityChild == null) {
                return
            }
            const cityName = $(element).find('td:nth-child(3)').html()
            console.log(cityId, cityName);
            cityInfos.push({
                id: cityId, pid: cityPid, name: cityName,
                level: 2, child: cityChild, childs: []
            })
            cityId++
        })
        return {
            id: cityId,
            data: cityInfos
        }
    }

    public analyze(html: string, cityPid: number, cityId: number, className: string): AnalyzerReturn {
        return this.getCityInfo(html, cityPid, cityId, className)
    }
}