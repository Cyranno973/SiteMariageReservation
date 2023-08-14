import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ActivityComponent} from "./activity/activity.component";
import {InfoComponent} from "./info/info.component";
import {AdministratorComponent} from "./admin/administrator/administrator.component";
import {AuthGard} from "./services/auth.gard";

const routes: Routes =
  [
    {path: 'home', component: HomeComponent},
    // {path: 'info', canActivate: [AuthGard], data: {route: 'info'}, component: InfoComponent},
    {path: 'info',  data: {route: 'info'}, component: InfoComponent},
    {path: 'activity', canActivate: [AuthGard], component: ActivityComponent},
    // {path: 'activity', component: ActivityComponent},
    {path: 'admin', canActivate: [AuthGard], component: AdministratorComponent},
    {path: '**', redirectTo: '/home'},
  ]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
