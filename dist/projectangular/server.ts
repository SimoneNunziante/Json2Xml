const express = require('express');
const bodyParser = require('body-parser')
const http = require('http');
const fsp = require('fs').promises;
const fs = require('node:fs');
import { NextFunction, Response } from 'express';
import { DOMParser, XMLSerializer } from 'xmldom';
import { Request } from '../../inteface/requestInterface';
import { error } from 'console';

const xpath = require('xpath');
const path = require('path');
const archiver = require('archiver');

const app = express();
const port = process.env['PORT'] || 3001;

app.use(express.json()); 
const parser = new DOMParser();
const serializer = new XMLSerializer();



//Per evitare errore CORS
app.use(bodyParser.json(), function (req: Request, res: Response, next: NextFunction) {
    (res as any).set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
    })
    next();
});

//Processo la request
app.post('/scrivifile', (req: Request, res:Response) =>{     

    try {
        console.log('PROCESSAMENTO FILE: file name: '+ req.body.name + ' file size: ' + req.body.size + ' last modified: ' + req.body.lastmodified + ' content: ' + req.body.content);
        if(req.body){
            fs.writeFile(req.body.name, req.body.content, (err: Error) => {if(err) console.log(err)});
            res.status(200).json({esito: true, msg: 'file caricato correttamente'});
        }
    }
    catch(err) {
        res.status(500).send({esito: false, msg: 'file non creato, errore: ' + err});
    }
});


app.post('/xmlinput', async (req: Request, res: Response) =>{

    try {
        console.log("Richiesta ricevuta")
        const jsonpath = "C://Users//simon//Desktop//work//j2x//output//";
        const filename = req.body.name;
        const xmlTemplatesPath = "C://Users//simon//Desktop//work//j2x//templates//";
        const jsonConfig = "C://Users//simon//Desktop//work//j2x//inteface//config.json";
        let fileJson = await fsp.readFile(jsonpath + filename, "utf-8");
        console.log("File JSON letto:", fileJson)
        const jsondata = JSON.parse(fileJson);
        const zipFilesArray = [{ path: fileJson, name: filename }];

        for (const testcaseElement of jsondata.testcase) {
            console.log("Elaborazione testcase");
            for (const atomictestElement of testcaseElement.atomictests) {
                for (const stepElement of atomictestElement.steps) {
                    const input = stepElement.input;
                    const templateMsgInput = input.msg_type;

                    const jsonConfigReader = await fsp.readFile(jsonConfig, 'utf-8');
                    const templateConfigToJson = JSON.parse(jsonConfigReader);

                    if (templateMsgInput in templateConfigToJson) {
                        const templateReader = await fsp.readFile(xmlTemplatesPath + templateMsgInput + ".xml", 'utf-8');
                        const parsedXml = parser.parseFromString(templateReader, 'text/xml');
                        const config = templateConfigToJson[templateMsgInput];

                        //Creo una mappa (mapParams) a partire dai parametri del messaggio (input.msg_params).
                        const mapParams:Map<string, any>=new Map(
                            Object.entries(input.msg_params)
                        )  
                               
                        // Itero su ogni coppia chiave-valore nella mappa dei parametri.
                        mapParams.forEach((value, key) => {
                            // Cerco nell'array msg_params della configurazione un elemento con la chiave corrente.
                            const keyAndValue = config.msg_params.filter((element:any) => element.key == key)

                            // Se esiste esattamente un elemento con la chiave corrente nella configurazione.
                            if (keyAndValue.length == 1){
                                        
                                // Utilizzo XPath per selezionare il nodo XML corrispondente al percorso specificato nella configurazione.
                                let templateNode = xpath.select1(
                                    keyAndValue[0].path, parsedXml
                                ) as Node

                                // Se il nodo è stato trovato, aggiorno il suo contenuto con il valore del parametro corrente.
                                if(templateNode){
                                    templateNode.textContent=value
                                }
                            }
                        })


                        const xmlSerializer = serializer.serializeToString(parsedXml);
                        console.log(xmlSerializer)
                                                               
                        const xmlInputName = `${filename.split('.')[0]}.xml`
                        const xmlInputfilePath = "C://Users//simon//Desktop//work//j2x//xmlgenerati//"+Math.floor(Math.random()*1000000000)+"_"+xmlInputName;
                        
                        
                        try {
                            await fsp.writeFile(xmlInputfilePath, xmlSerializer, "utf-8");
                            // Altre operazioni dopo aver scritto il file
                        } catch (err) {
                            console.error(err);
                            // Gestisci l'errore come necessario
                        }
                        
                        zipFilesArray.push({path: xmlSerializer, name: "Input"+Math.floor(Math.random()*1000000000)+"_"+xmlInputName})
                    }                 
                }
            }
        }
    }
    catch(error){
        console.error("ERRORE ", error)
    }
    
})


