//IMPORTS
const puppeteer = require('puppeteer')
const fs = require("fs")
const path = require("path")

let fetch

const folderList = []

async function generatePosterForModel(posterPath, fileName) {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    file = fileName.split('.')[0];
    let modelName = "";
    for (let i = 0; i < file.length - 7; i++) {
        modelName += file[i]
    }

    const localHtmlPath = "https://3dviewer.sites.carleton.edu/carcas/html-files/" + modelName + ".html";
    console.log(localHtmlPath)
    await page.goto(localHtmlPath)

    await page.waitForFunction(() => {
        const modelViewer = document.querySelector('model-viewer')
        return modelViewer && modelViewer.modelIsVisible
    })

    const modelViewerElement = await page.$('model-viewer')
    if (modelViewerElement) {
        const imageBuffer = await modelViewerElement.screenshot({ type: 'webp' })

        fs.writeFileSync(posterPath, imageBuffer)
        console.info(`Poster saved to ${posterPath}`)
    } else {
        console.log('No model viewer element found')
    }

    await browser.close()
}

async function processFolders(folderPath) {

    const modelFolderPath = folderPath + '/carcas-models/models';
    const posterFolderPath = folderPath + '/carcas-models/posters';
    console.log(`Model path: ${modelFolderPath}, Poster path: ${posterFolderPath}`);

    fs.readdir(modelFolderPath, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach((file, index) => {
            // Make one pass and make the file complete
            let posterFileName = file.toLowerCase();
            posterFileName = posterFileName.replaceAll(' ', '-');
            posterFileName = posterFileName.split('.')[0];
            posterFileName = posterFileName + '-poster.webp';
            let found = false;

            fs.readdir(posterFolderPath, (err, files) => {
                if (err) {
                    console.error("Could not list the directory.", err);
                    process.exit(1);
                }
                files.forEach((file, index) => {
                    if (file === posterFileName) {

                        found = true;
                    }
                })
                if (found === false) {
                    console.info(`No poster found for ${posterFileName}`);
                    generatePosterForModel(posterFolderPath, posterFileName);
                }
            })

        });
    });

}

async function haveNoPoster(folderPath) {
    const results = fs.readdirSync(folderPath);
    const webpFiles = results.filter(file => file.endsWith('.webp'))
    return webpFiles.length === 0;
}

(async () => {
    const folderPath = path.resolve(__dirname, "")
    const fileBefore = folderPath.substring(0, folderPath.lastIndexOf('/'))
    await processFolders(fileBefore);
})()
