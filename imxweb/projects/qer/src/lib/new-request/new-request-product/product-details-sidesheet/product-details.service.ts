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

import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { EuiSidesheetService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';

import { IWriteValue, MultiValue, TypedEntity } from '@imx-modules/imx-qbm-dbts';
import { LdsReplacePipe, calculateSidesheetWidth } from 'qbm';
import { ImageService } from '../../../itshop/image.service';
import { ProjectConfigurationService } from '../../../project-configuration/project-configuration.service';
import { ProductDetailsSidesheetComponent } from './product-details-sidesheet.component';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  constructor(
    private readonly image: ImageService,
    private readonly ldsReplace: LdsReplacePipe,
    private readonly sidesheetService: EuiSidesheetService,
    private readonly translateService: TranslateService,
    private readonly projectConfigService: ProjectConfigurationService,
  ) {}

  public async showProductDetails(item: TypedEntity, recipients: IWriteValue<string>): Promise<void> {
    const projectConfig = await this.projectConfigService.getConfig();

    const orderStatus = await this.getOrderStatus(item, recipients);
    await this.sidesheetService
      .open(ProductDetailsSidesheetComponent, {
        title: await this.translateService.get('#LDS#Heading View Product Details').toPromise(),
        subTitle: item.GetEntity().GetDisplay(),
        icon: 'info',
        width: calculateSidesheetWidth(),
        padding: '0px',
        testId: 'product-details-sidesheet',
        data: {
          item,
          orderStatus: orderStatus,
          imageUrl: this.getProductImage(item),
          projectConfig,
        },
      })
      .afterClosed()
      .toPromise();
  }

  public valueContains(input: string, values: string | string[]): boolean {
    const inputValues = MultiValue.FromString(input).GetValues();
    if (typeof values === 'string') {
      return inputValues.includes(values);
    }
    return inputValues.findIndex((i) => values.includes(i)) !== -1;
  }

  public getProductImage(node: TypedEntity): SafeUrl | undefined {
    try {
      return this.image.getPath(node);
    } catch (e) {}
  }

  private async getOrderStatus(
    item: TypedEntity,
    recipients: IWriteValue<string>,
  ): Promise<{ statusIcon: string; statusDisplay: string } | undefined> {
    const orderableStatus = item.GetEntity().GetColumn('OrderableStatus').GetValue();
    if (!orderableStatus || orderableStatus.length === 0) {
      return undefined;
    }

    switch (true) {
      case this.valueContains(orderableStatus, ['PERSONHASOBJECT', 'PERSONHASASSIGNMENTORDER', 'ASSIGNED']):
        const statusDisplay: string = await this.translateService.get('#LDS#This product has already been assigned to {0}.').toPromise();
        return { statusIcon: 'info', statusDisplay: this.ldsReplace.transform(statusDisplay, recipients.Column.GetDisplayValue()) };

      case this.valueContains(orderableStatus, 'ORDER'):
        return {
          statusIcon: 'request',
          statusDisplay: await this.translateService.get('#LDS#This product has already been requested.').toPromise(),
        };

      case this.valueContains(orderableStatus, 'NOTORDERABLE'):
        return {
          statusIcon: 'error',
          statusDisplay: await this.translateService.get('#LDS#This product cannot currently be requested.').toPromise(),
        };

      case this.valueContains(orderableStatus, 'CART'):
        return {
          statusIcon: 'error',
          statusDisplay: await this.translateService.get('#LDS#This product is already in your shopping cart.').toPromise(),
        };
    }
  }
}
