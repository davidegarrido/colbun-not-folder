import puppeteer from 'puppeteer';
import fs from 'fs';
import { clickFolderButtons, compareData } from './utils/scrappersUtils.js';


async function scrapeAndCompareDataByFolder(folderNameModified) {
    const previousDataJson = JSON.parse(fs.readFileSync('./src/data/previousData.json', 'utf8'));

    console.log('Start of scraping and data comparison');

    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
        const page = await browser.newPage();
        const url = 'https://cdec365.sharepoint.com/:f:/s/Licitaciones/EoSVdRqRoxVNqAomWKjkgc8B7sB4dJA6gOjtyrUqUoQQvQ?e=I5K3ad';
        await page.goto(url);

        try {
            await page.waitForSelector('div[role="grid"]', { timeout: 10000 });
        } catch (error) {
            console.error('Cannot access the URL: Selector not found');
            await browser.close();
            return null;
        }

        // const buttonSelector = `button[title="${folderNameModified}"]`;
        // const button = await page.$(buttonSelector);
        // await button.click();
        await new Promise((resolve) => setTimeout(resolve, 200));

        const elementsOnUrl = await page.$$('div[role="grid"] .ms-DetailsList-contentWrapper .ms-DetailsRow');
        console.log(elementsOnUrl);
        const currentData = await clickFolderButtons(page, elementsOnUrl, folderNameModified);
        console.log(currentData);
        await browser.close();

        console.log("New data from scraping");

        const comparationResults = await compareData(previousDataJson, currentData);

        if (comparationResults != null) {
            console.log('New data');
            const jsonData = JSON.stringify(currentData, null, 2);
            const filePath = 'src/data/previousData.json';
            fs.writeFile(filePath, jsonData, (err) => {
                if (err) {
                    console.error('Error saving previousData:', err);
                } else {
                    console.log('previousData has been saved to', filePath);
                }
            });
            return comparationResults;
        } else {
            console.log("No new data");
            return null;
        }
    } catch (err) {
        console.error('An error occurred:', err);
        return null;
    }
}


export { scrapeAndCompareDataByFolder };