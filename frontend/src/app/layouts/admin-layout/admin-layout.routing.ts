import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { ProperityComponent } from "../../properity/properity.component";
import { OrdersComponent } from "../../orders/orders.component";
import { SubscriptionComponent } from "../../subscription/subscription.component";
import { SubscriptionCatgComponent } from "../../subscription-catg/subscription-catg.component";
import { ProjectsComponent } from "../../projects/projects.component";
import { CarAccessCardComponent } from "app/car-access-card/car-access-card.component";
import { ControlUserComponent } from "app/control-user/control-user.component";
import { CustomizedServicesComponent } from "../../customized-services/customized-services.component";
import { GateAccessComponent } from "../../gate-access/gate-access.component";
import { CustomizeOrdersComponent } from "../../customize-orders/customize-orders.component";
import { OffersComponent } from "../../offers/offers.component";
import { CategroisSubscribtionComponent } from "../../categrois-subscribtion/categrois-subscribtion.component";
import { DicomViewerComponent } from "app/dicom-viewer/dicom-viewer.component";
import { ApplicationEntitiesComponent } from "app/application-entities/application-entities.component";
import { DirectoryWatcherComponent } from "app/directory-watcher/directory-watcher.component";
import { DicomsSearchComponent } from "app/dicoms-search/dicoms-search.component";
import { DicomsUploaderComponent } from "app/dicoms-uploader/dicoms-uploader.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dicom-viewer", component: DicomViewerComponent },
  { path: "dicoms-uploader", component: DicomsUploaderComponent },
  { path: "application-entities", component: ApplicationEntitiesComponent },
  { path: "directory-watcher", component: DirectoryWatcherComponent },
  { path: "dicoms-search", component: DicomsSearchComponent },
  { path: "users", component: ControlUserComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "properity", component: ProperityComponent },
  { path: "orders", component: OrdersComponent },
  { path: "subscription", component: SubscriptionComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "access-card", component: CarAccessCardComponent },
  
  { path: "customized-service", component: CustomizedServicesComponent },
  { path: "subscription-Catg", component: SubscriptionCatgComponent },
  { path: "gateAccess", component: GateAccessComponent },
  { path: "customized-orders", component: CustomizeOrdersComponent },
  { path: "offers", component: OffersComponent },
  { path: "CatgSubscription", component: CategroisSubscribtionComponent }
];
