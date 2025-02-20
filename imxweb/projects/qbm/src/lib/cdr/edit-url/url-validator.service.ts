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
import { ValidatorFn, Validators } from '@angular/forms';

/**
 * A service for providing an url validation.
 */
@Injectable({
  providedIn: 'root',
})
export class UrlValidatorService {

  /**
   * Validates, if the given string uses the right pattern.
   * @example
   * Valid urls could be:
   * 'https://localhost:8182'
   * 'http://www.google.com'
   */
  public readonly validators: ReadonlyArray<ValidatorFn> = [
    Validators.pattern(new RegExp('^(http|https)://[a-zA-Z0-9-.]+.[a-zA-Z]{2,3}(/S*)?')),
  ];
}
