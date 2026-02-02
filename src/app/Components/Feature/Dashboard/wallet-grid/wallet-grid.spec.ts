import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletGrid } from './wallet-grid';
import { LanguageService } from '../../../../Core/Services/Language/language.service';

describe('WalletGrid', () => {
  let component: WalletGrid;
  let fixture: ComponentFixture<WalletGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletGrid],
      providers: [
        {
          provide: LanguageService,
          useValue: {
            isAr: () => true,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
