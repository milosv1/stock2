import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAddPage } from './stock-add.page';

describe('StockAddPage', () => {
  let component: StockAddPage;
  let fixture: ComponentFixture<StockAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
