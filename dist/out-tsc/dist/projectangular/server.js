const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('node:fs');
import { DOMParser, XMLSerializer } from 'xmldom';
const xpath = require('xpath');
const app = express();
const port = process.env['PORT'] || 3001;
//Per evitare errore CORS
app.use(bodyParser.json(), function (req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
    });
    next();
});
//Processo la request
app.post('/scrivifile', (req, res) => {
    try {
        console.log('PROCESSAMENTO FILE: file name: ' + req.body.name + ' file size: ' + req.body.size + ' last modified: ' + req.body.lastmodified + ' content: ' + req.body.content);
        if (req.body) {
            fs.writeFile(req.body.name, req.body.content, (err) => { if (err)
                console.log(err); });
            res.status(200).json({ esito: true, msg: 'file caricato correttamente' });
        }
    }
    catch (err) {
        res.status(500).send({ esito: false, msg: 'file non creato, errore: ' + err });
    }
});
app.post('/xml', (req, res) => {
    let jsondata = null;
    let jsonpath = "C://Users//Utente//Desktop//AngularWS//projectangular2//output//";
    let filename = req.body.name;
    let xmlpath = "C://Users//Utente//Desktop//AngularWS//projectangular2//templates//";
    let xmlTemplate1 = "template1.xml";
    let xmlTemplate2 = "template2.xml";
    let template1reader = null;
    let template2reader = null;
    const parser = new DOMParser();
    const serializer = new XMLSerializer();
    fs.readFile(jsonpath + filename, "utf8", (error, data) => {
        if (data) {
            console.log("DATA = ", data); //json letto
            jsondata = JSON.parse(data);
            //console.log("JSON DATA "+jsondata)
            //let templateMsg=jsondata.testcase[0].atomictests[0].steps[0].input.msg_type //se n valore prendo sempre il primo
            let templateMsg = jsondata.testcase[0].atomictests[0].steps[0].input.msg_type;
            //console.log(templateMsg)
            //Se aggiungo un parametro sul JSON/un nodo XML non mi si genera il template. 
            let jsonId = jsondata.testcase[0].atomictests[0].steps[0].input.msg_params.id;
            //console.log("Id del json: "+ jsonId)
            if (templateMsg === 'template2') {
                let jsonCompanyName = jsondata.testcase[0].atomictests[0].steps[0].input.msg_params.company_name;
                let jsonTotalEmployees = jsondata.testcase[0].atomictests[0].steps[0].input.msg_params.total_emplys;
                let jsonCompanyAddress = jsondata.testcase[0].atomictests[0].steps[0].input.msg_params.address;
                template2reader = fs.readFileSync(xmlpath + xmlTemplate2, 'utf-8');
                if (template2reader) {
                    //console.log(template2reader)
                    const parsedXml = parser.parseFromString(template2reader, 'text/xml');
                    //console.dir(parsedXml)
                    let companyIdNode = xpath.select1("//DocInfo/DocId/Id", parsedXml);
                    let companyNameNode = xpath.select1("//DocInfo/DocData/companyName", parsedXml);
                    let totalEmployeesNode = xpath.select1("//DocInfo/DocData/numEmployees", parsedXml);
                    let companyAddressNode = xpath.select1("//DocInfo/DocData/address", parsedXml);
                    companyIdNode.textContent = jsonId;
                    companyNameNode.textContent = jsonCompanyName;
                    totalEmployeesNode.textContent = jsonTotalEmployees;
                    companyAddressNode.textContent = jsonCompanyAddress;
                    //console.log(parsedXml.toString());
                    const serializerTemplateXml = serializer.serializeToString(parsedXml);
                    fs.writeFile(`C://Users//Utente//Desktop//AngularWS//projectangular2//xmlgenerati//${filename.split('.')[0] + ".xml"}`, serializerTemplateXml, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            //res.download(`C://Users//Utente//Desktop//AngularWS//projectangular2//xmlgenerati//${filename.split('.')[0] + '.xml'}`);
                            console.log("ok");
                        }
                    });
                }
                else {
                    console.log("errore nella lettura");
                }
            }
            if (templateMsg === 'template1') {
                let jsonPersonName = jsondata.testcase[0].atomictests[0].steps[0].input.msg_params.name;
                let jsonPersonSurname = jsondata.testcase[0].atomictests[0].steps[0].input.msg_params.surname;
                let jsonPersonAddress = jsondata.testcase[0].atomictests[0].steps[0].input.msg_params.address;
                template1reader = fs.readFileSync(xmlpath + xmlTemplate1, 'utf-8');
                if (template1reader) {
                    //console.log(template1reader)
                    const parsedXml = parser.parseFromString(template1reader, 'text/xml');
                    //console.dir(parsedXml)
                    let personIdNode = xpath.select1("//DocInfo/DocId/Id", parsedXml);
                    let personFirstNameNode = xpath.select1("//DocInfo/DocData/firstname", parsedXml);
                    let personLastNameNode = xpath.select1("//DocInfo/DocData/lastname", parsedXml);
                    let personAddressNode = xpath.select1("//DocInfo/DocData/address", parsedXml);
                    personIdNode.textContent = jsonId;
                    personFirstNameNode.textContent = jsonPersonName;
                    personLastNameNode.textContent = jsonPersonSurname;
                    personAddressNode.textContent = jsonPersonAddress;
                    console.log(parsedXml.toString());
                    const serializerTemplateXml = serializer.serializeToString(parsedXml);
                    fs.writeFile(`C://Users//Utente//Desktop//AngularWS//projectangular2//xmlgenerati//${filename.split('.')[0] + ".xml"}`, serializerTemplateXml, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            //res.download(`C://Users//Utente//Desktop//AngularWS//projectangular2//xmlgenerati//${filename.split('.')[0] + '.xml'}`);
                            console.log("ok");
                        }
                    });
                }
                else {
                    console.log("errore nella lettura");
                }
            }
        }
        else {
            console.log(error);
        }
    });
});
//Processo la delete
app.delete('/deletefile/:fileName', (req, res) => {
    try {
        let fileName = req.params.fileName;
        console.log(fileName);
        fs.rm('C:\\Users\\Utente\\Desktop\\AngularWS\\projectangular2\\output\\' + fileName, (err) => { if (err)
            throw err; });
        fs.rm(`C:\\Users\\Utente\\Desktop\\AngularWS\\projectangular2\\xmlgenerati\\${fileName.split('.')[0] + '.xml'}`, (err) => { if (err)
            throw err; });
        res.status(200).send({ fileName });
    }
    catch (err) {
        res.status(500).send({ esito: false, msg: 'file non eliminato, errore: ' + err });
    }
});
const server = http.createServer(app);
server.listen(port, () => console.log(`App running on: http://localhost:${port}`));
//# sourceMappingURL=server.js.map