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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EuiLoadingService } from '@elemental-ui/core';
import { IEntityColumn } from '@imx-modules/imx-qbm-dbts';
import { BehaviorSubject } from 'rxjs';

import { AuthenticationService, MultiValueService } from 'qbm';
import { PersonService } from 'qer';
import { ReportSubscription } from '../../report-subscription/report-subscription';

type NameAddress = { name: string; address: string };

@Component({
  selector: 'imx-subscription-overview',
  templateUrl: './subscription-overview.component.html',
  styleUrls: ['./subscription-overview.component.scss'],
})
export class SubscriptionOverviewComponent implements OnInit, OnDestroy {
  public userIsMissingEMail = false;
  public additionalRecipientWithoutEmail: string[] = [];
  public setProperties: IEntityColumn[] = [];

  @Input() public subscription: ReportSubscription;
  @Input() public subscribersChanged: BehaviorSubject<void>;
  @Input() public isWaitingForLoad: boolean;

  private currentUserId: string;

  constructor(
    private readonly multiValue: MultiValueService,
    private readonly busyService: EuiLoadingService,
    private readonly personService: PersonService,
    authentication: AuthenticationService,
  ) {
    authentication.onSessionResponse.subscribe((state) => (this.currentUserId = state.UserUid ?? ''));
  }

  public ngOnInit(): void {
    if (this.subscribersChanged) {
      this.subscribersChanged.subscribe(async () => {
        if (this.subscription) {
          this.setProperties = this.subscription.getDisplayableColums();
        }
        await this.checkEmailAddresses();
      });
    }
  }

  public ngOnDestroy(): void {
    if (this.subscribersChanged) {
      this.subscribersChanged.unsubscribe();
    }
  }

  private async checkEmailAddresses(): Promise<void> {
    if (!this.subscription) {
      return;
    }

    if (this.busyService.overlayRefs.length === 0) {
      this.busyService.show();
    }
    try {
      this.userIsMissingEMail = (await this.getPersonNameAndAddress(this.currentUserId)).address === '';

      const subscribers = this.multiValue.getValues(this.subscription.subscription.AddtlSubscribers.value) ?? [];
      const subscriberMails: NameAddress[] = [];
      for (const value of subscribers) {
        const mail = await this.getPersonNameAndAddress(value);
        subscriberMails.push(mail);
      }
      this.additionalRecipientWithoutEmail = subscriberMails
        .filter((elem) => elem.address == null || elem.address === '')
        .map((elem) => elem.name);
    } finally {
      this.busyService.hide();
    }
  }

  private async getPersonNameAndAddress(uid: string): Promise<NameAddress> {
    const user = await this.personService.get(uid);
    return user.Data.length > 0
      ? {
          name: user.Data[0].GetEntity().GetDisplay(),
          address: user.Data[0].DefaultEmailAddress.value,
        }
      : { name: '', address: '' };
  }
}
