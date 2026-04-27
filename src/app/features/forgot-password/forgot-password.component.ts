import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  currentStep: WritableSignal<number> = signal(1);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  forgotPasswordForm!: FormGroup;
  verifyResetCodeForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  errorMsg: WritableSignal<string> = signal('');
  successMsg: WritableSignal<string> = signal('');
  showPassword: WritableSignal<boolean> = signal(false);


  ngOnInit(): void {
    this.initForms()
  }


  initForms() {
    //Step 1 form
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    })

    //Step 2 form
    this.verifyResetCodeForm = this.fb.group({
      resetCode: [null, [Validators.required]],
    })

    //Step 2 form
    this.resetPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    })
  }


  //Step 1 (email)
  forgotPassword() {
    console.log(this.forgotPasswordForm.value);
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (res) => {
          console.log(res);
          //1- hide error msg
          this.errorMsg.set('');
          //2- show success msg
          this.successMsg.set(res.message);
          //3- Navigate to second step
          setTimeout(() => {
            this.currentStep.set(2);
            this.errorMsg.set('');
            this.successMsg.set('');
          }, 2000);
        },
        error: (err) => {
          console.log(err);
          //1- hide success msg
          this.successMsg.set('');
          //2- show error msg
          this.errorMsg.set(err.error.message);

        }
      })
    }
  }
  //Step 2 (reset code)
  verifyResetCode() {
    console.log(this.verifyResetCodeForm.value);

    if (this.verifyResetCodeForm.valid) {
      this.authService.verifyResetCode(this.verifyResetCodeForm.value).subscribe({
        next: (res) => {
          //1- hide error msg
          this.errorMsg.set('');
          //2- show success msg
          this.successMsg.set(res.message);
          //3- Navigate to second step
          setTimeout(() => {
            this.currentStep.set(3)
            this.errorMsg.set('');
            this.successMsg.set('');
          }, 2000);
        },
        error: (err) => {
          //1- hide success msg
          this.successMsg.set('');
          //2- show error msg
          this.errorMsg.set(err.error.message);

        }
      })
    }
  }


  //Step 3 (reset password)
  resetPassword() {
    console.log(this.resetPasswordForm.value);

    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          //1- hide error msg
          this.errorMsg.set('');
          //2- show success msg
          this.successMsg.set(res.message);
          setTimeout(() => {
            this.errorMsg.set('');
            this.successMsg.set('');
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          //1- hide success msg
          this.successMsg.set('');
          //2- show error msg
          this.errorMsg.set(err.error.message);

        }
      })
    }


  }
}
