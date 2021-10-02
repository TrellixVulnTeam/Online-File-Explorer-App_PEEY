//require node modules
const http = require("http");
//file imports
const respond = require("./lib/respond.js");
//connection settings
const port = process.env.PORT || 3000;
const hostname = "127.0.0.1"

//create a server
const server = http.createServer(respond);

//listen to the user's request
server.listen(port, hostname, () => {console.log(`listening on port: ${port} and host: ${hostname}`)});