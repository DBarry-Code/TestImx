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

import { Component, Input } from '@angular/core';
import { PolicyViolation, ViolationState } from '@imx-modules/imx-api-att';

@Component({
  selector: 'imx-decision-policy-violation',
  templateUrl: './decision-policy-violation.component.html',
  styleUrls: ['./decision-policy-violation.component.scss'],
})
export class DecisionPolicyViolationComponent {
  @Input() public policyViolations: PolicyViolation[];
  @Input() public mitigatingControlsPerViolation: boolean;

  constructor() {}

  public stateDisplay(violation: PolicyViolation) {
    switch (violation.State){
      case ViolationState.ExceptionApproved: return '#LDS#Exception granted';
      case ViolationState.ExceptionDenied: return '#LDS#Exception denied';
    }

    return '#LDS#Approval decision pending';
  }
}
