//IMPORTS
const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require("path");
const chromium = require('chromium');

process.setMaxListeners(20);

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generatePosterForModel(browser, posterPath, modelName) {

    try {
        const page = await browser.newPage();
        const localHtmlPath = `https://3dviewer.sites.carleton.edu/carcas/html-files/${modelName}.html`;
        console.log(localHtmlPath);
        await page.goto(localHtmlPath, { timeout: 60000 });

        await page.waitForFunction(() => {
            const modelViewer = document.querySelector('model-viewer');
            return modelViewer && modelViewer.modelIsVisible;
        }, { timeout: 60000 });

        const modelViewerElement = await page.$('model-viewer');
        if (modelViewerElement) {
            sleep(500);
            const imageBuffer = await modelViewerElement.screenshot({ type: 'webp' });
            fs.writeFileSync(posterPath, imageBuffer);
            console.info(`Poster saved to ${posterPath}`);
        } else {
            console.log('No model viewer element found');
        }
        await page.close();
    } catch (error) {
        console.error("Error occurred:", error);
    }

}

async function processFolders(folderPath) {

    const modelFolderPath = folderPath + '/carcas-models/models';
    const posterFolderPath = folderPath + '/carcas-models/posters';
    console.log(`Model path: ${modelFolderPath}, Poster path: ${posterFolderPath}`);

    const files = fs.readdirSync(modelFolderPath);
    const posters = new Set(fs.readdirSync(posterFolderPath));

    console.log(chromium.path);

    const browser = await puppeteer.launch({
        executablePath: chromium.path
    });

    for (let file of files) {
        const baseName = file.toLowerCase().replace(/ /g, '-').replace(/\*$/, '');
        const charBaseName = baseName.split('');
        var finalBaseName = '';
        for (let i = 0; i < charBaseName.length - 4; i++) {
            finalBaseName += charBaseName[i];
        }
        const posterFileName = `${finalBaseName}-poster.webp`;
        if (!posters.has(posterFileName)) {
            console.info(`No poster found for ${posterFileName}`);
            await generatePosterForModel(browser, path.join(posterFolderPath, posterFileName), finalBaseName);
        }
    }
    await browser.close();

}

(async () => {
    const folderPath = path.resolve(__dirname, "");
    const fileBefore = folderPath.substring(0, folderPath.lastIndexOf('/'));
    await processFolders(fileBefore);
})()
