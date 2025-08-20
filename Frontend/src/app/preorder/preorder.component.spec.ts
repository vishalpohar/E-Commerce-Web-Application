import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderComponent } from './preorder.component';

describe('PreorderComponent', () => {
  let component: PreorderComponent;
  let fixture: ComponentFixture<PreorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreorderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
