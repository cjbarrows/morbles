import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../database.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private db: DatabaseService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toasts: ToastService
  ) {
    this.form = this.formBuilder.group({
      username: ['charlie.barrows@gmail.com', Validators.required],
      password: ['2022', Validators.required],
    });
  }

  ngOnInit() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  showMe() {
    this.db.showMe();
  }

  setMe() {
    this.db.setMe();
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    try {
      const response = await this.db.login(
        this.f['username'].value,
        this.f['password'].value
      );
      console.log(response);
      this.router.navigateByUrl(this.db.getPostLoginRedirect() || '/levels');
    } catch (error: any) {
      this.loading = false;
      this.toasts.show(
        'Login Error',
        (error && error.error && error.error.error) || 'Sorry!'
      );
    }
  }

  logout() {
    this.db.logout();
  }
}
