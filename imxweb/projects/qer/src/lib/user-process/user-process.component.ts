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
import { EuiLoadingService } from '@elemental-ui/core';
import { ProcessChain } from '@imx-modules/imx-api-qer';
import { BusyService } from 'qbm';
import { UserProcessService } from './user-processes.service';

@Component({
  selector: 'imx-user-process',
  templateUrl: './user-process.component.html',
  styleUrls: ['./user-process.component.scss'],
})
export class UserProcessComponent implements OnInit {
  public userProcesses: ProcessChain[] = [];
  public displayedColumns: string[] = [];
  public busyService = new BusyService();

  constructor(
    private readonly euiLoadingService: EuiLoadingService,
    private readonly userProcessService: UserProcessService,
  ) {}

  public async ngOnInit(): Promise<void> {
    const isBusy = this.busyService.beginBusy();
    if (this.euiLoadingService.overlayRefs.length === 0) {
      this.euiLoadingService.show();
    }

    try {
      this.userProcesses = await this.userProcessService.get();
      this.displayedColumns = ['xDateInserted', 'display', 'processState'];
    } finally {
      this.euiLoadingService.hide();
      isBusy.endBusy();
    }
  }
}
