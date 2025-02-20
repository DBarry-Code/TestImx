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

import { Component, Inject, OnDestroy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { EUI_SIDESHEET_DATA, EuiLoadingService, EuiSidesheetRef } from '@elemental-ui/core';
import { Subscription } from 'rxjs';

import { ColumnDependentReference, ConfirmationService } from 'qbm';
import { ReportSubscription } from '../report-subscription/report-subscription';

@Component({
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss'],
})
export class SubscriptionDetailsComponent implements OnDestroy {
  public readonly formGroup = new UntypedFormGroup({});
  public readonly cdrList: ColumnDependentReference[];
  public closeClickSubscription: Subscription;
  public reload = false;

  constructor(
    @Inject(EUI_SIDESHEET_DATA) public readonly subscription: ReportSubscription,
    public readonly sidesheetRef: EuiSidesheetRef,
    private readonly busyService: EuiLoadingService,
    private readonly confirmation: ConfirmationService,
  ) {
    this.closeClickSubscription = this.sidesheetRef.closeClicked().subscribe(async () => {
      if (!this.formGroup.dirty || (await this.confirmation.confirmLeaveWithUnsavedChanges())) {
        this.sidesheetRef.close(this.reload);
      }
    });
  }

  public ngOnDestroy(): void {
    this.closeClickSubscription.unsubscribe();
  }

  public async submit(): Promise<void> {
    if (this.busyService.overlayRefs.length === 0) {
      this.busyService.show();
    }
    try {
      await this.subscription.submit(true);
    } finally {
      this.busyService.hide();
      this.reload = true;
      this.formGroup.markAsPristine();
    }
  }
}
