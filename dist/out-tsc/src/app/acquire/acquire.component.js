import { __decorate } from "tslib";
import { Component } from '@angular/core';
let AcquireComponent = class AcquireComponent {
    constructor(fileservice, router) {
        this.fileservice = fileservice;
        this.router = router;
        this.file = null;
        this.fileName = '';
        this.fileDate = '';
        this.fileSize = '';
        this.arrayFile = [];
        this.fileContent = '';
    }
    //evento che si verifica al caricamento dei dati
    onChange(event) {
        const file = event.target.files[0];
        console.log(file);
        this.fileName = event.target.files[0].name;
        this.fileDate = event.target.files[0].lastModifiedDate;
        this.fileSize = event.target.files[0].size;
        this.arrayFile = [{ name: this.fileName, date: this.fileDate, size: this.fileSize }];
        console.log(this.arrayFile);
        if (file) {
            this.file = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.fileContent = e.target.result;
            };
            reader.readAsText(file); //leggo il contenuto del file
        }
    }
    //evento che si verifica al click sul button, "catturo" i dati (se necessario li converto a stringa) e li passo come arguments.
    onUpload() {
        if (this.file) {
            const fileTargetName = Math.floor(Math.random() * 100000000000).toString() + "_" + this.fileName;
            console.log(fileTargetName);
            console.log(this.file);
            const fileTargetContent = this.fileContent;
            //console.log(fileTargetContent)
            const fileTargetSize = this.fileSize;
            const sizeToString = fileTargetSize.toString();
            //console.log(sizeToString)
            const fileTargetDate = this.fileDate;
            //console.log(typeof fileTargetDate)
            //chiamata POST
            this.fileservice.uploadFile(fileTargetName, sizeToString, fileTargetDate, fileTargetContent).subscribe(data => {
                console.log(data);
                this.router.navigate(['details']); //redirect alla rotta 'details'
            });
            this.fileservice.writeFile(fileTargetName, sizeToString, fileTargetDate, fileTargetContent).subscribe((data) => {
                console.log("RISPOSTA: " + data);
            });
        }
    }
};
AcquireComponent = __decorate([
    Component({
        selector: 'app-acquire',
        templateUrl: './acquire.component.html',
        styleUrls: ['./acquire.component.css']
    })
], AcquireComponent);
export { AcquireComponent };
//# sourceMappingURL=acquire.component.js.map