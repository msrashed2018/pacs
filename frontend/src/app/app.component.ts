import { Component } from "@angular/core";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Router } from "@angular/router";
import { Keepalive } from "@ng-idle/keepalive";
import { EventEmitterService } from "./event-emitter.service";
import { Globals } from "./globals";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(
    private idle: Idle,
    private router: Router,
    private keepalive: Keepalive,
    private eventEmitterService: EventEmitterService,
    private globals: Globals
  ) {

    this.eventEmitterService.userLoggedIn.subscribe(result => {
      if (result) {
        this.idle.watch();
      }
    })


    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(600);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => console.log("No longer idle."));
    this.idle.onTimeout.subscribe(() => {
      this.router.navigate(["login"]).then(res => {
        this.globals.presentErrorToast("You have been inactive for a while, for your information security you have been logged out automatically");
      });
    });
    this.idle.onIdleStart.subscribe();
    this.idle.onTimeoutWarning.subscribe();

    // sets the ping interval to 15 seconds
    this.keepalive.interval(600);

    this.keepalive.onPing.subscribe();
  }
}
