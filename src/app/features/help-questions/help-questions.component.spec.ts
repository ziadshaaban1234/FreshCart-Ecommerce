import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpQuestionsComponent } from './help-questions.component';

describe('HelpQuestionsComponent', () => {
  let component: HelpQuestionsComponent;
  let fixture: ComponentFixture<HelpQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpQuestionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpQuestionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
