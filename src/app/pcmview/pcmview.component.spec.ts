import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcmviewComponent } from './pcmview.component';

describe('PcmviewComponent', () => {
  let component: PcmviewComponent;
  let fixture: ComponentFixture<PcmviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcmviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcmviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
