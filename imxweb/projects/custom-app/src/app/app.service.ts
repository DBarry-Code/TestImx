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

import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { TypedClient } from '@imx-modules/imx-api-qbm';
import { Globals } from '@imx-modules/imx-qbm-dbts';
import {
  AppConfigService,
  AuthenticationService,
  ISessionState,
  ImxTranslationProviderService,
  SplashService,
  SystemInfoService,
  imx_SessionService,
} from 'qbm';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    private readonly config: AppConfigService,
    private readonly systemInfoService: SystemInfoService,
    private readonly translateService: TranslateService,
    private readonly session: imx_SessionService,
    private readonly translationProvider: ImxTranslationProviderService,
    private readonly title: Title,
    private readonly authentication: AuthenticationService,
    private readonly splash: SplashService,
  ) {}

  public async init(): Promise<void> {
    this.showSplash();
    await this.config.init(environment.clientUrl);
    if (this.config.Config.Translation?.Langs) {
      this.translateService.addLangs(this.config.Config.Translation.Langs);
    }
    const browserCulture = this.translateService.getBrowserCultureLang() as string;
    this.translateService.setDefaultLang(browserCulture);
    await this.translateService.use(browserCulture).toPromise();

    // If the session defines another culture, update the translation provider
    this.authentication.onSessionResponse.subscribe((sessionState: ISessionState) =>
      this.translationProvider.init(sessionState?.culture, sessionState?.cultureFormat),
    );

    this.translateService.onLangChange.subscribe(() => {
      this.setTitle();
    });

    this.setTitle();

    this.session.TypedClient = new TypedClient(this.config.v2client, this.translationProvider);
  }

  private async setTitle(): Promise<void> {
    const imxConfig = await this.systemInfoService.getImxConfig();
    const name = imxConfig.ProductName || Globals.QIM_ProductNameFull;
    const title = `${name} ${this.config.Config.Title}`;
    this.title.setTitle(title);

    await this.updateSplash(title);
  }

  public static init(app: AppService): () => Promise<any> {
    return () =>
      new Promise<any>(async (resolve: any) => {
        await app.init();
        resolve();
      });
  }

  private showSplash(): void {
    // open splash screen with fix values
    this.splash.init({ applicationName: 'Custom App' });
  }

  private async updateSplash(title: string): Promise<void> {
    // update the splash screen and use translated texts and the title from the imxconfig
    const loadingMsg = await this.translateService.get('#LDS#Loading...').toPromise();
    this.splash.update({ applicationName: title, message: loadingMsg });
  }
}
