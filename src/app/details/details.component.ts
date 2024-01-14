import { Component } from '@angular/core';
import { FileService } from '../services/file.service';
import * as fileSaver from 'file-saver';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {

  files:Array<any>=[]
  data:any

  constructor(private fileservice:FileService){}
 
  //al caricamento della pagina richiamo il metodo getFiles()
  ngOnInit(){
    this.getFiles()
  }

  //Richiamo il metodo dbget() del service
  getFiles(){
    this.fileservice.dbget().subscribe(
      (data)=>{
        this.files=data
        console.log(this.files)
      }
    )
  }

  //Metodo per eseguire il download del file
  downloadData(item:any){
    if(item){
      const blob=new Blob([item.content], {type:"text/plain"}) //genero un Blob
      fileSaver.saveAs(blob, `${item.name}`) //grazie alla libreria file-saver effettuo il salvataggio del blob
    }
  }

  //Richiamo il metodo fileDelete() dal serivce
  delete(id:number){
    this.fileservice.fileDelete(id).subscribe((data)=>{console.log(data+"deleted")})
    location.reload()
  }

  //Richiamo il metodo fileDeleteServer() dal service
  deleteRequest(filename:string, id:number){
    this.fileservice.fileDeleteServer(filename).subscribe((data)=>{console.log(data)})
    this.delete(id) //richiamo il metodo delete
  }

  getXmlInput(filename:string){
    this.fileservice.getXmlInput(filename).subscribe()
  }

  getXmlOutput(filename:string){
    this.fileservice.getXmlOutput(filename).subscribe()
  }
  

}
