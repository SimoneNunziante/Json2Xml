import { TestBed } from '@angular/core/testing';
import { AcquireComponent } from './acquire.component';
describe('AcquireComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AcquireComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(AcquireComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=acquire.component.spec.js.map