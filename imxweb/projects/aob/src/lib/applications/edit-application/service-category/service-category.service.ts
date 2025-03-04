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
import { PortalServicecategories } from '@imx-modules/imx-api-qer';
import {
  CollectionLoadParameters,
  EntityCollectionData,
  EntitySchema,
  IEntity,
  TypedEntityCollectionData,
} from '@imx-modules/imx-qbm-dbts';
import { QerApiService } from 'qer';

@Injectable({
  providedIn: 'root',
})
export class ServiceCategoryService {
  constructor(private readonly apiClient: QerApiService) {}

  public get serviceCategorySchema(): EntitySchema {
    return this.apiClient.typedClient.PortalServicecategories.GetSchema();
  }

  public async get(parameters: CollectionLoadParameters = {}): Promise<TypedEntityCollectionData<PortalServicecategories>> {
    return this.apiClient.typedClient.PortalServicecategories.Get(parameters);
  }

  public createChild(): IEntity {
    const entity = this.apiClient.typedClient.PortalServicecategories.createEntity();
    return entity.GetEntity();
  }

  public async delete(uid: string): Promise<EntityCollectionData> {
    return this.apiClient.client.portal_servicecategories_delete(uid);
  }
}
