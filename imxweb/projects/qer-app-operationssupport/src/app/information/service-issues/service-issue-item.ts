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

import { IssueAction, IssueItem } from './service-issues.models';

export enum ServiceIssueType {
  Undefined,
  DbSchedulerDisabled,
  JobServiceDisabled,
  CompilationRequired,
  MaintenanceMode,
  FrozenJobs,
  InactiveServers,
  UnresolvedRefs,
  SyncIssues,
  SystemThresholdExceeded,
}

export class ServiceIssueItem implements IssueItem {
  public id?: string;
  public title: string;
  public text: string;
  public icon: string;
  public severityClass?: string;
  public action?: IssueAction;
  public type: ServiceIssueType;

  constructor() {
    this.type = ServiceIssueType.Undefined;
  }
}
