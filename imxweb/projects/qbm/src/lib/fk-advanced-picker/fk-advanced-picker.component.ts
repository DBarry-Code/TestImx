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

import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EUI_SIDESHEET_DATA, EuiSidesheetRef } from '@elemental-ui/core';
import { Subscription } from 'rxjs';

import { IEntity, IForeignKeyInfo, TypedEntity } from '@imx-modules/imx-qbm-dbts';
import { MetadataService } from '../base/metadata.service';
import { ClassloggerService } from '../classlogger/classlogger.service';
import { ConfirmationService } from '../confirmation/confirmation.service';
import { FkSelectorComponent } from './fk-selector.component';
import { ForeignKeyPickerData } from './foreign-key-picker-data.interface';

@Component({
  templateUrl: './fk-advanced-picker.component.html',
  styleUrls: ['./fk-advanced-picker.component.scss'],
})
export class FkAdvancedPickerComponent implements OnInit, OnDestroy {
  @ViewChild(FkSelectorComponent) public selector: FkSelectorComponent;
  public selectedTable: IForeignKeyInfo;
  private isChanged = false;
  private closeClickSubscription: Subscription;

  public tableNames: string[];
  public selectedEntityCandidates: TypedEntity[] = [];

  constructor(
    public sidesheetRef: EuiSidesheetRef,
    @Inject(EUI_SIDESHEET_DATA) public readonly data: ForeignKeyPickerData,
    public readonly metadataProvider: MetadataService,
    private readonly logger: ClassloggerService,
    private readonly confirmation: ConfirmationService,
    private readonly elementRef: ElementRef,
  ) {
    this.closeClickSubscription = this.sidesheetRef.closeClicked().subscribe(async () => {
      if (!this.isChanged || (await this.confirmation.confirmLeaveWithUnsavedChanges())) {
        this.sidesheetRef.close();
      }
    });
  }

  public ngOnInit(): void {
    this.selectedTable = this.data.fkRelations.find((fkr) => fkr.TableName === this.data.selectedTableName) || this.data.fkRelations[0];
    this.tableNames = this.data.fkRelations?.map((elem) => elem.TableName);
    this.elementRef.nativeElement.setAttribute('data-imx-identifier', `cdr-picker-${this.selectedTable.ColumnName}`);
  }

  public ngOnDestroy(): void {
    this.closeClickSubscription.unsubscribe();
  }

  /**
   * @ignore
   * Assigns the foreign key, that was provided by the FkSelectorComponent
   */
  public selectObject(entity: TypedEntity): void {
    this.applySelection(entity);
  }

  /**
   * @ignore
   * Updates the currently selected table, that could by used for the title
   */
  public updateTable(table: IForeignKeyInfo): void {
    this.selectedTable = table;
  }

  /**
   * @ignore
   * Assigns foreign key(s) by passing the value and the displayvalue to the parent component
   */
  public applySelection(selected?: TypedEntity): void {
    const entityList = selected == null ? this.selector.selectedCandidates : [selected];
    this.sidesheetRef.close({
      table: this.selector.selectedTable,
      candidates: entityList.map((typedEntity) => {
        const entity = typedEntity.GetEntity();
        const columnName = this.selectedTable.fkColumnName ?? this.selectedTable.ColumnName;
        const data = entity.GetColumn(columnName)?.GetValue();
        return {
          DataValue: data !== '' ? data : this.getKey(entity),
          DisplayValue: entity.GetDisplay(),
          displayLong: entity.GetDisplayLong(),
        };
      }),
    });
  }

  public onSelectedCandidatesChanges(): void {
    this.isChanged = this.data.isMultiValue ?? false;
  }

  private getKey(entity: IEntity): string | undefined {
    if (this.data.fkRelations && this.data.fkRelations.length > 1) {
      this.logger.trace(this, 'Dynamic foreign key');
      const xObjectKeyColumn = entity.GetColumn('XObjectKey');
      return xObjectKeyColumn ? xObjectKeyColumn.GetValue() : undefined;
    }

    this.logger.trace(this, 'Foreign key');

    try {
      const parentColumnValue = entity.GetColumn(this.data.fkRelations[0].ColumnName)?.GetValue() ?? '';
      if (parentColumnValue !== '') {
        this.logger.trace(this, 'Use value from explicit parent column');
        return parentColumnValue;
      }
    } catch (error) {
      this.logger.trace(this, 'tried to get parent column but failed', error);
    }

    const keys = entity.GetKeys();
    return keys && keys.length ? keys[0] : undefined;
  }
}
