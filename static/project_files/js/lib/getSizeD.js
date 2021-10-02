const child_process = require("child_process");

function getSizeD(itemFullStaticPath)
{
    //escape spaces, tabs, etc.
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g,'\ ');
    try
    {
        let size = child_process.execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
        //replace spaces, tabs, etc. with character '*'
        size = size.replace(/\s/g,'*');
        //take the file size only using substr method
        size = size.substr(0, size.indexOf("*"));
        const sizeUnit = size.replace(/\d|\./g, '');
        const sizeNumber = parseFloat(size.replace(/[a-z]/i, ''));
        //units
        let unit = "BKMGT";
        let byteSize = sizeNumber * Math.pow(1000, unit.indexOf(sizeUnit));
        return [size, byteSize];
    }
    catch(err)
    {
        console.log(err);
        return "<div class='danger danger-alert'>Internal Server Error</div>";
    }
}

module.exports = getSizeD;