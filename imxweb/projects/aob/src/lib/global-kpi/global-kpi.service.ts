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

import { ChartDto } from '@imx-modules/imx-api-aob';
import { ApiClientService } from 'qbm';
import { AobApiService } from '../aob-api-client.service';

@Injectable({
  providedIn: 'root',
})
/**
 * A service that provides endpoints for KPI features
 */
export class GlobalKpiService {
  constructor(
    private aobClient: AobApiService,
    private readonly apiProvider: ApiClientService,
  ) {}

  /**
   * Encapsules the aob/kpi GET endpoint
   */
  public async get(): Promise<ChartDto[] | undefined> {
    return this.apiProvider.request(() => this.aobClient.client.portal_kpi_get());
  }
}
