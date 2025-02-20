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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NGXLogger } from 'ngx-logger';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EuiCoreModule } from '@elemental-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha-2';
import { AboutComponent } from './about/About.component';
import { ApiClientAngularService } from './api-client/api-client-angular.service';
import { AppConfigService } from './appConfig/appConfig.service';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { AutoCompleteModule } from './auto-complete/auto-complete.module';
import { GlobalErrorHandler } from './base/global-error-handler';
import { OpsupportDbObjectService } from './base/opsupport-db-object.service';
import { RegistryService } from './base/registry.service';
import { UserActionService } from './base/user-action.service';
import { CaptchaModule } from './captcha/captcha.module';
import { CdrEditorComponent } from './cdr/cdr-editor/cdr-editor.component';
import { CdrRegistryService } from './cdr/cdr-registry.service';
import { CdrModule } from './cdr/cdr.module';
import { DefaultCdrEditorProvider } from './cdr/default-cdr-editor-provider';
import { FkCdrEditorProvider } from './cdr/fk-cdr-editor-provider';
import { ClassloggerModule } from './classlogger/classlogger.module';
import { ClassloggerService } from './classlogger/classlogger.service';
import { ConnectionComponent } from './connection/connection.component';
import { DataExportModule } from './data-export/data-export.module';
import { DataSourceToolbarModule } from './data-source-toolbar/data-source-toolbar.module';
import { DataTableModule } from './data-table/data-table.module';
import { DataViewModule } from './data-view/data-view.module';
import { DisableControlModule } from './disable-control/disable-control.module';
import { ExtComponent } from './ext/ext.component';
import { ExtDirective } from './ext/ext.directive';
import { ExtModule } from './ext/ext.module';
import { ExtService } from './ext/ext.service';
import { FilterTileComponent } from './filter-tile/filter-tile.component';
import { HelpContextualModule } from './help-contextual/help-contextual.module';
import { HyperViewModule } from './hyperview/hyperview.module';
import { IconStackComponent } from './icon-stack/icon-stack.component';
import { InfoModalDialogModule } from './info-modal-dialog/info-modal-dialog.module';
import { JobQueueOverviewModule } from './jobqueue-overview/jobqueue-overview.module';
import { LdsReplaceModule } from './lds-replace/lds-replace.module';
import { LoginComponent } from './login/login.component';
import { MastHeadModule } from './mast-head/mast-head.module';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { MessageDialogService } from './message-dialog/message-dialog.service';
import { ImxProgressbarComponent } from './progressbar/progressbar.component';
import { imx_QBM_SearchService } from './search/search.service';
import { SearchBarComponent } from './searchbar/searchbar.component';
import { imx_SessionService } from './session/imx-session.service';
import { SideNavigationViewModule } from './side-navigation-view/side-navigation-view.module';
import { SidenavTreeComponent } from './sidenav-tree/sidenav-tree.component';
import { SnackBarService } from './snackbar/snack-bar.service';
import { TableImageService } from './table-image/table-image.service';
import { TestHelperModule } from './testing/TestHelperModule.spec';
import { TileModule } from './tile/tile.module';
import { TranslationEditorComponent } from './translation-editor/translation-editor.component';
import { ImxTranslateLoader } from './translation/imx-translate-loader';
import { ImxTranslationProviderService } from './translation/imx-translation-provider.service';
import { ImxMatColumnComponent } from './treeTable/MatColumn';
import { ImxTreeTableComponent } from './treeTable/treeTable.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';
import { TwoFactorAuthenticationService } from './two-factor-authentication/two-factor-authentication.service';
import { UserMessageModule } from './user-message/user-message.module';

export function initApp(registry: CdrRegistryService, logger: NGXLogger): () => Promise<any> {
  logger.debug('init qbm');
  return () =>
    new Promise<any>(async (resolve: any) => {
      registry.register(new DefaultCdrEditorProvider());
      registry.register(new FkCdrEditorProvider());
      resolve();
    });
}

@NgModule({
  declarations: [
    TwoFactorAuthenticationComponent,
    AboutComponent,
    IconStackComponent,
    LoginComponent,
    FilterTileComponent,
    ImxProgressbarComponent,
    SearchBarComponent,
    ImxTreeTableComponent,
    ImxMatColumnComponent,
    MessageDialogComponent,
    TranslationEditorComponent,
    ConnectionComponent,
  ],
  exports: [
    TwoFactorAuthenticationComponent,
    AboutComponent,
    ConnectionComponent,
    IconStackComponent,
    LoginComponent,
    ExtComponent,
    ExtDirective,
    FilterTileComponent,
    ImxProgressbarComponent,
    SearchBarComponent,
    ImxTreeTableComponent,
    ImxMatColumnComponent,
    CdrEditorComponent,
    MessageDialogComponent,
    AutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    DisableControlModule,
    ExtModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    TestHelperModule,
    EuiCoreModule,
    HyperViewModule,
    CdrModule,
    DataTableModule,
    AutoCompleteModule,
    DataSourceToolbarModule,
    MastHeadModule,
    UserMessageModule,
    ClassloggerModule,
    UserMessageModule,
    LdsReplaceModule,
    TileModule,
    JobQueueOverviewModule,
    SidenavTreeComponent,
    DataExportModule,
    InfoModalDialogModule,
    MatSnackBarModule,
    SideNavigationViewModule,
    HelpContextualModule,
    ClipboardModule,
    CaptchaModule,
    RecaptchaV3Module,
    DataViewModule,
  ],
  providers: [
    GlobalErrorHandler,
    AppConfigService,
    imx_SessionService,
    ImxTranslateLoader,
    ImxTranslationProviderService,
    RegistryService,
    OpsupportDbObjectService,
    UserActionService,
    imx_QBM_SearchService,
    SnackBarService,
    ExtService,
    ImxTreeTableComponent,
    TwoFactorAuthenticationService,
    ApiClientAngularService,
    TableImageService,
    MessageDialogService,
    ReCaptchaV3Service,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class QbmModule {
  constructor(registry: CdrRegistryService, logger: ClassloggerService) {
    logger.info(this, '▶️ QbmModule loaded');
    registry.register(new DefaultCdrEditorProvider());
    registry.register(new FkCdrEditorProvider());
  }
}
