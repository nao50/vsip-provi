import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmStaticIpDialogComponent } from './confirm-static-ip-dialog.component';

describe('ConfirmStaticIpDialogComponent', () => {
  let component: ConfirmStaticIpDialogComponent;
  let fixture: ComponentFixture<ConfirmStaticIpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmStaticIpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmStaticIpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
