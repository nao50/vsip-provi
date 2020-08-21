import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpgComponent } from './vpg.component';

describe('VpgComponent', () => {
  let component: VpgComponent;
  let fixture: ComponentFixture<VpgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
