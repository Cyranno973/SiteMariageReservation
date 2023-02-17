import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {InfoComponent} from './info/info.component';
import {CoiffeurComponent} from './coiffeur/coiffeur.component';
import {RoutingModule} from "./routing.module";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireModule} from "@angular/fire/compat";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {MaterialModule} from "./shared/modules/material/material.module";
import {HeaderComponent} from "./header/header.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ListUserComponent} from "./admin/list-user/list-user.component";
import {UserFormComponent} from "./user-form/user-form.component";
import {ButtonComponent} from "./button/button.component";
import {AdministratorComponent} from "./admin/administrator/administrator.component";
import {UserComponent} from "./admin/user/user.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    InfoComponent,
    CoiffeurComponent,
    UserProfileComponent,
    ListUserComponent,
    UserFormComponent,
    ButtonComponent,
    AdministratorComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    RoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
