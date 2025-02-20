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

import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortalServicecategories, PortalShopServiceitems } from '@imx-modules/imx-api-qer';
import {
  CollectionLoadParameters,
  CompareOperator,
  DisplayColumns,
  IClientProperty,
  IWriteValue,
  MultiValue,
  TypedEntity,
} from '@imx-modules/imx-qbm-dbts';
import {
  Busy,
  BusyService,
  ClassloggerService,
  DataSourceToolbarComponent,
  DataSourceToolbarSettings,
  DynamicDataApiControls,
  DynamicDataSource,
} from 'qbm';
import { from } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { first, skip } from 'rxjs/operators';
import { CurrentProductSource } from '../current-product-source';
import { NewRequestOrchestrationService } from '../new-request-orchestration.service';
import { SelectedProductSource } from '../new-request-selected-products/selected-product-item.interface';
import { NewRequestSelectionService } from '../new-request-selection.service';
import { NewRequestCategoryApiService } from './new-request-category-api.service';
import { NewRequestProductApiService } from './new-request-product-api.service';
import { ProductDetailsService } from './product-details-sidesheet/product-details.service';
import { ServiceItemParameters } from './service-item-parameters';

export interface NewRequestCategoryNode {
  isSelected?: boolean;
  entity?: PortalServicecategories;
  parent?: NewRequestCategoryNode;
  children?: NewRequestCategoryNode[];
  isLoading?: boolean;
  level?: number;
  isSearchResult?: boolean;
}

@Component({
  selector: 'imx-new-request-product',
  templateUrl: './new-request-product.component.html',
  styleUrls: ['./new-request-product.component.scss'],
})
export class NewRequestProductComponent implements OnInit, OnDestroy {
  // #region Private
  private busy: Busy;
  private subscriptions: Subscription[] = [];
  private accProductGroup: string | undefined;
  private includeChildCategories = false;
  // #endregion

