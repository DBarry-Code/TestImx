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

import { Component, Input, OnInit } from '@angular/core';
import { LoadedPlugin } from '@imx-modules/imx-api-qbm';
import { AppConfigService } from '../appConfig/appConfig.service';
import { SideNavigationComponent } from '../side-navigation-view/side-navigation-view-interfaces';

@Component({
  templateUrl: './plugins.component.html',
  styleUrls: ['./shared.scss'],
  selector: 'imx-plugins',
})
export class PluginsComponent implements OnInit, SideNavigationComponent {
  @Input() public isAdmin: boolean;
  plugins: LoadedPlugin[];

  constructor(private readonly appConfigService: AppConfigService) {}

  async ngOnInit() {
    const client = this.appConfigService.client;
    this.plugins = await client.admin_systeminfo_plugins_get();
  }
}
