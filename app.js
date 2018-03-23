//CODE ORIGINALLY FROM https://www.youtube.com/watch?v=U8XF6AFGqlc
const http = require('http');
//Bluetooth module.
const noble = require('noble');
//File handeling module.
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

//Read the html file then start the server with it.
fs.readFile('index.html', (error, html) => {
    //If there is an error throw it.
    if (error) {
        throw error;
    }

    //Request + response are passsed into the server via arrow function.
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(html);
        res.end();
    });

    //Sever is now running.
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
});




