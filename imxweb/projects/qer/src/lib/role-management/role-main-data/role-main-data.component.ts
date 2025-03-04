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
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { EuiLoadingService, EuiSidesheetService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';

import { TypedEntity } from '@imx-modules/imx-qbm-dbts';
import { CdrFactoryService, ColumnDependentReference, SnackBarService, calculateSidesheetWidth } from 'qbm';
import { ProjectConfigurationService } from '../../project-configuration/project-configuration.service';
import { CompareComponent } from '../compare/compare.component';
import { DataManagementService } from '../data-management.service';
import { RoleService } from '../role.service';
import { RollbackComponent } from '../rollback/rollback.component';
import { SplitComponent } from '../split/split.component';

@Component({
  selector: 'imx-role-main-data',
  templateUrl: './role-main-data.component.html',
  styleUrls: ['./role-main-data.component.scss'],
})
export class RoleMainDataComponent implements OnInit {
  public editableFields: string[];

  public properties: (ColumnDependentReference | undefined)[] = [];
  public readonly formGroup = new UntypedFormGroup({});
  public canCompare: boolean;
  public canEdit: boolean;

  private entity: TypedEntity | undefined;
  public canSplitRole: boolean;

  constructor(
    private readonly roleService: RoleService,
    private dataManagementService: DataManagementService,
    private readonly projectConfig: ProjectConfigurationService,
    private readonly busyService: EuiLoadingService,
    private readonly sidesheet: EuiSidesheetService,
    private readonly translateService: TranslateService,
    private readonly cdrfactoryService: CdrFactoryService,
    private snackbar: SnackBarService,
  ) {
    this.canEdit = roleService.canEdit;
    this.formGroup.valueChanges.subscribe(() => {
      this.formGroup.dirty || this.formGroup.invalid
        ? this.dataManagementService.mainDataDirty(true)
        : this.dataManagementService.mainDataDirty(false);
    });
  }

  public async ngOnInit(): Promise<void> {
    this.busyService.show();
    try {
      this.entity = this.dataManagementService.entityInteractive;
      this.editableFields = await this.roleService.getEditableFields(
        this.roleService.ownershipInfo.TableName,
        this.dataManagementService.entityInteractive?.GetEntity(),
      );

      const config = await this.projectConfig.getConfig();

      this.canSplitRole =
        ((this.roleService.isAdmin
          ? config.RoleMgmtConfig?.Allow_Roles_Split_By_Admin
          : config.RoleMgmtConfig?.Allow_Roles_Split_By_Business_Owner) &&
          this.roleService.getRoleTypeInfo()?.canBeSplitSource) ||
        false;
      this.setCdrs();

      // can we compare this role to another role?
      this.canCompare = await this.roleService.canCompare();
    } finally {
      this.busyService.hide();
    }
  }

  public async onValueChanged(): Promise<void> {
    this.formGroup.updateValueAndValidity();
  }

  public addControl(name: string | undefined, control: AbstractControl): void {
    if (name != null) {
      this.formGroup.addControl(name, control);
    }
  }

  public async onSave(): Promise<void> {
    this.busyService.show();
    try {
      await this.dataManagementService.refreshInteractive();
      this.formGroup.markAsPristine();
      this.dataManagementService.mainDataDirty(false);
      this.snackbar.open({
        key: '#LDS#Your changes have been successfully saved.',
      });
    } finally {
      this.busyService.hide();
    }
  }

  private setCdrs(): void {
    const entity = this.entity?.GetEntity();
    this.properties = this.cdrfactoryService.buildCdrFromColumnList(entity, this.editableFields) ?? [];
  }

  public async openCompareSidesheet(): Promise<void> {
    this.sidesheet.open(CompareComponent, {
      title: await this.translateService.get('#LDS#Heading Compare and Merge').toPromise(),
      subTitle: this.entity?.GetEntity().GetDisplay(),
      padding: '0px',
      width: calculateSidesheetWidth(),
      testId: 'role-main-data-compare-sidesheet',
    });
  }

  public async openRollbackSidesheet(): Promise<void> {
    const entity = this.entity?.GetEntity();
    if (entity == null) {
      return;
    }
    this.sidesheet.open(RollbackComponent, {
      title: await this.translateService.get('#LDS#Heading Reset to Previous State').toPromise(),
      subTitle: entity.GetDisplay(),
      padding: '0px',
      width: calculateSidesheetWidth(),
      testId: 'role-main-data-rollback-sidesheet',
      data: {
        tableName: entity.TypeName,
        uid: entity.GetKeys()[0],
      },
    });
  }

  public async splitRole(): Promise<void> {
    await this.sidesheet
      .open(SplitComponent, {
        title: await this.translateService.get('#LDS#Heading Split').toPromise(),
        subTitle: this.entity?.GetEntity().GetDisplay(),
        padding: '0px',
        width: calculateSidesheetWidth(),
        testId: 'role-main-data-split-sidesheet',
      })
      .afterClosed()
      .toPromise();
  }
}