  // #region Public
  public SelectedProductSource = SelectedProductSource;
  public categorySideNavExpanded = true;
  public dst: DataSourceToolbarComponent;
  public dstSettings: DataSourceToolbarSettings;
  public productNavigationState: CollectionLoadParameters | ServiceItemParameters;
  public noDataText = '#LDS#No data';
  public DisplayColumns = DisplayColumns;
  public displayedProductColumns: IClientProperty[];
  public recipients: IWriteValue<string>;
  public serviceCategoriesTotalCount = 0;
  public readonly busyService = new BusyService();
  public resetSidenav = false;
  public selectedServiceCategoryUID: string;
  public selectedServiceItemUID: string;
  public isInitiallyLoading: boolean = true;
  public categoryTreeControl = new FlatTreeControl<NewRequestCategoryNode>(
    (leaf) => leaf.level || 0,
    (leaf) => leaf.entity?.HasChildren.Column.GetValue() || false,
  );
  public apiControls: DynamicDataApiControls<NewRequestCategoryNode> = {
    setup: async () => {
      // We only expect a single root node
      let userParams: CollectionLoadParameters = {
        UID_Person: this.orchestration.recipients
          ? MultiValue.FromString(this.orchestration.recipients.value).GetValues().join(',')
          : undefined,
        ParentKey: '',
      };
      if (this.selectedServiceCategoryUID && !this.resetSidenav) {
        userParams.filter = [
          {
            ColumnName: 'UID_AccProductGroup',
            CompareOp: CompareOperator.Equal,
            Value1: this.selectedServiceCategoryUID,
          },
        ];
        userParams.ParentKey = undefined;
      }
      const servicecategories = await this.categoryApi.get(userParams);
      this.serviceCategoriesTotalCount = servicecategories?.totalCount;
      const dstSettings: DataSourceToolbarSettings = {
        dataSource: servicecategories,
        entitySchema: this.categoryApi.schema,
        navigationState: {
          StartIndex: 0,
        },
      };
      this.orchestration.dstSettingsAllProducts = this.dstSettings;

      const children = servicecategories.Data.map((datum) => {
        const node: NewRequestCategoryNode = {
          entity: datum,
          isSelected: false,
          level: 1,
        };
        return node;
      });
      const totalCount = this.serviceCategoriesTotalCount;
      this.orchestration.disableSearch = totalCount < 1;
      const rootNode: NewRequestCategoryNode = {
        level: 0,
        isSelected: true,
        children: children,
      };
      const dstSettingsDynamicDatasource = totalCount > 0 ? dstSettings : undefined;
      this.isInitiallyLoading = false;
      return { rootNode, dstSettings: dstSettingsDynamicDatasource, totalCount };
    },
    getChildren: async (leaf, onlyCheck?: boolean) => {
      if (leaf.children && leaf.children.length > 0) {
        // No need to get children, we already have them
        return leaf.children;
      }
      if (onlyCheck) {
        // Stop here if we only want to see if a child exists, but not load
        return [];
      }
      leaf.isLoading = true;
      const userParams: CollectionLoadParameters = {
        UID_Person: this.orchestration.recipients
          ? MultiValue.FromString(this.orchestration.recipients.value).GetValues().join(',')
          : undefined,
        PageSize: 1000,
      };
      if (!leaf.entity) {
        return [];
      }
      const data = await this.categoryApi.get({ ParentKey: leaf.entity.UID_AccProductGroup.Column.GetValue(), ...userParams });
      leaf.isLoading = false;
      leaf.children = data.Data.map((datum) => {
        return {
          entity: datum,
          parent: leaf,
          isSelected: false,
          level: (leaf.level || 0) + 1,
        } as NewRequestCategoryNode;
      });
      return leaf.children;
    },
    loadMore: async (root) => {
      // Get children count from root
      const userParams = {
        UID_Person: this.orchestration.recipients
          ? MultiValue.FromString(this.orchestration.recipients.value).GetValues().join(',')
          : undefined,
        ParentKey: '',
      };
      const data = await this.categoryApi.get({ StartIndex: root.children?.length, ...userParams });
      const children = data.Data.map((datum) => {
        return {
          entity: datum,
          parent: root,
          isSelected: false,
          level: (root.level || 0) + 1,
        } as NewRequestCategoryNode;
      });
      root.children?.push(...children);
      return children;
    },
    abortSearch: () => {
      this.orchestration.abortServiceCategoryCall();
    },
    search: async (params: CollectionLoadParameters) => {
      const userParams = {
        UID_Person: this.orchestration.recipients
          ? MultiValue.FromString(this.orchestration.recipients.value).GetValues().join(',')
          : undefined,
      };
      const parentKeyFilter = !!params.search?.length ? {} : { ParentKey: '' };
      this.orchestration.abortServiceCategoryCall();
      const response = await this.categoryApi.get({ ...parentKeyFilter, ...params, ...userParams });
      if (!response?.Data) {
        return {
          searchNodes: [],
        };
      }
      const searchNodes = response.Data.map((datum) => {
        const node: NewRequestCategoryNode = {
          entity: datum,
          isSelected: false,
          level: 1,
          isSearchResult: !!params.search?.length,
        };
        return node;
      });
      const rootNode: NewRequestCategoryNode = {
        isSelected: true,
        level: 0,
        children: searchNodes,
      };
      return { searchNodes, totalCount: response.totalCount, rootNode };
    },
    changeSelection: (data: NewRequestCategoryNode[], selectedNode: NewRequestCategoryNode) => {
      // Reset all other selections and set this one if its keys match
      const key = selectedNode?.entity ? selectedNode.entity.GetEntity().GetKeys()[0] : '';
      data.forEach((node) => {
        // Here we check if the node has an entity, if it does, compare to the key. If it doesn't, check if the key is also empty
        node.isSelected = node?.entity ? node.entity.GetEntity().GetKeys()[0] === key : key === '';
      });
      return data;
    },
  };

  public dynamicDataSource = new DynamicDataSource<NewRequestCategoryNode>(this.categoryTreeControl, this.apiControls);

  public isLoading = (node: NewRequestCategoryNode) => node.isLoading || false;
  // Here we can allow for the root to not be collapsable, but this breaks other functions like the 'collapse all' button
  public hasChild = (_: number, node: NewRequestCategoryNode) =>
    !node.isSearchResult && ((node.children && node.children.length > 0) || node.entity?.HasChildren.Column.GetValue());

  public searchApi = (keywords: string) => {
    this.logger.trace(this, 'Search API: NewRequestProductComponent');
    this.busy = this.busyService.beginBusy();
    this.orchestration.abortCall();
    const parameters: CollectionLoadParameters | ServiceItemParameters = { ...this.getCollectionLoadParameter(), search: keywords };
    return from(this.productApi.get(parameters));
  };
  // #endregion

