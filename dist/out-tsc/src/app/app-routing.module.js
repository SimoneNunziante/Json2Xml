import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { AcquireComponent } from './acquire/acquire.component';
const routes = [
    { component: DetailsComponent, path: 'details' },
    { component: AcquireComponent, path: 'acquire' },
    { component: AcquireComponent, path: '' }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map