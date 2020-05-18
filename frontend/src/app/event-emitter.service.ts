import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventEmitterService {

    invokeFirstComponentFunction = new EventEmitter();
    userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    subsVar: Subscription;
    
    constructor() { }

    onFirstComponentButtonClick() {
        this.invokeFirstComponentFunction.emit();
    }

    userLoggedInEvent(val) {
        this.userLoggedIn.next(val)
    }
}