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

import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EuiLoadingService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';

import { MessageDialogResult } from '../message-dialog/message-dialog-result.enum';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MessageDialogService } from '../message-dialog/message-dialog.service';
import { MessageParameter } from '../message-dialog/message-parameter.interface';

import { AuthenticationService } from '../authentication/authentication.service';
import { LdsReplacePipe } from '../lds-replace/lds-replace.pipe';
import { ISessionState } from '../session/session-state';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(
    private readonly dialogService: MatDialog,
    private readonly translate: TranslateService,
    private readonly pipe: LdsReplacePipe,
    private readonly zone: NgZone,
    private readonly messageDialogService: MessageDialogService,
    private readonly authentication: AuthenticationService,
    private readonly busyService: EuiLoadingService,
  ) {
    authentication.onSessionResponse.subscribe((session) => (this.currentSession = session));
  }

  private showErrorDialogState = true;
  private currentSession: ISessionState;

  public async confirmLeaveWithUnsavedChanges(title?: string, message?: string, disableClose?: boolean): Promise<boolean> {
    const dialogRef = this.dialogService.open(MessageDialogComponent, {
      data: {
        ShowYesNo: true,
        Title: await this.translate.get(title || '#LDS#Heading Cancel Editing').toPromise(),
        Message: await this.translate
          .get(message || '#LDS#You have unsaved changes. Are you sure you want to cancel editing and discard your changes?')
          .toPromise(),
      },
      panelClass: 'imx-messageDialog',
      disableClose: disableClose,
    });
    return (await dialogRef.beforeClosed().toPromise()) === MessageDialogResult.YesResult;
  }

  public async confirm(data: MessageParameter): Promise<boolean> {
    let message = data?.Message ? await this.translate.get(data.Message).toPromise() : '';
    message = data.Parameter ? this.pipe.transform(message, ...data.Parameter) : message;
    const title = data?.Title ? await this.translate.get(data.Title).toPromise() : '';
    let dialogRef;

    this.zone.run(() => {
      dialogRef = this.dialogService.open(MessageDialogComponent, {
        data: {
          Title: title,
          Message: message,
          ShowYesNo: true,
        },
        panelClass: 'imx-messageDialog',
      });
    });

    return (await dialogRef.afterClosed().toPromise()) === MessageDialogResult.YesResult;
  }

  public async confirmGeneral(data: MessageParameter): Promise<boolean> {
    const message = data?.Message ? await this.translate.get(data.Message).toPromise() : '';
    const dialogRef = this.dialogService.open(MessageDialogComponent, {
      data: {
        Title: data?.Title ? await this.translate.get(data.Title).toPromise() : '',
        Message: data.Parameter ? this.pipe.transform(message, ...data.Parameter) : message,
        ShowOk: data?.ShowOk ? true : false,
        ShowYesNo: data?.ShowYesNo ? true : false,
        ShowCancel: data?.ShowCancel ? true : false,
        identifier: data?.identifier,
      },
      panelClass: 'imx-messageDialog',
    });
    const result =await dialogRef.afterClosed().toPromise();
    return result === MessageDialogResult.YesResult || result === MessageDialogResult.OkResult;
  }

  // Damit es bis "Pull Request 38432: 299557-imxweb-confirmdialogs-with-yes-no-buttons" funktioniert
  public async confirmDelete(title?: string, message?: string): Promise<boolean> {
    return this.confirm({
      Title: title || '#LDS#Heading Delete Object',
      Message: message || '#LDS#Are you sure you want to delete the object?',
    });
  }

  public async showErrorMessage(data: MessageParameter): Promise<void> {
    let message = data?.Message ? this.translate.instant(data.Message) : '';
    message = data?.Parameter ? this.pipe.transform(message, ...data.Parameter) : message;
    const title = this.translate.instant('#LDS#Error');
    if (this.showErrorDialogState) {
      this.showErrorDialogState = false;
      this.messageDialogService.errorMessages$.next([message]);
      await this.showMessageBox(title, message, 'error', async () => {
        this.showErrorDialogState = true;
        this.messageDialogService.errorMessages$.next([]);
      });
    } else {
      this.messageDialogService.errorMessages$.next([...this.messageDialogService.errorMessages$.value, message]);
    }
  }

  public async handleExpiredSession(): Promise<void> {
    await this.showMessageBox(
      this.translate.instant('#LDS#Heading Session Expired'),
      this.translate.instant('#LDS#Your session has expired. You will now be redirected to the login page where you can log in again.'),
      'clock',
      async () => {
        const ref = this.busyService.show();
        try {
          await this.authentication.update(true);
        } finally {
          this.busyService.hide(ref);
        }
      },
    );
  }

  public async showMessageBox(translatedTitle: string, translatedText, icon: string, callback: () => Promise<void>): Promise<void> {
    this.zone.run(() => {
      this.dialogService
        .open(MessageDialogComponent, {
          data: {
            Title: translatedTitle,
            Message: translatedText,
            ShowOk: true,
            icon: icon,
          },
          panelClass: 'imx-messageDialog-error',
        })
        .afterClosed()
        .subscribe(callback);
    });
  }
}
