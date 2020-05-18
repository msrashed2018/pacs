import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { ProperityComponent } from "../../properity/properity.component";
import { OrdersComponent } from "../../orders/orders.component";
import { SubscriptionComponent } from "../../subscription/subscription.component";
import { SubscriptionCatgComponent } from "../../subscription-catg/subscription-catg.component";
import { ProjectsComponent } from "../../projects/projects.component";
import { CustomizedServicesComponent } from "../../customized-services/customized-services.component";
import { CustomizedServicesItemsAddModalComponent } from "../../customized-services-items-add-modal/customized-services-items-add-modal.component";
import { SubscribtionCatgsItemsAddModalComponent } from "../../subscribtion-catgs-items-add-modal/subscribtion-catgs-items-add-modal.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule, MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { CarAccessCardComponent } from "app/car-access-card/car-access-card.component";
// import { ChartsModule } from "ng2-charts";
import { CdkColumnDef } from "@angular/cdk/table";
import { ControlUserComponent } from "app/control-user/control-user.component";
import { MatRadioModule, MatRadioGroup } from "@angular/material/radio";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ComponentsModule } from "../../components/components.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ProperityAddModalComponent } from "../../properity-add-modal/properity-add-modal.component";
import { GateAccessComponent } from "../../gate-access/gate-access.component";
import { CustomizeOrdersComponent } from "../../customize-orders/customize-orders.component";
import { OffersComponent } from "../../offers/offers.component";
import { CategroisSubscribtionComponent } from "../../categrois-subscribtion/categrois-subscribtion.component";
import { DicomViewerComponent } from "app/dicom-viewer/dicom-viewer.component";
import { SharedModule } from "app/shared/shared.module";
import { ApplicationEntitiesComponent } from "app/application-entities/application-entities.component";
import { AddApplicationEntityComponent } from "app/application-entities/add-application-entity/add-application-entity.component";
import { DirectoryWatcherComponent } from "app/directory-watcher/directory-watcher.component";
import { DicomsSearchComponent } from "app/dicoms-search/dicoms-search.component";
import { DicomsUploaderComponent } from "app/dicoms-uploader/dicoms-uploader.component";
import { FileUploadModule } from 'ng2-file-upload';
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatRadioModule,
    FileUploadModule,
    // ChartsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ComponentsModule,
    MatSlideToggleModule,
    SharedModule,
    MatCheckboxModule
    // ImageViewerModule,
  ],
  declarations: [
    DashboardComponent,
    ProperityComponent,
    OrdersComponent,
    CustomizeOrdersComponent,
    CarAccessCardComponent,
    ControlUserComponent,
    SubscriptionComponent,
    ProjectsComponent,
    CustomizedServicesComponent,
    CustomizedServicesItemsAddModalComponent,
    ProperityAddModalComponent,
    SubscriptionCatgComponent,
    SubscribtionCatgsItemsAddModalComponent,
    GateAccessComponent,
    OffersComponent,
    CategroisSubscribtionComponent,
    DicomViewerComponent,
    ApplicationEntitiesComponent,
    AddApplicationEntityComponent,
    DirectoryWatcherComponent,
    DicomsSearchComponent,
    DicomsUploaderComponent,
    
  ],

  entryComponents: [],
  providers: [CdkColumnDef]
})
export class AdminLayoutModule { }
