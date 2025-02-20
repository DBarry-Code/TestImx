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
import { TypedEntity } from '@imx-modules/imx-qbm-dbts';
import { Subject } from 'rxjs';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class DataManagementService {
  public entityInteractive: TypedEntity | undefined;
  public mainDataDirty$: Subject<boolean> = new Subject();
  public autoMembershipDirty$: Subject<boolean> = new Subject();

  constructor(private roleService: RoleService) {}

  public mainDataDirty(flag: boolean): void {
    this.mainDataDirty$.next(flag);
  }

  public autoMembershipDirty(flag: boolean): void {
    this.autoMembershipDirty$.next(flag);
  }

  public async setInteractive(): Promise<void> {
    this.entityInteractive = await this.roleService.getInteractiveInternal();
  }

  public async refreshInteractive(): Promise<void> {
    await this.entityInteractive?.GetEntity()?.Commit(true);
  }
}
