import { Component } from '@angular/core';
import { FileService } from '../services/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acquire',
  templateUrl: './acquire.component.html',
  styleUrls: ['./acquire.component.css']
})
export class AcquireComponent {

  file:File|null=null
  fileName:string=''
  fileDate:string=''
  fileSize:string=''
  arrayFile:Array<any>=[]
  fileContent:string=''
 

  constructor(private fileservice:FileService, private router:Router){}

  //evento che si verifica al caricamento dei dati
  onChange(event:any){
    const file:File=event.target.files[0]
    console.log(file)
    this.fileName=event.target.files[0].name
    this.fileDate=event.target.files[0].lastModifiedDate
    this.fileSize=event.target.files[0].size

    this.arrayFile=[{name: this.fileName, date: this.fileDate, size: this.fileSize}]
    console.log(this.arrayFile)

    if(file){
      this.file=file
      const reader=new FileReader() 

      reader.onload=(e:any)=>{
        this.fileContent=e.target.result 
      }

      reader.readAsText(file) //leggo il contenuto del file
    }
  }

  //evento che si verifica al click sul button, "catturo" i dati (se necessario li converto a stringa) e li passo come arguments.
  onUpload(){
    if(this.file){
      const fileTargetName=Math.floor(Math.random()*100000000000).toString()+"_"+this.fileName
      console.log(fileTargetName)
      console.log(this.file)

      const fileTargetContent=this.fileContent
      //console.log(fileTargetContent)

      const fileTargetSize=this.fileSize
      const sizeToString=fileTargetSize.toString()
      //console.log(sizeToString)

      const fileTargetDate=this.fileDate
      //console.log(typeof fileTargetDate)

      //chiamata POST
      this.fileservice.uploadFile(fileTargetName, sizeToString, fileTargetDate, fileTargetContent).subscribe(data=>{
        console.log(data)
        this.router.navigate(['details']) //redirect alla rotta 'details'
      })
      
      this.fileservice.writeFile(fileTargetName, sizeToString, fileTargetDate, fileTargetContent).subscribe((data) => {
        console.log("RISPOSTA: " + data);
      });
    }
  }



}
