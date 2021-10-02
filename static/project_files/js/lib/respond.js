//require node modules
const path = require("path");
const fs = require("fs");

//file imports
const getBreadcrumb = require("./breadcrumb.js");
const buildMainContent = require("./mainContent.js");
const getMimeType = require("./mimeType.js");

//static base path: location of your static folder
const staticBasePath = path.join(__dirname, "..", "..", "..");

//create the respond function
function respond(request, response)
{
    let myURL;
    let pathname;
    let searchParams;
    if(request.url != "/favicon.ico")
    {
        //create URL
        myURL = new URL(request.url,`http://127.0.0.1:3000`);
        pathname = myURL.pathname;
        searchParams = myURL.searchParams;
    }
    else
    {
        return false;
    }
    //before working with the pathname, decode the pathname
    pathname = decodeURIComponent(pathname);
    
    //get the corresponding full static path located in the static folder
    const fullStaticPath = path.join(staticBasePath, pathname);

    //find something in fullStaticPath:
        //no: send '404: File Not Found!'
    if(!fs.existsSync(fullStaticPath))
    {
        console.log(`${fullStaticPath} does not exist`);
        response.write(`404: File not found.`);
        return response.end(); //don't execute any code below
    }

        //yes: a file or a directory
            //a directory
    let stats;
    try
    {
        stats = fs.lstatSync(fullStaticPath);
    }
    catch(err)
    {
        console.log(err);
    }
    
    if(stats.isDirectory())
    {
        //get content from the template index.html
        let template;
        try
        {
            template = fs.readFileSync(path.join(staticBasePath, "/project_files/index.html"), "utf-8");
        }
        catch(err)
        {
            console.log(err);
        }

        //build the page title
        let pathnameArr = pathname.split("/");
        pathnameArr = pathnameArr.filter(element => element != ' ');
        const pageTitle = pathnameArr[pathnameArr.length - 1] ? pathnameArr[pathnameArr.length - 1] : "Home";

        //fill the template data with: page title, breadcrumb, and table rows
        template = template.replace("page_title", pageTitle);
        template = template.replace("breadcrumb_data", getBreadcrumb(pathnameArr)); //build the breadcrumb
        template = template.replace("main_content", buildMainContent(fullStaticPath, pathname)); //build table rows (main content)
        
        //print data to the webpage
        response.statusCode = 200;
        response.write(template);
        return response.end();
    }

    //not both
    if(!stats.isFile())
    {
        //send '401: access denied'
        response.staticCode = 401;
        response.write(`401: Access Denied`);
        return response.end();
    }

    //a file
    let fileDetails = {};
        //get the file extension
    fileDetails.extname = path.extname(fullStaticPath);
    fileDetails.size = stats.size;
    
    //get the file mime type and add it to the response header
    getMimeType(fileDetails.extname)
    .then(mime => {
        //store headers
        let head = {};
        //create options object
        let options = {};
        //response status code
        let statusCode = 200;
        //set "Content-Type" for all file types
        head["Content-Type"] = mime;
        //get the file size and add it to the response header
            //pdf file? -> display in browser
        if(fileDetails.extname == ".pdf")
        {
            head["Content-Disposition"] = "inline";
            //head["Content-Disposition"] = "attachment; filename=file.pdf";
        }
            //audio/video file? -> stream in ranges
        if(RegExp("audio").test(mime) || RegExp("video").test(mime))
        {
            const range = request.headers.range;
            if(range)
            {
                //bytes = 451645-end -> 451645-end
                const start_end = range.replace(/bytes=/, "").split('-');
                const start = parseInt(start_end[0]);
                const end = start_end[1] ? parseInt(start_end[1]) : fileDetails.size - 1;
                //add Accept-Ranges to header
                head["Accept-Ranges"] = "bytes";
                //add two more headers: Content-Range, Content-Length
                head["Content-Range"] = `bytes ${start}-${end}/${fileDetails.size}`;
                head["Content-Length"] = end - start + 1;
                statusCode = 206;
                options = {start, end};
            }
        }
        
        //reading the file using fs.readFile
        /*
        fs.promises.readFile(fullStaticPath, "utf-8")
        .then(data => {
            response.writeHead(statusCode, head);
            response.write(data);
            return response.end();
        })
        .catch(err => {
            response.statusCode = 404;
            response.write(`404: File reading error!`);
            console.log(err);
            return response.end();
        });
        */
        //or we can use streaming method to display the file
        const fileStream = fs.createReadStream(fullStaticPath, options);

        //stream chunks of data to your response object
        if(typeof head["Content-Type"] == 'undefined')
        {
            return false;
        }
        response.writeHead(statusCode, head);
        fileStream.pipe(response);

        //events which needed handle: close and error
        fileStream.on("close", () => {
            return response.end();
        });
        fileStream.on("error", () => {
            response.statusCode = 404;
            response.write(`404: File stream error!`);
            console.log(error.code);
            return response.end();
        });
    })
    .catch(err => {
        console.log(err);
        response.statusCode = 500;
        response.write(`500: Internal Server Error`);
        return response.end();
    });
}

module.exports = respond;