import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotpasswordPage } from './forgotpassword.page';
import { IonicModule } from '@ionic/angular';

describe('ForgotpasswordPage', () => {
  let component: ForgotpasswordPage;
  let fixture: ComponentFixture<ForgotpasswordPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotpasswordPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotpasswordPage); //????????????????
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});