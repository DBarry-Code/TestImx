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

import {
  DisplayBuilder,
  FkCandidateProvider,
  IClientProperty,
  MetaTableRelationData,
  ReadWriteEntity,
  ValType,
} from '@imx-modules/imx-qbm-dbts';
import { BaseCdr, BaseReadonlyCdr, ImxTranslationProviderService } from 'qbm';
import { QerApiService } from '../qer-api-client.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerControlService {
  constructor(
    private readonly qerClient: QerApiService,
    private readonly translate: ImxTranslationProviderService,
  ) {}

  public createGroupOwnerPersonCdr(readonly: boolean): BaseCdr {
    const columnProperties = {};

    const columnName = 'PersonColumnName';
    const property = this.createGroupOwnerPersonProperty(columnName);
    columnProperties[columnName] = property;
    const entityColumn = new ReadWriteEntity(
      { Columns: columnProperties },
      {},
      this.createGroupOwnerPersonFkProvider(property.FkRelation),
      undefined,
      new DisplayBuilder(this.translate),
    ).GetColumn(columnName);

    return readonly ? new BaseReadonlyCdr(entityColumn, '#LDS#Identity') : new BaseCdr(entityColumn, '#LDS#Identity');
  }

  private createGroupOwnerPersonProperty(columnName: string): IClientProperty {
    const fkRelation = {
      ChildColumnName: columnName,
      ParentTableName: 'Person',
      ParentColumnName: 'UID_Person',
      IsMemberRelation: false,
    };
    return {
      ColumnName: fkRelation.ChildColumnName,
      Type: ValType.String,
      FkRelation: fkRelation,
    };
  }

  private createGroupOwnerPersonFkProvider(fkRelation: MetaTableRelationData | undefined): FkCandidateProvider {
    return new FkCandidateProvider([
      {
        columnName: fkRelation?.ChildColumnName || '',
        fkTableName: fkRelation?.ParentTableName || '',
        parameterNames: ['OrderBy', 'StartIndex', 'PageSize', 'filter', 'search'],
        load: async (_, parameters = {}) => this.qerClient.client.portal_candidates_Person_get(parameters),
        getDataModel: async () => ({}),
        getFilterTree: async () => ({ Elements: [] }),
      },
    ]);
  }
}
