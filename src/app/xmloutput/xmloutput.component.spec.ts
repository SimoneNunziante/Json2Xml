import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmloutputComponent } from './xmloutput.component';

describe('XmloutputComponent', () => {
  let component: XmloutputComponent;
  let fixture: ComponentFixture<XmloutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XmloutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XmloutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
