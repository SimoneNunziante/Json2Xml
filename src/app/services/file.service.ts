import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }

  //Chiamata GET db.json
  dbget():Observable<any>{
    return this.http.get('http://localhost:3000/file')
  }

  //Chiamata POST db.json
  uploadFile(name:string, size:string, lastmodified:string, content:string):Observable<any>{
    const payload={'name': name, 'size': size, 'lastmodified': lastmodified, 'content': content}
    return this.http.post('http://localhost:3000/file', payload)
  }

  //Chiamata POST server.js
  writeFile(name:string, size:string, lastmodified:string, content:string):Observable<any>{
    const payload={name: `C:\\Users\\simon\\Desktop\\work\\j2x\\output\\${name}`, size: size, lastmodified: lastmodified, content: content};
    return this.http.post('http://localhost:3001/scrivifile', payload).pipe(
      catchError(error => {
      console.log('ERRORE WRITE FILE: ' + error.msg);
      return of(error);
    })
    )
  }
  
  //Chiamata DELETE db.json
  fileDelete(id:number){
    return this.http.delete(`http://localhost:3000/file/${id}`)
  }

  //Chiamata DELETE server.js
  fileDeleteServer(filename:string){
    return this.http.delete(`http://localhost:3001/deletefile/${filename}`)
  }

  getXmlInput(name: string):Observable<Blob>{
    return this.http.post("http://localhost:3001/xmlinput", {name: name}, {responseType: 'blob'})
  }

  getXmlOutput(name:string):Observable<Blob>{
    return this.http.post("http://localhost:3001/xmloutput", {name: name}, {responseType: 'blob'})
  }

  getdir():Observable<any>{
    return this.http.get("http://localhost:3001/rdir")
  }

  getZip(name:string):Observable<Blob>{
    return this.http.post("http://localhost:3001/getzip", {name: name}, {responseType: 'blob'})
  }
}
