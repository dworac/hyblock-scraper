// it augments the installed puppeteer with plugin functionality
import sharp from "sharp";

const puppeteer = require('puppeteer-extra')
import fs from 'fs'

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

export default async (credentials:any, ticker: string)=>{
    const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 1080 } })

    const page = await browser.newPage()

    await page.setRequestInterception(true);

    // Listen for all requests to the page
    page.on('request', interceptedRequest => {
        let url = interceptedRequest.url();
        let modifiedUrl = '';

        // Check if the request URL matches the one you're interested in
        if(url.includes('https://data.hyblockcapital.com/pythonPages/liq-level?')) {
            // Modify the url, change 'sol' to 'btc'
            modifiedUrl = url.replace('ticker=sol',`ticker=${ticker}` );

            // Continue the request with the modified url
            interceptedRequest.continue({
                url: modifiedUrl
            });
        } else {
            // If the request URL doesn't match, just continue as normal
            interceptedRequest.continue();
        }
    });


    // Set localstorage values of https://hyblockcapital.com/login to be localStorageValues
    await page.goto('https://hyblockcapital.com/login')

    await page.evaluate((credentials) => {
        for(let key in credentials) {
            localStorage.setItem(key, credentials[key]);
        }
    }, credentials);

    await page.goto('https://hyblockcapital.com/liquidationlevel')

    // wait until .my_plot is loaded
    await page.waitForSelector('.my_plot')

    await page.waitForTimeout(1000)


    const svg = await page.evaluate(() => {
        const svgElement = document.querySelector("svg.main-svg");
        if(svgElement) {
            // Create a white rectangle and insert it at the start of the SVG.
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", "100%");
            rect.setAttribute("height", "100%");
            rect.setAttribute("fill", "white");
            svgElement.insertBefore(rect, svgElement.firstChild);

            return new XMLSerializer().serializeToString(svgElement);
        }

        return null;
    });

    let pngBuffer = null;

    if(svg) {
        const buffer = Buffer.from(svg);
        pngBuffer = await sharp(buffer).toFormat('png').toBuffer();

        // fs.writeFile('image.png', pngBuffer, err => {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log('Image saved successfully');
        //     }
        // });
    } else {
        console.log('No SVG found on the page.');
    }

    await browser.close()

    return pngBuffer
}
