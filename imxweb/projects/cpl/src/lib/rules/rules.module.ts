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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { EuiCoreModule } from '@elemental-ui/core';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { CdrModule, DataSourceToolbarModule, DataTableModule, DataViewModule, ExtModule, HelpContextualModule } from 'qbm';
import { ObjectHyperviewModule, StatisticsModule } from 'qer';
import { RulesViolationsModule } from '../rules-violations/rules-violations.module';
import { MitigatingControlsRulesComponent } from './mitigating-controls-rules/mitigating-controls-rules.component';
import { RulesSidesheetComponent } from './rules-sidesheet/rules-sidesheet.component';
import { ViolationsPerRuleComponent } from './rules-sidesheet/violations-per-rule/violations-per-rule.component';
import { RulesComponent } from './rules.component';

@NgModule({
  declarations: [RulesComponent, RulesSidesheetComponent, MitigatingControlsRulesComponent, ViolationsPerRuleComponent],
  imports: [
    CommonModule,
    EuiCoreModule,
    TranslateModule,
    CdrModule,
    DataTableModule,
    DataSourceToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    StatisticsModule,
    ObjectHyperviewModule,
    HelpContextualModule,
    ExtModule,
    RulesViolationsModule,
    DataViewModule,
    MatTableModule,
  ],
})
export class RulesModule {}
