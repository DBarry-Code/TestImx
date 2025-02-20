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
import { EuiLoadingService, EuiSidesheetService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';

import { HistoryFilterMode, ITShopConfig } from '@imx-modules/imx-api-qer';
import { CollectionLoadParameters, EntityData, EntitySchema, TypedEntity, ValType } from '@imx-modules/imx-qbm-dbts';
import {
  AuthenticationService,
  calculateSidesheetWidth,
  ClassloggerService,
  ClientPropertyForTableColumns,
  DataSourceToolbarFilter,
  DataSourceToolbarSettings,
  ISessionState,
} from 'qbm';
import { ProjectConfigurationService } from '../../../project-configuration/project-configuration.service';
import { ItshopRequest } from '../../../request-history/itshop-request';
import { RequestDetailComponent } from '../../../request-history/request-detail/request-detail.component';
import { Approval } from '../../approval';
import { ApprovalHistoryService } from './approval-history.service';

@Component({
  selector: 'imx-approval-history',
  templateUrl: './approval-history.component.html',
  styleUrls: ['./approval-history.component.scss'],
})
export class ApprovalHistoryComponent implements OnInit {
  @Input() public approval: Approval;
  public dstSettings: DataSourceToolbarSettings;
  public entitySchema: EntitySchema;
  // eslint-disable-next-line no-bitwise
  public filtermode: HistoryFilterMode = HistoryFilterMode.SameAccProduct | HistoryFilterMode.SameStep;
  public filters: DataSourceToolbarFilter[] = [];
  public hasFilterApplied = true;

  public alertText =
    '#LDS#Here you can find information to help you make an approval decision. You can find information on requests for the same recipient, on requests of the same product and on approval decisions you made. Use the filters to narrow down or extend the information. Click a request to get more information.';

  private navigationState: CollectionLoadParameters = { OrderBy: 'OrderDate' };
  private currentUser: string;
  private displayedColumns: ClientPropertyForTableColumns[];
  private itShopConfig: ITShopConfig | undefined;

  constructor(
    private readonly approvalHistoryservice: ApprovalHistoryService,
    private readonly busy: EuiLoadingService,
    private readonly logger: ClassloggerService,
    private readonly translate: TranslateService,
    private readonly sideSheet: EuiSidesheetService,
    private readonly projectConfig: ProjectConfigurationService,
    auth: AuthenticationService,
  ) {
    auth.onSessionResponse.subscribe((session: ISessionState) => (this.currentUser = session.UserUid || ''));
  }

  public async ngOnInit(): Promise<void> {
    this.entitySchema = this.approvalHistoryservice.PortalItshopRequestsSchema;
    this.filters = await this.buildFilter();
    if (this.busy.overlayRefs.length === 0) {
      this.busy.show();
    }
    try {
      this.itShopConfig = (await this.projectConfig.getConfig()).ITShopConfig;
    } finally {
      this.busy.hide();
    }
    return this.navigate();
  }

  public async onNavigationStateChanged(state: CollectionLoadParameters): Promise<void> {
    this.navigationState = state;
    return this.navigate();
  }

  public onSearch(keywords: string): Promise<void> {
    this.navigationState = {
      ...this.navigationState,
      ...{
        StartIndex: 0,
        search: keywords,
      },
    };

    return this.navigate();
  }

  public isApproved(pwo: ItshopRequest): { caption: string; color: string } | undefined {
    const approvalStep = pwo.pwoData.WorkflowHistory?.Entities?.find(
      (entity) =>
        entity.Columns?.DecisionLevel.Value === this.approval.DecisionLevel.value &&
        entity.Columns?.UID_PersonHead.Value === this.currentUser &&
        entity.Columns?.DecisionType.Value !== 'Order',
    );

    if (approvalStep == null) {
      this.logger.warn(this, 'no approval step found');
      return undefined;
    }

    return {
      caption: approvalStep.Columns?.DecisionType.DisplayValue || '',
      color:
        approvalStep.Columns?.DecisionType.Value === 'Grant'
          ? 'green'
          : approvalStep.Columns?.DecisionType.Value === 'Dissmiss'
            ? 'red'
            : 'gray',
    };
  }

  public async filterChanged(evt: HistoryFilterMode): Promise<void> {
    this.filtermode = evt;
    return this.navigate();
  }

  public get isSameStepActive(): boolean {
    // eslint-disable-next-line no-bitwise
    return (this.filtermode & HistoryFilterMode.SameStep) === HistoryFilterMode.SameStep;
  }

  public async viewDetails(pwo: TypedEntity): Promise<void> {
    await this.sideSheet
      .open(RequestDetailComponent, {
        title: await this.translate.get('#LDS#Heading View Request Details').toPromise(),
        subTitle: pwo.GetEntity().GetDisplay(),
        padding: '0px',
        width: calculateSidesheetWidth(1000),
        testId: 'imx-approval-history-request-detail',
        data: {
          isReadOnly: true,
          personWantsOrg: pwo,
          itShopConfig: this.itShopConfig,
          userUid: this.currentUser,
          disableActions: true,
        },
      })
      .afterClosed()
      .toPromise();
  }

  private async navigate(): Promise<void> {
    let result: any;

    if (this.busy.overlayRefs.length === 0) {
      this.busy.show();
    }
    try {
      this.hasFilterApplied = this.filtermode !== HistoryFilterMode.None;
      if (!this.hasFilterApplied) {
        this.logger.debug(this, 'no filter selected');
        result = { Data: [], totalCount: 0, extendedData: {} };
      } else {
        const currentHelperPwo = this.getCurrentPwoHelperPwo();

        if (currentHelperPwo == null) {
          this.logger.warn(this, 'no workflow data for this step / approver combination');
          return;
        }

        result = currentHelperPwo.Columns?.UID_PWOHelperPWO.Value
          ? await this.approvalHistoryservice.getRequests(
              currentHelperPwo.Columns?.UID_PWOHelperPWO.Value,
              this.filtermode,
              this.currentUser,
              this.navigationState,
            )
          : undefined;
      }
    } finally {
      this.busy.hide();
    }

    if (result != null) {
      this.displayedColumns = [
        this.entitySchema.Columns.UID_PersonOrdered,
        this.entitySchema.Columns.OrderDate,
        this.entitySchema.Columns.UiOrderState,
      ];

      if (this.isSameStepActive) {
        this.displayedColumns.push({ Type: ValType.String, ColumnName: 'decision', untranslatedDisplay: '#LDS#Approval decision' });
      }

      this.dstSettings = {
        dataSource: {
          totalCount: result.totalCount,
          Data: result.Data,
        },
        displayedColumns: this.displayedColumns,
        entitySchema: this.entitySchema,
        navigationState: this.navigationState,
        extendedData: result.extendedData.Data,
        filters: this.filters,
      };
    }
  }

  private getCurrentPwoHelperPwo(): EntityData | undefined {
    const currentStep = this.approval.pwoData.WorkflowSteps?.Entities?.find(
      (elem) =>
        elem.Columns?.UID_QERWorkingMethod.Value === this.approval.UID_QERWorkingMethod.value &&
        elem.Columns?.LevelNumber.Value === this.approval.DecisionLevel.value,
    );
    this.logger.trace(this, 'current step the user has to decide', currentStep);

    return this.approval.pwoData.WorkflowData?.Entities?.find(
      (elem) =>
        elem.Columns?.RulerLevel.Value === 0 &&
        elem.Columns?.UID_QERWorkingStep.Value === currentStep?.Columns?.UID_QERWorkingStep.Value &&
        elem.Columns?.UID_PersonHead.Value === this.currentUser,
    );
  }

  private async buildFilter(): Promise<DataSourceToolbarFilter[]> {
    const filterMode: DataSourceToolbarFilter = {
      Name: 'filtermode',
      Description: await this.translate.get('#LDS#Filter').toPromise(),
      Delimiter: ',',
      Options: [
        { Value: '1', Display: await this.translate.get('#LDS#Same product').toPromise() },
        { Value: '2', Display: await this.translate.get('#LDS#Same recipient').toPromise() },
        { Value: '4', Display: await this.translate.get('#LDS#Your approval decisions').toPromise() },
      ],
    };
    return [filterMode];
  }
}