app.post('/xmloutput', async (req: Request, res: Response) =>{

    console.log("Richiesta ricevuta")
    const jsonpath = "C://Users//simon//Desktop//work//j2x//output//";
    const filename = req.body.name;
    const xmlTemplatesPath = "C://Users//simon//Desktop//work//j2x//templates//";
    const jsonConfig = "C://Users//simon//Desktop//work//j2x//inteface//config.json";
    let fileJson = await fsp.readFile(jsonpath + filename, "utf-8");
    console.log("File JSON letto:", fileJson)
    const jsondata = JSON.parse(fileJson);
    const xmlOutputName = `${filename.split('.')[0]}.xml`;
    
    let templateReader = null

    for (const testcaseElement of jsondata.testcase) {
        console.log("Elaborazione testcase");
        for (const atomictestElement of testcaseElement.atomictests) {
            for (const stepElement of atomictestElement.steps) {
                const output = stepElement.output;
                const templateMsgOutput = output.msg_type;

                const jsonConfigReader = await fsp.readFile(jsonConfig, 'utf-8');
                const templateConfigToJson = JSON.parse(jsonConfigReader);

                if (templateMsgOutput in templateConfigToJson) {
                    templateReader = await fsp.readFile(xmlTemplatesPath + templateMsgOutput + ".xml", 'utf-8');
                    const parsedXml = parser.parseFromString(templateReader, 'text/xml');
                    const config = templateConfigToJson[templateMsgOutput];

                    const mapParams:Map<string, any>=new Map(
                        Object.entries(output.msg_params)
                    ) 
                    
                    mapParams.forEach((value, key) => {
                        
                        const keyAndValue = config.msg_params.filter((element:any) => element.key == key)
                        
                        if (keyAndValue.length == 1){
                            let templateNode = xpath.select1(
                                keyAndValue[0].path, parsedXml
                            ) as Node

                            if(templateNode){
                                templateNode.textContent=value
                            }
                        }
                    })

                    const xmlSerializer = serializer.serializeToString(parsedXml);
                    console.log(xmlSerializer);

                    const xmlOutputfilePath = "C://Users//simon//Desktop//work//j2x//xmlgeneratioutput//" + Math.floor(Math.random()*1000000000) + "_" + xmlOutputName;

                    try {
                        await fsp.writeFile(xmlOutputfilePath, xmlSerializer);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }
    }
})

app.get('/rdir', async (req: Request, res: Response) =>{

    //lettura file nella dir
    fs.readdir("C://Users//simon//Desktop//work//j2x//xmlgeneratioutput//", (err:Error, files:any) => {
        if (err) {
            res.status(500).send('Errore durante la lettura della directory');
            return;
        }
        res.json(files);
    });
})

app.post('/getzip', async (req: Request, res: Response) =>{
    
    let xmlOutputName = req.body.name
    const xmlOutputPath = "C://Users//simon//Desktop//work//j2x//xmlgeneratioutput//"
    const xmlOutputFile = xmlOutputPath + xmlOutputName
    const jsonConfig = "C://Users//simon//Desktop//work//j2x//inteface//config.json";
    const templateReader = await fsp.readFile(xmlOutputPath + xmlOutputName, 'utf-8');
    const parsedXml = parser.parseFromString(templateReader, 'text/xml');
    let jsonDir = "C://Users//simon//Desktop//work//j2x//output//"
    const zipFilesArray:any = [];


    // Definisce una funzione asincrona per ottenere l'ID dal file XML.
    async function getXmlId(xmlOutputFile:any) {
        try {
            // Legge il file XML specificato e lo parsa.
            const templateReader = await fs.promises.readFile(xmlOutputFile, 'utf-8');
            const parsedXml = parser.parseFromString(templateReader, 'text/xml');

            // Cerca gli elementi con tag 'Id' nel file XML.
            const docIdElements = parsedXml.getElementsByTagName('Id');
            // Se trova elementi 'Id', restituisce il contenuto del primo elemento.
            if (docIdElements.length > 0) {
                const outputId = docIdElements[0].textContent;
                return outputId
            }
            else{
                return error;
            }           
        } 
        catch (err) {
            console.error('Errore', err);
            throw err;
        }
    }


    // Definisce una funzione asincrona per leggere il file Config.
    async function readConfig(jsonConfig: string) {
        try {
            // Legge il file di configurazione e lo restituisce come oggetto JSON.
            const data = await fs.promises.readFile(jsonConfig, 'utf-8');
            return JSON.parse(data);
        } 
        catch (err) {
            console.error('Errore durante la lettura del file di configurazione:', err);
            throw err;
        }
    }


    // Definisce una funzione asincrona per ottenere i msg_params di config.
    async function getMsgParams(msgType:string, jsonConfig: string) {
        try {
            const config = await readConfig(jsonConfig);
            // Verifica se il tipo di messaggio specificato esiste in config.
            if(msgType in config){
                // Restituisce i msg_params per il tipo di messaggio specificato.
                return config[msgType].msg_params;
            }
            else {
                console.log(`msg_type '${msgType}' non trovato nel file di configurazione.`);
                return null;
            }
        } 
        catch (err) {
            console.error('Errore durante la verifica di msg_type:', err);
            throw err;
        }
    }


    // Definisce una funzione asincrona per trovare una corrispondenza in un file JSON.
    async function findMatchInJson(id:any, directoryJson:string) {
        try {
            // Legge i nomi dei file nella directory specificata.
            const files = await fs.promises.readdir(directoryJson);
      
            // Itera attraverso ogni file nella directory.
            for (const file of files) {
                const jsonPath = path.join(directoryJson, file);
                const jsonData = JSON.parse(await fs.promises.readFile(jsonPath, 'utf-8'));
    
                // Itera attraverso il file JSON.
                for (const testcase of jsonData.testcase) {
                    for (const atomictest of testcase.atomictests) {
                        for (const step of atomictest.steps) {

                            // Controlla se esiste una corrispondenza per l'ID nel passo corrente.
                            if (step.output && step.output.msg_params.id === id) {
                                // Se trovata, restituisce i seguenti dettagli.
                                return { fileJson: file, step: step, msgType: step.output.msg_type, input: step.input};
                            }
                        }
                    }
                }        
            }
            return null;
        } 
        catch (err) {
            console.error('Errore durante la scansione dei file JSON:', err);
            throw err;
        }
    }


    // Definisce una funzione asincrona per elaborare i msg_params.
    async function processMsgParams(msgParams:any, jsonConfig:any, msgType:any, foundJsonName: string, jsonOutputParams:any, jsonInputParams: any) {
        if (msgParams) {
            console.log(`msg_params per '${msgType}': `, msgParams);
    
            // Legge il file di configurazione JSON.
            const jsonConfigReader = await fsp.readFile(jsonConfig, 'utf-8');
            const templateConfigToJson = JSON.parse(jsonConfigReader);
            
            // Recupera la configurazione specifica per il tipo di messaggio.
            const config = templateConfigToJson[msgType];

            // Cerca la chiave 'id' e il suo percorso nella configurazione del messaggio.
            const idKeyPath = msgParams.find((param:any) => param.key === 'id');

            if (idKeyPath) {
                const idPath = idKeyPath.path;
                const templateNodeId = xpath.select1(idPath, parsedXml);

                if (templateNodeId) {
                    const idTemplate = templateNodeId.textContent;
                    const idJson = (jsonOutputParams as Record<string, any>)['id']

                    // Controlla la corrispondenza tra i valori di Id
                    if(idTemplate===idJson){
                        console.log("I VALORI ID CORRISPONDONO!"+ idJson + " E " + idTemplate)

                        // Converte i 'msg_params' di config in un array di coppie chiave-valore.
                        let entriesConfig = Object.entries(config.msg_params)
                        console.log("CONFIG ENTRIES ", entriesConfig)

                        // Converte i parametri di output del JSON in un array di coppie chiave-valore.
                        let entriesOutput = Object.entries(jsonOutputParams)
                        console.log("JSON ENTRIES ", entriesOutput)
                        
                        let allMatches = true


                        //Controlla se le chiavi del JSON e quelle di Config corrispondono
                        for(let i = 0; i < entriesOutput.length; i++){
                            const entOutK=entriesOutput[i]
                            const jsonKeys=entOutK[0]

                            const configKeysPaths = config.msg_params.find((param:any) => param.key === entOutK[0])
                            const configKeys = configKeysPaths?.key

                            if(jsonKeys===configKeys){
                                console.log("LA CHIAVE DEL JSON "+jsonKeys+ " E LA CHIAVE DI CONFIG "+configKeys+" CORRISPONDONO")
                            }
                            else{
                                console.log("LE CHIAVI NON CORRISPONDONO")
                                allMatches = false
                            }
                        }

                        // Controlla se i valori dell'XML e del JSON corrispondono
                        for (let i = 0; i < entriesConfig.length; i++) {
                            const element:any = entriesConfig[i];
                            const jsonValues = (jsonOutputParams as Record<string, any>)[element[1].key].toString()

                            const configKeysPaths = config.msg_params.find((param:any) => param.key === element[1].key)
                            const configPaths = configKeysPaths?.path
                            const templateNode = xpath.select1(configPaths, parsedXml) as Node
                            const templateValues = templateNode.textContent?.toString()

                            if(templateValues===jsonValues){
                                console.log("IL VALORE DELL'XML "+templateValues+ " E IL VALORE DEL JSON "+jsonValues+" CORRISPONDONO")
                            }
                            else{
                                console.log("I VALORI "+templateValues+" E "+jsonValues+ " NON CORRISPONDONO")
                                allMatches = false
                            }
                        }

                        // Se tutto corrisponde
                        if (allMatches) {
                            console.log("TUTTO CORRISPONDE");
                            //JSON corrispondente 
                            let foundJson = "C://Users//simon//Desktop//work//j2x//output//" + foundJsonName
                            const foundJsonReader = await fsp.readFile(foundJson, 'utf-8');

                            // Inserisce in un Array il file JSON corrispondente e il file XML di partenza
                            zipFilesArray.push({file: foundJsonReader, name: foundJsonName});
                            zipFilesArray.push({file: templateReader, name: xmlOutputName});
                            
                            //Legge il parametro id di input del JSON corrispondente 
                            const inputId = jsonInputParams.id;

                            //Ricerca il file XML con l'id corrispondente al parametro di input del JSON
                            findXmlInputFile(inputId).then(async xmlInputFilePath => {
                                if (xmlInputFilePath) {
                                    console.log('Found XML Input file:', xmlInputFilePath);
                                    const inputReader = await fsp.readFile(xmlInputFilePath, 'utf-8');
                
                                    //Trovato il file XML legato all'Input del JSON lo aggiunge all'Array
                                    zipFilesArray.push({file: inputReader, name:  path.basename(xmlInputFilePath)})

                                    //Crea un pacchetto Zip contenente tutti i file trovati
                                    const outputZipPath = `C://Users//simon//Desktop//work//j2x//zip//jsonXml_${Math.round(Math.random() * 1000000000000)}.zip`;
                                    const outputZip = fs.createWriteStream(outputZipPath);
                                    const archive = archiver('zip', { zlib: { level: 9 } });
                                
                                    console.log("Creazione del file zip...");
                                    
                                    outputZip.on('close', () => {
                                        console.log('Il pacchetto zip è stato creato con successo!');
                                        if (!res.headersSent) {
                                            res.download(outputZipPath)
                                        }
                                    });
                                    
                                    archive.on('error', (err:Error) => {
                                        console.error('Errore durante la creazione del file zip:', err);
                                        if (!res.headersSent) {
                                            res.status(500).send('Errore durante la creazione del file zip');
                                        }
                                    });
                                    
                                
                                    archive.pipe(outputZip);
                                
                                    zipFilesArray.forEach((element:any) => {
                                        if (element.file) {
                                            archive.append(element.file, { name: element.name });
                                        } else if (element.file) {
                                            archive.file(element.file, { name: element.name });
                                        }
                                    });
                            
                                    await archive.finalize();
                                } 
                                else {
                                    console.log("XML Input file not found")
                                }
                            })

                            

                        }
                        else {
                            console.log("allMatches è false o non definito");
                        }
                    }
                }
            }            
        }
    }


    // Utilizza la funzione getXmlId per ottenere l'ID dal file XML di output.
    getXmlId(xmlOutputFile).then(id => {
        // Cerca una corrispondenza per l'ID trovato nei file JSON.
        findMatchInJson(id, jsonDir).then(result => {
            if (result) {
                let msgType = result.msgType;
                let foundJsonName = result.fileJson

                let jsonOutputParams = result.step.output.msg_params
                let jsonInputParams = result.step.input.msg_params
                console.log(jsonInputParams)

                // Ottiene i parametri e poi li processa.
                getMsgParams(msgType, jsonConfig).then(msgParams => {
                    processMsgParams(msgParams, jsonConfig, msgType, foundJsonName, jsonOutputParams, jsonInputParams)
                });
            } 
            else {
                console.log('Nessuna corrispondenza trovata.');
            }
        });
    })
    .catch(err => {
        console.error(err);
    });


    // Definisce una funzione asincrona per trovare il file XML di input corrispondente.
    async function findXmlInputFile(inputId:any) {
        const inputDir ="C://Users//simon//Desktop//work//j2x//xmlgenerati//"

        try {
            const files = await fs.promises.readdir(inputDir);
        
            for (const file of files) {
              const fileXmlInputPath = path.join(inputDir, file);
              const xmlReader = await fs.promises.readFile(fileXmlInputPath, 'utf-8');
              const parsedXml = new DOMParser().parseFromString(xmlReader, 'text/xml');
              const idElements = parsedXml.getElementsByTagName('Id');

                if (idElements.length > 0 && idElements[0].textContent === inputId) {
                    return fileXmlInputPath;
                }
            }        
            return null;
        } catch (err) {
            console.error('Errore durante la scansione dei file JSON:', err);
            throw err;
        }
    }
})


//Processo la delete
app.delete('/deletefile/:fileName', (req:Request, res:Response)=>{
    try {
        let fileName=req.params.fileName
        console.log(fileName)
        fs.rm('C:\\Users\\simon\\Desktop\\work\\j2x\\output\\'+fileName, (err:Error)=>{if(err) throw err})
        res.status(200).send({fileName})
    }
    catch(err) {
        res.status(500).send({esito: false, msg: 'file non eliminato, errore: ' + err});
    }
   
})

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));