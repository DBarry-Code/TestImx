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

import { ShapeData } from '@imx-modules/imx-api-qbm';
import { imx_SessionService } from 'qbm';
import { ObjectHyperviewService } from 'qer';

@Injectable({
  providedIn: 'root',
})
export class OpsHyperviewService implements ObjectHyperviewService {
  constructor(private session: imx_SessionService) {}

  public async get(tableName: string, uid: string, nodeName?: string): Promise<ShapeData[]> {
    return this.session.Client.opsupport_hyperview_get(tableName, uid, { node: nodeName });
  }
  public getNavigationPermission(): Promise<boolean> {
    return new Promise((resolve) => resolve(false));
  }
}
