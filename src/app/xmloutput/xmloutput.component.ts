import { Component } from '@angular/core';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-xmloutput',
  templateUrl: './xmloutput.component.html',
  styleUrls: ['./xmloutput.component.css']
})
export class XmloutputComponent {

  constructor(private fileservice:FileService){}

  dirfiles:Array<any>=[]

  ngOnInit(){
    this.getrdir()
  }

  getrdir(){
    this.fileservice.getdir().subscribe((data)=>{
      this.dirfiles=data
      console.log(this.dirfiles)
    })
  }

  getZip(filename:string){
    this.fileservice.getZip(filename).subscribe(
      (blob:Blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = `${filename.split('.')[0]}.zip`;
        anchor.href = url;
        anchor.click();
      }
    )
  }
}
