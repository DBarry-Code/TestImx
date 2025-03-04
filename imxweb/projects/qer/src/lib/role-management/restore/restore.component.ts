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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EUI_SIDESHEET_DATA, EuiLoadingService, EuiSidesheetRef } from '@elemental-ui/core';
import { DeletedObjectInfo, UiActionData } from '@imx-modules/imx-api-qer';
import { DbObjectKey } from '@imx-modules/imx-qbm-dbts';
import { SnackBarService } from 'qbm';
import { IRoleRestoreContext } from './restore-handler';

interface RoleForm {
  role: FormControl<DeletedObjectInfo[]>;
  uidActions: FormControl<string[]>;
}

@Component({
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss'],
})
export class RestoreComponent implements OnInit {
  public wizardForm = new FormGroup<RoleForm>({
    role: new FormControl<DeletedObjectInfo[]>([], { nonNullable: true, validators: Validators.required }),
    uidActions: new FormControl<string[]>([], { nonNullable: true }),
  });
  constructor(
    @Inject(EUI_SIDESHEET_DATA)
    public data: {
      isAdmin: boolean;
      restore: IRoleRestoreContext;
    },
    private readonly busySvc: EuiLoadingService,
    private readonly snackbar: SnackBarService,
    private readonly sidesheetRef: EuiSidesheetRef,
  ) {}

  public busy = false;
  public roles: DeletedObjectInfo[] = [];
  public actions: UiActionData[] = [];
  private uidRole: string | undefined;

  public async ngOnInit(): Promise<void> {
    this.roles = [];
    this.actions = [];
    try {
      this.busy = true;
      this.roles = await this.data.restore.getRoles();
    } finally {
      this.busy = false;
    }
  }

  public async loadActions(): Promise<void> {
    try {
      this.busy = true;
      this.actions = [];
      const key = this.wizardForm.controls.role.value[0].DbObjectKey;
      this.uidRole = key == null ? undefined : DbObjectKey.FromXml(key).Keys[0];
      this.actions = this.uidRole == null ? [] : (await this.data.restore.getRestoreActions(this.uidRole))?.Actions || [];
      this.wizardForm.controls.uidActions.setValue(this.actions.filter((a) => a.CanExecute).map((a) => a.Id || '') || []);
    } finally {
      this.busy = false;
    }
  }

  public async Execute(): Promise<void> {
    const b = this.busySvc.show();
    try {
      if (this.uidRole != null) {
        await this.data.restore.restore(this.uidRole, { ActionId: this.wizardForm.controls.uidActions.value });
      }

      this.sidesheetRef.close(true);
      if (this.uidRole != null) {
        this.snackbar.open({ key: this.LdsSuccessMessage });
      }
    } finally {
      this.busySvc.hide(b);
    }
  }

  public LdsActionsList = '#LDS#The following actions will be performed to restore the object.';
  public LdsNoObjectsFound = '#LDS#There are no objects that can be restored.';
  public LdsSuccessMessage = '#LDS#The object has been successfully restored.';
}