  constructor(
    public readonly categoryApi: NewRequestCategoryApiService,
    public readonly productApi: NewRequestProductApiService,
    public readonly selectionService: NewRequestSelectionService,
    public readonly orchestration: NewRequestOrchestrationService,
    private readonly logger: ClassloggerService,
    protected readonly productDetailsService: ProductDetailsService,
    private readonly cd: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
  ) {
    this.orchestration.selectedView = SelectedProductSource.AllProducts;
    this.orchestration.searchApi$.next(this.searchApi);

    this.displayedProductColumns = [
      this.productApi.entitySchema.Columns[DisplayColumns.DISPLAY_PROPERTYNAME],
      this.productApi.entitySchema.Columns.ServiceCategoryFullPath,
      this.productApi.entitySchema.Columns.Description,
      this.productApi.entitySchema.Columns.OrderableStatus,
    ];

    //#region Subscriptions
    this.subscriptions.push(
      this.orchestration.currentProductSource$.subscribe((source: CurrentProductSource) => {
        if (source?.view === SelectedProductSource.AllProducts) {
          this.dst = source.dst;
          this.dst.busyService = this.busyService;
          this.dst.clearSearch();
          this.orchestration.dstSettingsAllProducts = this.dstSettings;

          this.subscriptions.push(
            this.dst.searchResults$.subscribe((data) => {
              if (data) {
                this.dstSettings = {
                  dataSource: data,
                  displayedColumns: this.displayedProductColumns,
                  entitySchema: this.productApi.entitySchema,
                  navigationState: this.productNavigationState,
                };
                this.orchestration.dstSettingsAllProducts = this.dstSettings;
              }
              this.busy.endBusy(true);
            }),
          );
        }
      }),
    );

    this.subscriptions.push(
      this.orchestration.navigationState$.pipe(skip(1)).subscribe(async (navigation: CollectionLoadParameters | ServiceItemParameters) => {
        this.productNavigationState = navigation;
        this.updateDisplayedColumns(this.displayedProductColumns);
        await this.getProductData(true);
      }),
    );

    this.subscriptions.push(
      this.orchestration.includeChildCategories$.subscribe(async (includeChilds: boolean) => {
        if (this.includeChildCategories != includeChilds) {
          this.includeChildCategories = includeChilds;
          await this.getProductData();
        }
      }),
    );

    this.subscriptions.push(
      this.selectionService.selectedProducts$.subscribe(() => {
        this.orchestration.preselectBySource(SelectedProductSource.AllProducts, this.dst);
      }),
    );

    this.subscriptions.push(this.selectionService.selectedProductsCleared$.subscribe(() => this.dst?.clearSelection()));

    //#endregion
  }

