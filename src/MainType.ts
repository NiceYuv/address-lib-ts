import Requests from './Requests'
export interface Analyzer {
    analyze: (url: string, cityPid: number, cityId: number, className: string) => AnalyzerReturn
}
export interface AnalyzerReturn {
    id: number,
    data: CityInfo[],
}

export interface CityInfo {
    id: number
    pid: number
    name: string | undefined | null
    level: number
    child: string | undefined | null
    childs: CityInfo[] | []
}