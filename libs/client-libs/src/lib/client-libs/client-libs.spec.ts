import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientLibs } from './client-libs';

describe('ClientLibs', () => {
  let component: ClientLibs;
  let fixture: ComponentFixture<ClientLibs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLibs],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientLibs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
