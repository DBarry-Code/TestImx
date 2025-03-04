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
import { Router } from '@angular/router';
import { EuiSidesheetService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';
import { calculateSidesheetWidth } from 'qbm';
import { RelatedApplicationsSidesheetComponent } from './related-applications-sidesheet/related-applications-sidesheet.component';

@Component({
  selector: 'imx-related-applications',
  template: '',
})
export class RelatedApplicationsComponent implements OnInit {
  constructor(
    private readonly sidesheet: EuiSidesheetService,
    private router: Router,
    private readonly translate: TranslateService,
  ) {}

  public async ngOnInit(): Promise<void> {
    const sidesheetRef = this.sidesheet.open(RelatedApplicationsSidesheetComponent, {
      testId: 'related-applications-sidesheet',
      title: await this.translate.get('#LDS#Heading Other Web Applications').toPromise(),
      padding: '0px',
      width: calculateSidesheetWidth(),
    });

    sidesheetRef.closeClicked().subscribe(() => {
      this.router.navigate(['dashboard']);
    });
  }
}
