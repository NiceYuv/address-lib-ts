import Child from './Child/Child'
class Main {

    constructor(mode: boolean, private fileDir: string, private url: string) {
        (mode) ? this.childsProcess() : this.sortProcess()
        console.log('grab end');
    }

    private childsProcess() {
        /** get request */
        new Child(this.url, 'index.html', this.fileDir)
        console.log('city info grab ok - childs mode');
    }

    private sortProcess() {
        console.log('sortProcess ???');
    }
}

const url = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2021/`
new Main(true, '../../data/', url)