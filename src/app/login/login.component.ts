import { Component, DoBootstrap, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../database.service';

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
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['charlie.barrows@gmail.com', Validators.required],
      password: ['2020', Validators.required],
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

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    try {
      await this.db.login(this.f['username'].value, this.f['password'].value);
      this.router.navigateByUrl('/game');
    } catch (error) {
      console.error(error);
      this.loading = false;
    }
  }

  logout() {
    this.db.logout();
  }
}
