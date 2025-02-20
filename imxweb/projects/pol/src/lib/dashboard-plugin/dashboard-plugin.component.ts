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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService, PendingItemsType, UserModelService } from 'qer';

@Component({
  templateUrl: './dashboard-plugin.component.html',
})
export class DashboardPluginComponent implements OnInit {
  public pendingItems: PendingItemsType;

  constructor(
    public readonly router: Router,
    private readonly dashboardService: DashboardService,
    private readonly userModelSvc: UserModelService,
  ) {}

  public hasPendingItems(): boolean {
    return !!this.pendingItems?.OpenQERPolicyHasObject && this.pendingItems.OpenQERPolicyHasObject > 0;
  }

  public async ngOnInit(): Promise<void> {
    const busy = this.dashboardService.beginBusy();

    try {
      this.pendingItems = await this.userModelSvc.getPendingItems();
    } finally {
      busy.endBusy();
    }
  }
}
