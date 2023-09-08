import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ActivityComponent} from "./activity/activity.component";
import {InfoComponent} from "./info/info.component";
import {AdministratorComponent} from "./admin/administrator/administrator.component";
import {AuthGard} from "./services/auth.gard";
import {ProgramComponent} from "./program/program.component";

const routes: Routes =
  [
    {path: 'home', component: HomeComponent, data: { animation: 'home' }},
    {path: 'program', canActivate: [AuthGard] , component: ProgramComponent, data: { animation: 'program' }},
    // {path: 'acceuil', component: AcceuilComponent},
    {path: 'activity', canActivate: [AuthGard] , data: { animation: 'activity' }, component: ActivityComponent},
    {path: 'info', data: {route: 'info', animation: 'info'}, canActivate: [AuthGard],  component: InfoComponent},
    {path: 'admin', canActivate: [AuthGard] , data: { animation: 'admin' }, component: AdministratorComponent},
    // {path: 'admin', component: AdministratorComponent},
    {path: '**', redirectTo: '/home'},
    // {path: '**', redirectTo: '/admin'},
  ]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{scrollPositionRestoration:"top"})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
