import Requests from '../Common/Requests'
import ProvinceAnalyzer from './ProvinceAnalyzer'
import CityAnalyzer from './CityAnalyzer'
import VillagetrAnalyzer from './VillagetrAnalyzer'
import { writeFile, readFile, getArrayLast } from '../Common/Func'
import { Analyzer, CityInfo } from '../Common/MainType'
export default class Child {
    private level: number = 1

    private cityId: number = 1

    private filePath: string = ''

    private className: string = ''

    private data: CityInfo[] | [] = []

    private static analyzer: Analyzer

    private static requests: Requests

    constructor(
        private url: string,
        private urlPath: string,
        private fileDir: string
    ) {
        this.startProcess()
    }

    /** 开启进程 */
    private async startProcess() {
        Child.requests = Requests.getInstance()
        const content: [string, string, Analyzer][] = [
            ['_', '.provincetr', ProvinceAnalyzer.getInstance()],
            ['__', '.citytr', CityAnalyzer.getInstance()],
            ['___', '.countytr', CityAnalyzer.getInstance()],
            ['____', '.towntr', CityAnalyzer.getInstance()],
            ['_____', '.villagetr', VillagetrAnalyzer.getInstance()]
        ]
        for (let i = 0; i < content.length; i++) {
            await this.getAddress(
                i + 1, content[i][0], content[i][1], content[i][2]
            ).commonProcessAction()
        }
    }

    private getAddress(
        level: number,
        fileName: string,
        className: string,
        analyzer: Analyzer
    ) {
        this.level = level
        this.filePath = this.fileDir + fileName + 'address.json'
        this.className = className
        Child.analyzer = analyzer
        return this
    }

    /** 公共进程逻辑（1） - 读取文件 */
    private async commonProcessAction() {
        const fileInfo = readFile(this.filePath)
        if (fileInfo.length !== 0) {
            this.data = fileInfo
            this.cityId = getArrayLast(fileInfo)[0]['id']
            return
        }
        await this.commonParseAction()
    }

    /** 公共进程逻辑（2） - 解析数组 */
    private async commonParseAction() {
        let item = this.data
        let url = this.url
        let urlPath, parent, parents, parentStr = ''
        if (this.level > 1) {
            for (let i = 0; i < item.length; i++) {
                parent = this.data[i]['child'] + '/'
                urlPath = url + item[i]['child'] + '.html'
                if (this.level > 2) {
                    for (let y = 0; y < item[i]['childs'].length; y++) {
                        urlPath = url + item[i]['childs'][y]['child'] + '.html'
                        if (this.level > 3) {
                            for (let k = 0; k < item[i]['childs'][y]['childs'].length; k++) {
                                urlPath = url + parent + item[i]['childs'][y]['childs'][k]['child'] + '.html'
                                if (this.level > 4) {
                                    for (let v = 0; v < item[i]['childs'][y]['childs'][k]['childs'].length; v++) {
                                        parentStr = this.data[i]['childs'][y]['childs'][k]['child'] + ''
                                        parents = parentStr.split("/")[0] + '/'
                                        urlPath = url + parent + parents + item[i]['childs'][y]['childs'][k]['childs'][v]['child'] + '.html'
                                        item[i]['childs'][y]['childs'][k]['childs'][v]['childs'] = await this.commonToParser(urlPath);
                                    }
                                } else {
                                    item[i]['childs'][y]['childs'][k]['childs'] = await this.commonToParser(urlPath);
                                }
                            }
                        } else {
                            item[i]['childs'][y]['childs'] = await this.commonToParser(urlPath);
                        }
                    }
                } else {
                    item[i]['childs'] = await this.commonToParser(urlPath)
                }
            }
        } else {
            item = await this.commonToParser(this.url + this.urlPath)
        }
        this.data = item
        await writeFile(this.filePath, JSON.stringify(item))
    }

    /** 公共进程逻辑（3） - 将 html 内容放入解析器 */
    private async commonToParser(url: string) {
        const html = await Child.requests.getWebHtml(url)
        const { id, data } = Child.analyzer.analyze(html, this.level, this.cityId, this.className)
        this.cityId = id
        return data
    }
}