import cheerio, { CheerioAPI } from 'cheerio'
import { Analyzer, CityInfo, AnalyzerReturn } from '../Common/MainType'
export default class ProvinceAnalyzer implements Analyzer {
    private static instance: ProvinceAnalyzer

    private constructor() { }

    public static getInstance() {
        if (!ProvinceAnalyzer.instance) {
            ProvinceAnalyzer.instance = new ProvinceAnalyzer()
        }
        return ProvinceAnalyzer.instance
    }

    /** match data */
    private getProvinceInfo(html: string, cityPid: number, cityId: number, className: string): AnalyzerReturn {
        const $: CheerioAPI = cheerio.load(html);
        const provinceItems = $(className)
        const provinceInfos: CityInfo[] = []
        provinceItems.map((index, element) => {
            $(element).find('td').map((keys, tdElement) => {
                let provinceChild = $(tdElement).find('a').attr('href') + ''
                provinceChild = provinceChild.split(".")[0]
                const provinceName = $(tdElement).find('a').html()?.replace('<br>', '')
                console.log(cityId, provinceName);
                provinceInfos.push({
                    id: cityId, pid: cityPid, name: provinceName,
                    level: 1, child: provinceChild, childs: []
                })
                cityId++
            })
        })
        return {
            id: cityId,
            data: provinceInfos
        }
    }

    public analyze(html: string, cityPid: number, cityId: number, className: string): AnalyzerReturn {
        return this.getProvinceInfo(html, cityPid, cityId, className)
    }
}