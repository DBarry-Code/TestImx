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

import { PortalPersonGroupmemberships, portal_person_groupmemberships_get_args } from '@imx-modules/imx-api-tsb';
import { EntitySchema, ExtendedTypedEntityCollection } from '@imx-modules/imx-qbm-dbts';
import { TsbApiService } from '../../tsb-api-client.service';

@Injectable({ providedIn: 'root' })
export class GroupMembershipsExtService {
  constructor(private readonly apiService: TsbApiService) {}

  public get portalPersonGroupmembershipsSchema(): EntitySchema {
    return this.apiService.typedClient.PortalPersonGroupmemberships.GetSchema();
  }

  public getGroupMemberships(
    uid: string,
    parameters: portal_person_groupmemberships_get_args,
    signal: AbortSignal,
  ): Promise<ExtendedTypedEntityCollection<PortalPersonGroupmemberships, unknown>> {
    return this.apiService.typedClient.PortalPersonGroupmemberships.Get(uid, parameters, { signal });
  }
}
