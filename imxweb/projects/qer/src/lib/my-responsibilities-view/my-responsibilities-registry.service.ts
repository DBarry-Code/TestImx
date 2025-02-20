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
import { ProjectConfig } from '@imx-modules/imx-api-qbm';
import { SideNavigationExtension, SideNavigationFactory } from 'qbm';

@Injectable({
  providedIn: 'root',
})
export class MyResponsibilitiesRegistryService {
  private items: SideNavigationFactory[] = [];

  public getNavItems(preProps: string[], features: string[], projectConfig?: ProjectConfig): (SideNavigationExtension | undefined)[] {
    return this.items
      .map((factory) => factory(preProps, features, projectConfig))
      .filter((item) => item?.name !== '')
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
  }

  public registerFactory(...factories: SideNavigationFactory[]): void {
    this.items.push(...factories);
  }
}
