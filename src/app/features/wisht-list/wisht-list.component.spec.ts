import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishtListComponent } from './wisht-list.component';

describe('WishtListComponent', () => {
  let component: WishtListComponent;
  let fixture: ComponentFixture<WishtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishtListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WishtListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
