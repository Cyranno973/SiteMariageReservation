import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ActivityComponent} from "./activity/activity.component";
import {InfoComponent} from "./info/info.component";
import {AuthGard} from "./auth.gard";
import {AdministratorComponent} from "./admin/administrator/administrator.component";
import {TestComponent} from "./test/test.component";

const routes: Routes =
  [
    {path: 'home', component: HomeComponent},
    // {path: 'info', canActivate: [AuthGard], data: {route: 'info'}, component: InfoComponent},
    {path: 'info', data: {route: 'info'}, component: InfoComponent},
    {path: 'activity', component: ActivityComponent},
    {path: 'test', component: TestComponent},
    // {path: 'activity', canActivate: [AuthGard], component: ActivityComponent},
    // {path: 'admin', canActivate: [AuthGard], component: AdministratorComponent},
    {path: 'admin', component: AdministratorComponent},
    {path: '**', redirectTo: '/test'},
    // {path: '**', redirectTo: '/home'},
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