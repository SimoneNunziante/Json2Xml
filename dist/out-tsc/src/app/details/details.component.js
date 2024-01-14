import { __decorate } from "tslib";
import { Component } from '@angular/core';
import * as fileSaver from 'file-saver';
let DetailsComponent = class DetailsComponent {
    constructor(fileservice) {
        this.fileservice = fileservice;
        this.files = [];
    }
    //al caricamento della pagina richiamo il metodo getFiles()
    ngOnInit() {
        this.getFiles();
    }
    //Richiamo il metodo dbget() del service
    getFiles() {
        this.fileservice.dbget().subscribe((data) => {
            this.files = data;
            console.log(this.files);
        });
    }
    //Metodo per eseguire il download del file
    downloadData(item) {
        if (item) {
            const blob = new Blob([item.content], { type: "text/plain" }); //genero un Blob
            fileSaver.saveAs(blob, `${item.name}`); //grazie alla libreria file-saver effettuo il salvataggio del blob
        }
    }
    //Richiamo il metodo fileDelete() dal serivce
    delete(id) {
        this.fileservice.fileDelete(id).subscribe((data) => { console.log(data + "deleted"); });
        location.reload();
    }
    //Richiamo il metodo fileDeleteServer() dal service
    deleteRequest(filename, id) {
        this.fileservice.fileDeleteServer(filename).subscribe((data) => { console.log(data); });
        this.delete(id); //richiamo il metodo delete
    }
    /*
    getXml(filename:string){
      this.fileservice.getXml(filename).subscribe((data)=>{console.log(data)})
    }
    */
    getXml(filename) {
        this.fileservice.getXml(filename).subscribe((data) => {
            // Crea un oggetto URL per il blob restituito dal server
            const blobUrl = URL.createObjectURL(data);
            // Crea un elemento <a> per effettuare il download
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${filename.split('.')[0]}.xml`;
            document.body.appendChild(a);
            // Simula un click sull'elemento <a> per avviare il download
            a.click();
            // Rimuovi l'elemento <a> dopo il download
            document.body.removeChild(a);
        });
    }
};
DetailsComponent = __decorate([
    Component({
        selector: 'app-details',
        templateUrl: './details.component.html',
        styleUrls: ['./details.component.css']
    })
], DetailsComponent);
export { DetailsComponent };
//# sourceMappingURL=details.component.js.map