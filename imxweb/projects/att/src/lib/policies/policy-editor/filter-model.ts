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

import { BehaviorSubject } from 'rxjs';

import { ParmData, PolicyFilterData, PolicyFilterElement } from '@imx-modules/imx-api-att';
import { FilterElementColumnService } from '../editors/filter-element-column.service';
import { FilterElementModel } from '../editors/filter-element-model';
import { SelectecObjectsInfo } from '../selected-objects/selected-objects-info.interface';

export class FilterModel {
  public totalSelectedObjectsSubject: BehaviorSubject<SelectecObjectsInfo | undefined> = new BehaviorSubject<
    SelectecObjectsInfo | undefined
  >(undefined);
  public policyFilterData: PolicyFilterData | undefined;
  public parameterConfig: ParmData[] = [];
  public uidAttestationObject: string;

  constructor(
    public readonly columnFactory: FilterElementColumnService,
    public readonly attestationObjectSubject: BehaviorSubject<string>,
  ) {
    attestationObjectSubject.subscribe((elem) => {
      this.uidAttestationObject = elem;
    });
  }

  public dispose(): void {
    this.attestationObjectSubject.unsubscribe();
  }

  public async updateConfig(): Promise<void> {
    this.parameterConfig = await this.columnFactory.policyService.getParmData(this.uidAttestationObject);
  }

  public addCondition(): FilterElementModel {
    const newCondition = this.buildPolicyModel({}, []);
    this.policyFilterData?.Filter?.Elements?.push(newCondition.filterElement);
    this.policyFilterData?.InfoDisplay?.push(['']);
    return newCondition;
  }

  public deleteCondition(index: number): void {
    this.policyFilterData?.Filter?.Elements?.splice(index, 1);
    this.policyFilterData?.InfoDisplay?.splice(index, 1);
  }

  public filterHasChanged(filterElements: FilterElementModel[], type: string): void {
    this.totalSelectedObjectsSubject.next(
      this.filtersAreValid(filterElements)
        ? {
            policyFilter: {
              Elements: filterElements.map((filter) => filter.filterElement),
              ConcatenationType: type,
            },
            uidPickCategory: '',
            uidAttestationObject: this.uidAttestationObject,
          }
        : undefined,
    );
  }

  public updateConcatination(concat: string): void {
    if (this.policyFilterData?.Filter) {
      this.policyFilterData.Filter.ConcatenationType = concat;
    }
  }

  public buildPolicyModel(filterElement: PolicyFilterElement, displays?: string[]): FilterElementModel {
    const model = new FilterElementModel(
      this.parameterConfig,
      displays || [],
      filterElement,
      this.uidAttestationObject,
      this.columnFactory,
    );

    return model;
  }

  private filtersAreValid(filterElements: FilterElementModel[]): boolean {
    return filterElements.filter((elem) => elem.filterErrors() == null).length === filterElements.length;
  }
}
