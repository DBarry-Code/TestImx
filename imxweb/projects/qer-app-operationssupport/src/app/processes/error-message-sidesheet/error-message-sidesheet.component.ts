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

import { Component, Inject, OnInit } from '@angular/core';
import { EuiSidesheetRef, EUI_SIDESHEET_DATA } from '@elemental-ui/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { SnackBarService } from 'qbm';

@Component({
  selector: 'imx-error-message-sidesheet',
  templateUrl: './error-message-sidesheet.component.html',
  styleUrls: ['./error-message-sidesheet.component.scss'],
})
export class ErrorMessageSidesheetComponent implements OnInit {
  constructor(
    @Inject(EUI_SIDESHEET_DATA) public readonly data: string,
    private sidesheetRef: EuiSidesheetRef,
    private clipboard: Clipboard,
    private readonly snackbar: SnackBarService,
  ) {}

  public ngOnInit(): void {}

  public copyToClipboard(): void {
    this.clipboard.copy(this.data);
    this.snackbar.open({ key: '#LDS#The error message has been successfully copied to the clipboard.' });
    this.sidesheetRef.close();
  }
}
