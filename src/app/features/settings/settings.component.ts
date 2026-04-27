import { Component, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../../core/models/MyJwtPayload/my-jwt-payload.interface';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../core/models/IUser/iuser.interface';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {

  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toastrService = inject(ToastrService);
  userName: WritableSignal<string> = signal('');
  userId: WritableSignal<string> = signal('');
  userData: WritableSignal<IUser> = signal({} as IUser);

  errorMsg: WritableSignal<string> = signal('');

  private readonly fb = inject(FormBuilder);
  changePasswordForm!: FormGroup;
  changeUserDataForm!: FormGroup;


  showNewPassword: WritableSignal<boolean> = signal(false);
  showCurrentPassword: WritableSignal<boolean> = signal(false);
  showRePassword: WritableSignal<boolean> = signal(false);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getUserID();
    this.initForms();
    this.getCurrentUser();

  }


  initForms() {
    //Change Password Form
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      rePassword: [null, Validators.required],
    }, { validators: this.checkConfirmPassword });


    this.changeUserDataForm = this.fb.group({
      name: [this.userName() ?? null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    })
  }
  getUserID() {
    if (!this.authService.userId()) {
      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('eCommerceToken') || sessionStorage.getItem('eCommerceToken');
        if (token) {
          const decoded = jwtDecode<MyJwtPayload>(token); // Returns with the JwtPayload type
          this.userId.set(decoded.id)
          this.userName.set(decoded.name)
          this.authService.userId.set(decoded.id);
          this.authService.userName.set(decoded.name);
        }
      }
    }
    else {
      this.userId.set(this.authService.userId());
      this.userName.set(this.authService.userName());


    }
    console.log(this.userName());
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const payload = this.changePasswordForm.value;
      console.log('form: ', payload);

      this.authService.chanegPassword(payload).subscribe({
        next: (res) => {
          console.log('Response:', res);

          if (res.message === 'success') {
            if (localStorage.getItem('eCommerceToken')) {
              localStorage.setItem('eCommerceToken', res.token);
            } else if (sessionStorage.getItem('eCommerceToken')) {
              sessionStorage.setItem('eCommerceToken', res.token);
            }


            this.authService.userId.set(res.user.id);
            this.authService.userName.set(res.user.name);
            this.userName.set(res.user.name);


            this.changePasswordForm.reset();

            alert('Password Changes Successfully');
          }
        },
        error: (err) => {
          console.log('Change Password Error:', err);

          const errorMessage = err.error?.message || "Failed to change password. Please try again.";
          this.errorMsg.set(errorMessage);


          this.toastrService.error(errorMessage, 'Update Failed');
          setTimeout(() => {
            this.errorMsg.set('');
          }, 5000);
        }
      });
    }
  }

  checkConfirmPassword(form: AbstractControl) {
    //1. get password value
    let password = form.get('password')?.value;
    //2. get rePassword value
    let rePassword = form.get('rePassword')?.value;
    //3. check
    if (password === rePassword) {
      return null;
    }
    else {
      return { mismatch: true };
    }
  }

  getCurrentUser() {
    this.authService.getCurrentUser(this.userId()).subscribe({
      next: (res) => {

        this.userData.set(res.data);
        console.log('user data :', this.userData());

        this.changeUserDataForm.patchValue({
          email: res?.data?.email || '',
          phone: res?.data?.phone || ''
        });
      },
      error: (err) => {
        console.log(err);
      }
    });

  }
  updateInfoErrorMsg: WritableSignal<string> = signal('');

  updateUserData() {
    if (this.changeUserDataForm.valid) {
      const payload = this.changeUserDataForm.value;
      console.log('payload: ', payload);

      this.authService.updataLoggedUserData(payload).subscribe({
        next: (res) => {
          console.log(res);
          this.updateInfoErrorMsg.set('');
          this.toastrService.success("Your Indo Updated Successfully")
        },
        error: (err) => {
          console.log(err);
          this.updateInfoErrorMsg.set(err.error.errors.msg)
        }
      });
    }
    else {
      console.log('invalid');

      this.changeUserDataForm.markAllAsTouched();
    }
  }
}
