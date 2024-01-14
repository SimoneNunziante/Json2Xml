import { TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
describe('DetailsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DetailsComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=details.component.spec.js.map