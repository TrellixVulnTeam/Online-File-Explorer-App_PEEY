const fs = require("fs");
const path = require("path");
//import files
const getSizeD = require("./getSizeD.js");
const getSizeF = require("./getSizeF.js");

function buildMainContent(fullPath, pathName)
{
    let mainContent = '';
    //loop through the elements inside the folder
    try
    {
        let items = fs.readdirSync(fullPath);
        items = items.filter(item => (item != ".DS_Store") && (item != "project_files")); // ![".DS_Store", "project_files"].include(item)
        items.forEach(item => {
            let stats;
            try
            {
                stats = fs.lstatSync(path.join(fullPath, item));
            }
            catch(err)
            {
                console.log(err);
                return `<div class="alert alert-danger">Internal Server Error</div>`;
            }

            //get the following elements for each item:
                //name = item
                //link to the item
            const itemPath = item.replace(/\s/g, "%20");
            const pathNameCleaned = pathName.replace(/\s/g, "%20");
            const link = path.join(pathNameCleaned, itemPath);
                //size
            const [size, byteSize] = stats.isDirectory() ? getSizeD(path.join(fullPath, item)) : getSizeF(stats.size);
                //last modified information
            const mtime = stats.mtime.toLocaleString();
                //ion-icon
            const iconName = stats.isDirectory() ? "folder-outline" : "document-outline";
                //create target to open a new page if it is a file
            const newPage = stats.isFile() ? "_blank" : "";
            mainContent += `<tr data-name="${item}" data-size="${byteSize}" data-time="${parseInt(stats.mtimeMs)}">
                <td class="name"><ion-icon name=${iconName}></ion-icon><a href=${link} target="${newPage}">${item}</a></td>
                <td class="data">${size}</td>
                <td class="data">${mtime}</td>
            </tr>`;
        });
    }
    catch(err)
    {
        console.log(err);
        return  `<div class="alert alert-danger">Internal Server Error</div>`;
    }
    
    return mainContent;
}

module.exports = buildMainContent;