import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  registerForm!: FormGroup;
  showPassword: WritableSignal<boolean> = signal(false);
  showConfirmPassword: WritableSignal<boolean> = signal(false);

  //For best bractice => initialize fb valu inside ngOninit
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initRegisterForm();
  }
  initRegisterForm() {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      rePassword: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      terms: [false, Validators.requiredTrue],
    }, { validators: this.checkConfirmPassword });
  }


  errorMsg: WritableSignal<string> = signal('');
  successMsg: WritableSignal<string> = signal('');
  register() {

    if (this.registerForm.valid) {
      console.log('form: ', this.registerForm.value);
      // Destructure the form value:
      // - 'terms' will be extracted as a separate variable
      // - '...payload' will contain the rest of the form fields without 'terms'
      const { terms, ...payload } = this.registerForm.value; //3shan nshel el terms
      console.log('payload', payload);

      this.authService.singUp(payload).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message == "success") {
            //1. hide Error message
            this.errorMsg.set('');
            //2. show success message
            this.successMsg.set('Account Created Successfully');
            //3.navigate to login page
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000)

          }
        },
        error: (err) => {
          console.log(err);
          //1. show Error message
          this.successMsg.set('');
          //2. hide success message
          this.errorMsg.set(err.error.message);
        }
      })
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
}
