import fs from "node:fs";
import http from"http";
import {XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser";



const server = http.createServer((req, res) => {
    fs.readFile('data.xml', 'utf-8', (err, xmlData) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal Server Error');
            return;
        }

        const parser = new XMLParser();

        let data = fs.readFileSync("data.xml")
        let parseData = parser.parse(data.toString());

        const assets = parseData.indicators.res;

        let minValue = null;
        for (const asset of assets) {
            const value = parseFloat(asset.value);
            if (minValue === null || value < minValue.value) {
                minValue = {value: value};
            }
        }

        const builder = new XMLBuilder();
        const responseXML = builder.build({
            data: {
                min_value: minValue.value,
            },
        });
        res.writeHead(200, {'Content-Type': 'application/xml'});
        res.end(responseXML);
    });



});

const hostname = '127.0.0.1';
const port = 8000;

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});