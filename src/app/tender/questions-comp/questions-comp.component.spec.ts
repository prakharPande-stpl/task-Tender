import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsCompComponent } from './questions-comp.component';

describe('QuestionsCompComponent', () => {
  let component: QuestionsCompComponent;
  let fixture: ComponentFixture<QuestionsCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsCompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
