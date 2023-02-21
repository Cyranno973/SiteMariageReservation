import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {CoiffeurComponent} from "./coiffeur/coiffeur.component";
import {InfoComponent} from "./info/info.component";
import {AuthGard} from "./auth.gard";
import {AdministratorComponent} from "./admin/administrator/administrator.component";

const routes: Routes =
  [
    {path: 'home', component: HomeComponent},
    {path: 'info', canActivate: [AuthGard], data: {route: 'info'}, component: InfoComponent},
    {path: 'coiffeur', canActivate: [AuthGard], component: CoiffeurComponent},
    {path: 'admin', canActivate: [AuthGard], component: AdministratorComponent},
    // {path: 'admin', component: AdministratorComponent},
    {path: '**', redirectTo: '/home'},
  ]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule {
}
