// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import login from "./liquidationsLevels";
import fetchCredentials from "./fetchCredentials";
import fs from 'fs'
import Logger from "@dworac/logger";
import liquidationsLevels from "./liquidationsLevels";

export default async ()=>{
    let credentials = null;

    if(!fs.existsSync("credentials.json")){
        Logger.logInfo("[SCRAPE] No credentials.json found, fetching credentials")
        credentials = await fetchCredentials();
        fs.writeFileSync("credentials.json", JSON.stringify(credentials))
    }
    else{
        Logger.logInfo("[SCRAPE] credentials.json found, using credentials from file")
        credentials = JSON.parse(fs.readFileSync("credentials.json").toString())
    }

    await liquidationsLevels(credentials, 'eth')

}
