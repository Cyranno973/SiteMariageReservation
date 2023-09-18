import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {AdministratorComponent} from "./admin/administrator/administrator.component";
import {AuthGard} from "./services/auth.gard";
import {ProgramComponent} from "./program/program.component";
import {UserContentInputComponent} from "./user-content-input/user-content-input.component";

const routes: Routes =
  [
    {path: 'home', component: HomeComponent, data: {animation: 'home'}},
    {path: 'program', canActivate: [AuthGard], component: ProgramComponent, data: {animation: 'program'}},
    {path: 'activity', canActivate: [AuthGard], component: UserContentInputComponent, data: {animation: 'activity', collectionPath: '/mediaActivity'}},
    {path: 'info', canActivate: [AuthGard], component: UserContentInputComponent, data: {animation: 'info', collectionPath: '/mediaInfo'}},
    {path: 'urne', canActivate: [AuthGard], component: UserContentInputComponent, data: {animation: 'info', collectionPath: '/mediaGift'}},
    {path: 'admin', canActivate: [AuthGard], data: {animation: 'admin'}, component: AdministratorComponent},
    // {path: 'admin', component: AdministratorComponent},
    {path: '**', redirectTo: '/home'},
    // {path: '**', redirectTo: '/admin'},
  ]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {scrollPositionRestoration: "top"})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
