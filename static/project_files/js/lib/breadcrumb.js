const path = require("path");
function getBreadcrumb(pathArr)
{
    let link = "/"
    let breadcrumb = `<li class="breadcrumb-item"><a href="${link}">Home</a></li>`;
    for(let i = 1; i < pathArr.length; i++)
    {
        if(i == pathArr.length - 1)
        {
            breadcrumb += `<li class="breadcrumb-item active" aria-current="page">${pathArr[i]}</li>`;
        }
        else
        {
            breadcrumb += `<li class="breadcrumb-item"><a href="${path.join(link, pathArr[i])}">${pathArr[i]}</a></li>`;
        }
    }
    return breadcrumb;
}

module.exports = getBreadcrumb;