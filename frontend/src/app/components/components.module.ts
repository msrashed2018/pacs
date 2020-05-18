import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    PaginationComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    PaginationComponent
  ]
})
export class ComponentsModule {}
