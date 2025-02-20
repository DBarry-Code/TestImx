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
import { EuiLoadingService } from '@elemental-ui/core';
import { PortalRiskFunctions, RiskIndexExtendedData } from '@imx-modules/imx-api-qer';
import { CollectionLoadParameters, DataModel, EntitySchema, ExtendedTypedEntityCollection } from '@imx-modules/imx-qbm-dbts';
import { QerApiService } from '../qer-api-client.service';

@Injectable({
  providedIn: 'root',
})
export class RiskConfigService {
  constructor(
    private readonly qerClient: QerApiService,
    private readonly busyService: EuiLoadingService,
  ) {}

  public get riskFunctionsSchema(): EntitySchema {
    return this.qerClient.typedClient.PortalRiskFunctions.GetSchema();
  }

  public async get(
    parameters: CollectionLoadParameters,
    signal: AbortSignal,
  ): Promise<ExtendedTypedEntityCollection<PortalRiskFunctions, unknown>> {
    return this.qerClient.typedClient.PortalRiskFunctions.Get(parameters, { signal });
  }

  public async getDataModel(): Promise<DataModel> {
    return this.qerClient.client.portal_risk_functions_datamodel_get();
  }

  public async getPortalRiskEntity(
    uidRiskIndex: string,
  ): Promise<ExtendedTypedEntityCollection<PortalRiskFunctions, RiskIndexExtendedData>> {
    return await this.qerClient.typedClient.PortalRiskFunctionsInteractive.Get_byid(uidRiskIndex);
  }

  public async postRiskRecalculate(): Promise<void> {
    return this.qerClient.client.portal_risk_recalculate_post();
  }

  public handleOpenLoader(): void {
    this.busyService.show();
  }

  public handleCloseLoader(): void {
    this.busyService.hide();
  }
}
