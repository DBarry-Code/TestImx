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

import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { EditorBase } from '../editor-base';

/**
 * Provides a {@link CdrEditor | CDR editor} for editing / viewing multiline string columns
 * 
 * To change the value, it uses a text area.
 * When set to read-only, it uses a {@link ViewPropertyComponent | view property component} to display the content.
 */
@Component({
  selector: 'imx-edit-multiline',
  templateUrl: './edit-multiline.component.html',
  styleUrls: ['./edit-multiline.component.scss'],
})
export class EditMultilineComponent extends EditorBase<string> {
  /**
   * The form control associated with the editor.
   */
  public readonly control = new UntypedFormControl(undefined, { updateOn: 'blur' });
}
