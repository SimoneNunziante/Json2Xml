import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
let FileService = class FileService {
    constructor(http) {
        this.http = http;
    }
    //Chiamata GET db.json
    dbget() {
        return this.http.get('http://localhost:3000/file');
    }
    //Chiamata POST db.json
    uploadFile(name, size, lastmodified, content) {
        const payload = { 'name': name, 'size': size, 'lastmodified': lastmodified, 'content': content };
        return this.http.post('http://localhost:3000/file', payload);
    }
    //Chiamata POST server.js
    writeFile(name, size, lastmodified, content) {
        const payload = { name: `C:\\Users\\Utente\\Desktop\\AngularWS\\projectangular2\\output\\${name}`, size: size, lastmodified: lastmodified, content: content };
        return this.http.post('http://localhost:3001/scrivifile', payload).pipe(catchError(error => {
            console.log('ERRORE WRITE FILE: ' + error.msg);
            return of(error);
        }));
    }
    //Chiamata DELETE db.json
    fileDelete(id) {
        return this.http.delete(`http://localhost:3000/file/${id}`);
    }
    //Chiamata DELETE server.js
    fileDeleteServer(filename) {
        return this.http.delete(`http://localhost:3001/deletefile/${filename}`);
    }
    /*
    getXml(name:string){
      const payload={name : name}
      return this.http.post("http://localhost:3001/xml", payload)
    }
    */
    getXml(name) {
        return this.http.post("http://localhost:3001/xml", { name: name }, { responseType: 'blob' });
    }
};
FileService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FileService);
export { FileService };
//# sourceMappingURL=file.service.js.map