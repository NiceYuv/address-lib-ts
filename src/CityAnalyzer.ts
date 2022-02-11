import cheerio, { CheerioAPI } from 'cheerio'
import { Analyzer, CityInfo, AnalyzerReturn } from './MainType'
export default class CityAnalyzer {
    private static instance: CityAnalyzer

    private constructor() { }

    public static getInstance() {
        if (!CityAnalyzer.instance) {
            CityAnalyzer.instance = new CityAnalyzer()
        }
        return CityAnalyzer.instance
    }
    private getCityInfo(html: string, cityPid: number, cityId: number, className: string): AnalyzerReturn {
        const $: CheerioAPI = cheerio.load(html);
        const cityItems = $(className)
        const cityInfos: CityInfo[] = []
        cityItems.map((index, element) => {
            const cityName = $(element).find('td:nth-child(2) a').html()
            if (cityName == null) {
                return
            }
            const cityChild = $(element).find('td:nth-child(2) a').attr('href')
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