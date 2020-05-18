import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from './project.service';
import { SubscriptionService } from './subscription.service';
import { AccessCardService } from './access-card.service';
import { ControlUserService } from './control-user.service';
import { RoleService } from './role.service';
import { ProfileServices } from './profile.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [SubscriptionService, ProjectService, AccessCardService, ControlUserService, RoleService, ProfileServices]
})
export class ServicesModule { }
