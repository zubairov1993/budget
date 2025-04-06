import { TUI_SANITIZER } from '@taiga-ui/legacy';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { NgDompurifySanitizer } from '@taiga-ui/dompurify';
import { TuiRoot, TuiAlert, TuiDialog } from '@taiga-ui/core';
import { NgModule, isDevMode, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthGuard, AuthInterceptor, SharedModule } from './shared';
import { NavMenuComponent } from './nav-menu';
import { BudgetCalculatorComponent, ChangeMouthyBudgetDialogComponent } from './budget-calculator';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor,
};
@NgModule({
  declarations: [AppComponent, NavMenuComponent, BudgetCalculatorComponent, ChangeMouthyBudgetDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TuiRoot,
    TuiDialog,
    TuiAlert,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    INTERCEPTOR_PROVIDER,
    AuthGuard,
    NG_EVENT_PLUGINS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
