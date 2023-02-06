import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {CoiffeurComponent} from "./coiffeur/coiffeur.component";
import {InfoComponent} from "./info/info.component";
import {AuthGard} from "./auth.gard";
import {UserProfileComponent} from "./user-profile/user-profile.component";

const routes: Routes =
  [
    {path:'home',  canActivate: [AuthGard], component: HomeComponent},
    {path:'info', component: InfoComponent},
    {path:'coiffeur', component: CoiffeurComponent},
    {path:'userForm', component: UserProfileComponent},
    {path:'**', redirectTo: '/home'},
  ]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
