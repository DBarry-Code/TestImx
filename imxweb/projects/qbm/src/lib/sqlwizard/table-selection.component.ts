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

import { Component, Input, OnInit } from '@angular/core';
import { EuiSelectOption } from '@elemental-ui/core';
import { SqlNodeView } from './SqlNodeView';
import { SqlWizardApiService } from './sqlwizard-api.service';

@Component({
  selector: 'imx-sqlwizard-tableselection',
  templateUrl: './table-selection.component.html',
})
export class TableSelectionComponent implements OnInit {
  @Input() public node: SqlNodeView;

  public selectableTables: EuiSelectOption[] = [];

  public tableFilter: string;

  constructor(private readonly sqlApiService: SqlWizardApiService) {}

  public async ngOnInit() {
    // TODO const tables = await this.sqlApiService.getSelectableTables(this.node.Data.);
    // this.selectableTables = tables;
  }

  public filter(option: EuiSelectOption, searchInputValue: string): boolean {
    return option.display.toString().toUpperCase().trim().includes(searchInputValue.toUpperCase().trim());
  }
}
