import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailPage } from './stock-detail.page';

describe('StockDetailPage', () => {
  let component: StockDetailPage;
  let fixture: ComponentFixture<StockDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