  public async ngOnInit(): Promise<void> {
    this.productNavigationState = { StartIndex: 0 };
    this.orchestration.selectedCategory = undefined;
    this.updateDisplayedColumns(this.displayedProductColumns);

    const queryParams = await this.route.queryParams.pipe(first()).toPromise();
    const productSearchString = queryParams?.['ProductSearchString'];
    if (!!productSearchString?.length) {
      // the user can pass product search string by URL parameter -> load the data with this search string
      this.setProductSearchString(productSearchString);
    }

    this.selectedServiceCategoryUID = this.route.snapshot.queryParams['serviceCategory'];
    this.selectedServiceItemUID = this.route.snapshot.queryParams['serviceItem'];
    let firstIteration = true;
    this.subscriptions.push(
      this.orchestration.recipients$.subscribe(async (recipients: IWriteValue<string>) => {
        this.recipients = recipients;
        // if the serviceCategory or the serviceItem url param available load only the filtered data
        if (firstIteration && (this.selectedServiceCategoryUID || this.selectedServiceItemUID)) {
          this.setupSelection();
          firstIteration = false;
        } else {
          this.dynamicDataSource.setup(true);
          await this.getProductData(true);
        }
      }),
    );

    // pre-assign the recipient by URL parameter
    this.orchestration.setRecipient(this.route.snapshot.queryParams['UID_Person']);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public categoryObserveExpanded(expanded: boolean): void {
    this.categorySideNavExpanded = !expanded;
  }

  public async categorySelectedNode(node: NewRequestCategoryNode): Promise<void> {
    this.productNavigationState.StartIndex = 0;

    if (node.entity) {
      // This is a category
      let category = node?.entity?.GetEntity();
      this.orchestration.selectedCategory = node?.entity;
      // this.orchestration.includeChildCategories = this.includeChildCategories;
      this.accProductGroup = category.GetKeys()[0];
      await this.getProductData();
    } else {
      // This is the root node and it has no entity
      this.orchestration.selectedCategory = undefined;
      this.includeChildCategories = false;
      // this.orchestration.includeChildCategories = this.includeChildCategories;
      this.accProductGroup = undefined;
      await this.getProductData();
    }

    this.orchestration.includeChildCategories = this.includeChildCategories;
  }

  public onSelectionChanged(items: TypedEntity[]): void {
    this.selectionService.addProducts(items, SelectedProductSource.AllProducts);
  }

  public async onRowSelected(item: TypedEntity): Promise<void> {
    this.productDetailsService.showProductDetails(item as PortalShopServiceitems, this.recipients);
  }

  /**
   * Reset the category tree and the product table to default.
   */
  public async onResetTree(): Promise<void> {
    this.serviceCategoriesTotalCount = -1;
    this.dynamicDataSource.setup(true);
    this.resetSidenav = false;
    this.categorySelectedNode({});
  }

  private updateDisplayedColumns(displayedColumns: IClientProperty[]): void {
    if (this.dstSettings) {
      this.dstSettings.displayedColumns = displayedColumns;
      this.orchestration.dstSettingsAllProducts = this.dstSettings;
    }
  }

  private async getProductData(loadPreselection: boolean = false): Promise<void> {
    if (!this.orchestration.isLoggedIn) {
      return;
    }
    const busy = this.busyService.beginBusy();
    try {
      const parameters = this.getCollectionLoadParameter();
      let data = await this.productApi.get(parameters);

      if (data) {
        this.dstSettings = {
          dataSource: data,
          displayedColumns: this.displayedProductColumns,
          entitySchema: this.productApi.entitySchema,
          navigationState: this.productNavigationState,
        };
        this.orchestration.dstSettingsAllProducts = this.dstSettings;

        if (loadPreselection) {
          this.orchestration.preselectBySource(SelectedProductSource.AllProducts, this.dst);
        }

        this.cd.detectChanges();
      }
    } finally {
      busy.endBusy();
    }
  }

  private getCollectionLoadParameter(): CollectionLoadParameters | ServiceItemParameters {
    let parameters: CollectionLoadParameters | ServiceItemParameters = {
      ...this.productNavigationState,
      UID_Person: this.orchestration.recipients
        ? MultiValue.FromString(this.orchestration.recipients.value).GetValues().join(',')
        : undefined,
    };

    if (this.accProductGroup) {
      parameters.UID_AccProductGroup = this.accProductGroup;
    }

    if (this.accProductGroup && this.includeChildCategories) {
      parameters.IncludeChildCategories = this.includeChildCategories;
    }
    return parameters;
  }
  private async setupSelection(): Promise<void> {
    if (!!this.selectedServiceCategoryUID) {
      this.setupSelectionByCategory();
    } else if (!!this.selectedServiceItemUID) {
      this.setupSelectionByProduct();
    }
  }
  private async setupSelectionByCategory(): Promise<void> {
    await this.dynamicDataSource.setup(true);
    if (this.dynamicDataSource.data.length > 1) {
      this.dynamicDataSource.setSelection(this.dynamicDataSource.data[1]);
      this.categorySelectedNode(this.dynamicDataSource.data[1]);
    } else {
      this.dynamicDataSource.dataChange.next([]);
    }
    this.resetSidenav = true;
  }
  private async setupSelectionByProduct(): Promise<void> {
    this.productNavigationState.filter = [
      {
        ColumnName: 'UID_AccProduct',
        CompareOp: CompareOperator.Equal,
        Value1: this.selectedServiceItemUID,
      },
    ];
    try {
      await this.getProductData();
      if (!!this.dstSettings.dataSource?.Data.length) {
        this.selectedServiceCategoryUID = this.dstSettings.dataSource.Data[0].GetEntity().GetColumn('UID_AccProductGroup').GetValue();
        await this.dynamicDataSource.setup(true);
        if (this.dynamicDataSource.data.length > 1) {
          this.dynamicDataSource.setSelection(this.dynamicDataSource.data[1]);
        }
      }
    } finally {
      this.productNavigationState.filter = [];
      this.resetSidenav = true;
    }
  }

  private async setProductSearchString(productSearchString: string): Promise<void> {
    this.orchestration.keywords = productSearchString;
    this.productNavigationState.search = productSearchString;
    await this.getProductData();
  }
}
