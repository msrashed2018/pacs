
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { ProfileServices } from '../services/profile.service';
import { EventEmitterService } from "../event-emitter.service";
import { Globals } from "../globals";
import { ConfigClass } from '../config';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  inValid = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private idle: Idle,
    private profileServices: ProfileServices,
    private eventEmitterService: EventEmitterService,
    private globals: Globals
  ) { }
  ngOnInit() {
    sessionStorage.clear();
    ConfigClass.setPrivilageStatus = true;
    this.loginForm = this.formBuilder.group({
      username: ["admin", Validators.required],
      password: ["admin", Validators.required]
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          
          // this.globals.se
          this.eventEmitterService.userLoggedInEvent(true);
          this.profileServices.GetProfile().subscribe(result => {
            var index = result.roles.findIndex(x => x.name === "SUPER_ADMIN");
            if (index > -1) {
              ConfigClass.setPrivilageStatus = false;
            }
            else {
              ConfigClass.setPrivilageStatus = true;
            }
            var adminIndex = result.roles.findIndex(x => x.name === "USER");
            if (adminIndex < 0 && index < 0) {
              this.globals.presentErrorToast("Sorry, you aren`t permitted to use this website");
            }
            else {
              if (result.privileges) {
                let privilage = result.privileges;
                sessionStorage.setItem('privilage', JSON.stringify(privilage));
              } else {
                sessionStorage.setItem('privilage', JSON.stringify([]));
              }
              this.router.navigate(["dashboard"]);
            }
          });

        }
      );
  }
}
