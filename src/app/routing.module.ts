import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {CoiffeurComponent} from "./coiffeur/coiffeur.component";
import {InfoComponent} from "./info/info.component";

const routes: Routes =
  [
    {path:'home', component: HomeComponent},
    {path:'info', component: InfoComponent},
    {path:'coiffeur', component: CoiffeurComponent},
    {path:'**', redirectTo: '/home'},
  ]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
