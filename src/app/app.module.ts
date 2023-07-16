import {NgModule, isDevMode} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {InfoComponent} from './info/info.component';
import {ActivityComponent} from './activity/activity.component';
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
import { ServiceWorkerModule } from '@angular/service-worker';
import {getStorage, provideStorage} from "@angular/fire/storage";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {TestComponent} from "./test/test.component";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    InfoComponent,
    ActivityComponent,
    UserProfileComponent,
    ListUserComponent,
    UserFormComponent,
    ButtonComponent,
    AdministratorComponent,
    UserComponent,
    TestComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    DragDropModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
