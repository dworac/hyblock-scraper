import Logger from "@dworac/logger";

const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

export default async ()=>{
    const browser = await puppeteer.launch({ headless: true })

    Logger.logInfo("[FETCH_CREDENTIALS] Browser launched")
    const page = await browser.newPage()

    await page.goto('https://hyblockcapital.com/login')

    // wait for input #Email and #Password to appear and write in credentials
    await page.waitForSelector('#Email')
    await page.type('#Email', 'dworac')
    await page.waitForSelector('#Password')
    await page.type('#Password', 'Aasdf;lkj4325@')



    // // submit #my_login_form and wait for navigation to finish
    await Promise.all([
        page.evaluate(()=>{
            document.querySelector("form button").click()
        }),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ])


    Logger.logInfo("[FETCH_CREDENTIALS] Logged in")

    // get all localstorage values
    const localStorageValues = await page.evaluate(() => {
        const json = {}
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if(key){
                // @ts-ignore
                json[key] = localStorage.getItem(key)
            }
        }
        return json
    })

    Logger.logInfo("[FETCH_CREDENTIALS] Finished fetching credentials")

    // await page.screenshot({ path: 'testresult.png', fullPage: true })
    await browser.close()
    // console.log(`All done, check the screenshot. ✨`)

    localStorageValues["registered"] = true;

    return localStorageValues
}
