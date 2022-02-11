import fs from 'fs';
import path from 'path';
import { CityInfo } from './MainType'

/** write data to json file */
export function writeFile(filePath: string, content: string) {
    const __filePath = path.resolve(__dirname, filePath)
    fs.writeFileSync(__filePath, content)

}
/** Read the content of the json file  */
export function readFile(filePath: string): CityInfo[] {
    const __filePath = path.resolve(__dirname, filePath)
    if (fs.existsSync(__filePath)) {
        return JSON.parse(fs.readFileSync(__filePath, 'utf-8'))
    }
    return []
}

export function getArrayLast(data: CityInfo[] | []): CityInfo[] | [] {
    if (data.slice(-1)[0]['childs'].length == 0) {
        return data.slice(-1)
    }
    return getArrayLast(data.slice(-1)[0]['childs'])
}