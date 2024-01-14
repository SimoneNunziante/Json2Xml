import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { AcquireComponent } from './acquire/acquire.component';
import { XmloutputComponent } from './xmloutput/xmloutput.component';

const routes: Routes = [
  {component: DetailsComponent, path:'details'},
  {component: AcquireComponent, path: 'acquire'},
  {component: XmloutputComponent, path: 'output'},
  {component: AcquireComponent, path: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
