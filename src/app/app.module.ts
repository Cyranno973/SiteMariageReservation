import {isDevMode, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {BrowserModule} from '@angular/platform-browser';

import {ScrollingModule} from '@angular/cdk/scrolling';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
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
import {ServiceWorkerModule} from '@angular/service-worker';
import {getStorage, provideStorage} from "@angular/fire/storage";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AppRoutingModule} from "./app-routing.module";
import {ToastrModule} from "ngx-toastr";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {StatsComponent} from './admin/stats/stats.component';
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import {TooltipComponent} from './components/tooltip/tooltip.component';
import {ProgramComponent} from './program/program.component';
import {CountdownComponent} from './components/countdown/countdown.component';
import {ModalComponent} from './components/modal/modal.component';
import {MediaService} from "./services/MediaService";
import {UserContentInputComponent} from "./user-content-input/user-content-input.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    UserProfileComponent,
    ListUserComponent,
    UserFormComponent,
    ButtonComponent,
    AdministratorComponent,
    UserComponent,
    StatsComponent,
    TooltipComponent,
    ProgramComponent,
    CountdownComponent,
    ModalComponent,
    UserContentInputComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    DragDropModule,
    ScrollingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      // timeOut: 0,
      // extendedTimeOut: 0,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
      // QuillModule.forRoot(),
    })
  ],
  providers: [MediaService, {provide: LocationStrategy, useClass: HashLocationStrategy}],

  bootstrap: [AppComponent]
})
export class AppModule {
}
