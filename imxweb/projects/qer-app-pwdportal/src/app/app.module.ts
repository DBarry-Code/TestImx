/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2024 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EuiCoreModule, EuiMaterialModule } from '@elemental-ui/core';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { APP_BASE_HREF } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';
import {
  AuthenticationModule,
  CustomThemeModule,
  GlobalErrorHandler,
  ImxMissingTranslationHandler,
  ImxTranslateLoader,
  LdsReplacePipe,
  MastHeadModule,
  Paginator,
  SqlWizardApiService,
  UserMessageModule,
} from 'qbm';
import { PasscodeLoginModule, PasswordModule, QaLoginModule, QerModule } from 'qer';
import appConfigJson from '../appconfig.json';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { PwdSqlWizardApiService } from './pwd-sql-wizard-api.service';

export const HEADLESS_BASEHREF = '/headless';
export function getBaseHref(): string {
  return location.href.includes('headless') ? HEADLESS_BASEHREF : '';
}
@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthenticationModule,
    BrowserAnimationsModule,
    BrowserModule,
    EuiCoreModule,
    EuiMaterialModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.OFF }),
    MastHeadModule,
    QaLoginModule,
    QerModule,
    PasscodeLoginModule,
    PasswordModule,
    CustomThemeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: ImxTranslateLoader,
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: ImxMissingTranslationHandler,
      },
    }),
    UserMessageModule,
  ],
  providers: [
    { provide: 'environment', useValue: environment },
    { provide: 'appConfigJson', useValue: appConfigJson },
    {
      provide: APP_INITIALIZER,
      useFactory: AppService.init,
      deps: [AppService],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: MatPaginatorIntl,
      useFactory: Paginator.Create,
      deps: [TranslateService, LdsReplacePipe],
    },
    {
      provide: APP_BASE_HREF,
      useValue: getBaseHref(),
    },
    {
      provide: SqlWizardApiService,
      useClass: PwdSqlWizardApiService,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useFactory: (config: AppService) => {
        return config.recaptchaSiteKeyV3;
      },
      deps: [AppService],
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
