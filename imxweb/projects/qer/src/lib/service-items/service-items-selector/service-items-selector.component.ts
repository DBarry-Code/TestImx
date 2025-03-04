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

import { Component, Inject } from '@angular/core';
import { EuiSidesheetRef, EUI_SIDESHEET_DATA } from '@elemental-ui/core';

import { CollectionLoadParameters, TypedEntity, TypedEntityCollectionData } from '@imx-modules/imx-qbm-dbts';

@Component({
  selector: 'imx-service-items-selector',
  templateUrl: './service-items-selector.component.html',
  styleUrls: ['./service-items-selector.component.scss'],
})
export class ServiceItemsSelectorComponent {
  public selectedItems: TypedEntity[];

  constructor(
    @Inject(EUI_SIDESHEET_DATA)
    public readonly data: {
      getTyped: (parameters: CollectionLoadParameters) => Promise<TypedEntityCollectionData<TypedEntity>>;
      isMultiValue: boolean;
      preselectedEntities: TypedEntity[];
    },
    private readonly sideSheetRef: EuiSidesheetRef,
  ) {
    this.selectedItems = this.data.preselectedEntities;
  }

  public selectionChanged(items: TypedEntity[]): void {
    this.selectedItems = items;
  }

  public applySelection(selected?: TypedEntity): void {
    if (selected) {
      this.selectedItems = [selected];
    }

    this.sideSheetRef.close(this.selectedItems);
  }
}
