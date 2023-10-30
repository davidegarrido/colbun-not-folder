import cron from 'node-cron';
import { scrapeAndCompareDataByFolder } from './src/scrappers/scrapeAndCompareDataByFolder.js';
import { sendEmail } from './src/utils/sendEmail.js';
import { enhancedMessage } from './src/utils/enhancedMessage.js';

const folderNameModified = "09 Actas del Proceso";

let isScraping = false;

async function scrapeData() {
  if (isScraping) {
    console.log('Scraping in progress, skipping this run.');
    return;
  }

  try {
    isScraping = true;
    const dataChanges = await scrapeAndCompareDataByFolder(folderNameModified);

    if (dataChanges) {
      console.log('New changes are detected, sending an email');
      const improvedMessage = await enhancedMessage(dataChanges);
      await sendEmail('Cambios detectados', improvedMessage);
    } else {
      console.log('No changes detected');
      await sendEmail('No hay cambios detectados', '');
    }
  } catch (error) {
    console.error('Error while scraping and comparing data:', error);
  } finally {
    isScraping = false;
  }
}

const cronSchedule = '*/10 * * * *';

cron.schedule(cronSchedule, () => {
  console.log('Scraping data every 10 minutes...');
  scrapeData();
});

scrapeData();
