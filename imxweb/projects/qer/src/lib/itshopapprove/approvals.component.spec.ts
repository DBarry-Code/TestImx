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

import { ActivatedRoute } from '@angular/router';
import { EuiSidesheetService } from '@elemental-ui/core';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { clearStylesFromDOM } from 'qbm';
import { from } from 'rxjs';
import { UserModelService } from '../user/user-model.service';
import { ApprovalsComponent } from './approvals.component';
import { ApprovalsModule } from './approvals.module';

describe('Approvals', () => {
  let component: ApprovalsComponent;
  let fixture: MockedComponentFixture<ApprovalsComponent>;

  beforeEach(() => {
    return MockBuilder(ApprovalsComponent, ApprovalsModule)
      .mock(EuiSidesheetService)
      .mock(
        UserModelService,
        { getPendingItems: jasmine.createSpy('getPendingItems').and.returnValue(Promise.resolve({})) },
        { export: true },
      )
      .mock(
        ActivatedRoute,
        {
          queryParams: from([]),
        },
        { export: true },
      );
  });

  beforeEach(() => {
    fixture = MockRender(ApprovalsComponent);
    component = fixture.point.componentInstance;
  });

  afterAll(() => {
    clearStylesFromDOM();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
  });
});
