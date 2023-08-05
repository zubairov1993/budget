import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify'
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from '@taiga-ui/core'
import { NgModule, isDevMode, Provider } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { ServiceWorkerModule } from '@angular/service-worker'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

import { SharedModule } from './shared/shared.module'

import { AuthGuard } from './shared/guards/auth.guard'

import { AuthInterceptor } from './shared/interceptors/auth.interceptor'

import { AppComponent } from './app.component'
import { VerticalMenuComponent } from './vertical-menu/vertical-menu.component'

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}
@NgModule({
  declarations: [
    AppComponent,
    VerticalMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([]),
],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }, INTERCEPTOR_PROVIDER, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
