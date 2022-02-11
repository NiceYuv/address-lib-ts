import superagent from 'superagent';
export default class Requests {
    private static instance: Requests

    private constructor() { }

    public static getInstance() {
        if (!Requests.instance) {
            Requests.instance = new Requests()
        }
        return Requests.instance
    }

    /** Get html source code from remote address */
    public async getWebHtml(url: string) {
        const result = await superagent.get(url)
            .timeout({
                response: 5000,  // 等待 5 秒让服务器开始发送
                deadline: 60000, // 但允许文件用 1 分钟完成加载。
            })
            .retry(3)
        return result.text
    }
}