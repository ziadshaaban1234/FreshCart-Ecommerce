import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsFilterComponent } from './brands-filter.component';

describe('BrandsFilterComponent', () => {
  let component: BrandsFilterComponent;
  let fixture: ComponentFixture<BrandsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
