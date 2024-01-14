import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
describe('FileService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FileService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=file.service.spec.js.map