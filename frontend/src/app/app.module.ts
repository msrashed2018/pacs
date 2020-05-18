import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AgmCoreModule } from "@agm/core";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule, MatDialogClose } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { BrowserModule } from "@angular/platform-browser";
import { ProjectsAddModalComponent } from "./projects-add-modal/projects-add-modal.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { LoginComponent } from "./login/login.component";
import { SubscriptionUpdatePriceComponent } from "./subscription-update-price/subscription-update-price.component";
import { OrdersAddModalComponent } from "./orders-add-modal/orders-add-modal.component";
import { CarAccessCardAddSerialComponent } from "./car-access-card-add-serial/car-access-card-add-serial.component";
import { AppHttpInterceptor } from "./AppHttpInterceptor";
import { UsersModalComponent } from "./Users-modal/users-modal.component";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule, MatRadioGroup } from "@angular/material/radio";
import { ChartsModule } from "ng2-charts";
import { SubscriptionMoreDetailsComponent } from "./subscription-more-details/subscription-more-details.component";
import { EventEmitterService } from "./event-emitter.service";
import { DeleteConfirmationComponent } from "./delete-confirmation/delete-confirmation.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { CustomizeOrdersAddModalComponent } from "./customize-orders-add-modal/customize-orders-add-modal.component";
import { OffersModalComponent } from "./offers-modal/offers-modal.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule
} from "@angular-material-components/datetime-picker";
import { MomentModule } from "angular2-moment";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CategroisSubscribtionAddComponent } from './categrois-subscribtion-add/categrois-subscribtion-add.component';
import { Globals } from "./globals";
import { ConfigClass } from './config';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    ChartsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatCheckboxModule,
    AgmCoreModule.forRoot({
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY"
    }),
    NgIdleKeepaliveModule.forRoot(),
    MomentModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ProjectsAddModalComponent,
    LoginComponent,
    SubscriptionUpdatePriceComponent,
    OrdersAddModalComponent,
    CustomizeOrdersAddModalComponent,
    CarAccessCardAddSerialComponent,
    UsersModalComponent,
    SubscriptionMoreDetailsComponent,
    DeleteConfirmationComponent,
    ConfirmationComponent,
    OffersModalComponent,
    CategroisSubscribtionAddComponent,
    AddUserModalComponent,
  
  ],

  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatDialogClose,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatCheckboxModule
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
    EventEmitterService,
    Globals,
    ConfigClass
  ],
  bootstrap: [AppComponent],
  entryComponents: [ProjectsAddModalComponent]
})
export class AppModule { }
