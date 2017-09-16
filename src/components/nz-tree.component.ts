import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ContentChild, TemplateRef } from '@angular/core';
import { TreeComponent, TreeModel, TreeNode } from "angular-tree-component";
import { NzTreeOptions } from './nz-tree.options';

@Component({
  selector: 'nz-tree',
  template: `
  <tree-root class="ant-tree" [class.ant-tree-show-line]="nzShowLine" [nodes]="nzNodes" [options]="_options"
    (toggleExpanded)="fireEvent($event)"
    (activate)="fireEvent($event)"
    (deactivate)="fireEvent($event)"
    (focus)="fireEvent($event)"
    (blur)="fireEvent($event)"
    (updateData)="fireEvent($event)"
    (initialized)="fireEvent($event)"
    (moveNode)="fireEvent($event)"
    (copyNode)="fireEvent($event)"
    (loadNodeChildren)="fireEvent($event)"
    (changeFilter)="fireEvent($event)"
    (stateChange)="fireEvent($event)">
    <ng-template #treeNodeFullTemplate let-node let-index="index" let-templates="templates">
      <div
        [class.ant-tree-node]="true"
        [class.ant-tree-node-expanded]="node.isExpanded && node.hasChildren"
        [class.ant-tree-node-collapsed]="node.isCollapsed && node.hasChildren"
        [class.ant-tree-node-leaf]="node.isLeaf"
        [class.ant-tree-node-active]="node.isActive"
        [class.ant-tree-node-focused]="node.isFocused">
        <tree-node-drop-slot *ngIf="index === 0" [dropIndex]="node.index" [node]="node.parent"></tree-node-drop-slot>
        <span
          *ngIf="node.hasChildren"
          [class.ant-tree-switcher_open]="node.isExpanded"
          [class.ant-tree-switcher_close]="node.isCollapsed"
          class="ant-tree-switcher"
          (click)="node.mouseAction('expanderClick', $event)"></span>
        <span
          *ngIf="!node.hasChildren"
          class="ant-tree-switcher ant-tree-switcher-noop">
        </span>
        <span *ngIf="nzCheckable"
          class="ant-tree-checkbox"
          [class.ant-tree-checkbox-checked]="node.data.checked"
          [class.ant-tree-checkbox-disabled]="node.data.disableCheckbox"
          [class.ant-tree-checkbox-indeterminate]="node.data.halfChecked"
          (click)="toggleCheck(node)">
          <span class="ant-tree-checkbox-inner"></span>
        </span>
        <span class="ant-tree-node-content-wrapper"
          [class.ant-tree-node-selected]="node.isActive"
          [class.ant-tree-node-content-wrapper-open]="node.isExpanded"
          [class.ant-tree-node-content-wrapper-close]="node.isCollapsed"
          (click)="node.mouseAction('click', $event)"
          (dblclick)="node.mouseAction('dblClick', $event)"
          (contextmenu)="node.mouseAction('contextMenu', $event)"
          (treeDrop)="node.onDrop($event)"
          (treeDropDragOver)="node.mouseAction('dragOver', $event)"
          (treeDropDragLeave)="node.mouseAction('dragLeave', $event)"
          (treeDropDragEnter)="node.mouseAction('dragEnter', $event)"
          [treeAllowDrop]="node.allowDrop"
          [treeDrag]="node"
          [treeDragEnabled]="node.allowDrag()">
          <span *ngIf="!nzTitle" class="ant-tree-title" [innerHTML]="node.displayField"></span>
          <ng-container
            [ngTemplateOutlet]="nzTitle"
            [ngOutletContext]="{ $implicit: node, node: node, index: index }">
          </ng-container>
        </span>
        <tree-node-children [node]="node" [templates]="templates"></tree-node-children>
        <tree-node-drop-slot [dropIndex]="node.index + 1" [node]="node.parent"></tree-node-drop-slot>
      </div>
    </ng-template>
    <ng-template #loadingTemplate let-node let-index="index" let-templates="templates"></ng-template>
  </tree-root>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
      `


@-webkit-keyframes antCheckboxEffect {
    0% {
      -webkit-transform: scale(1);
              transform: scale(1);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1.6);
              transform: scale(1.6);
      opacity: 0;
    }
  }
  @keyframes antCheckboxEffect {
    0% {
      -webkit-transform: scale(1);
              transform: scale(1);
      opacity: 0.5;
    }
    100% {
      -webkit-transform: scale(1.6);
              transform: scale(1.6);
      opacity: 0;
    }
  }
  .ant-tree-checkbox {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: text-bottom;
  }
  .ant-tree-checkbox-wrapper:hover .ant-tree-checkbox-inner,
  .ant-tree-checkbox:hover .ant-tree-checkbox-inner,
  .ant-tree-checkbox-input:focus + .ant-tree-checkbox-inner {
    border-color: #108ee9;
  }
  .ant-tree-checkbox-checked:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #108ee9;
    content: '';
    -webkit-animation: antCheckboxEffect 0.36s ease-in-out;
            animation: antCheckboxEffect 0.36s ease-in-out;
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    visibility: hidden;
  }
  .ant-tree-checkbox:hover:after,
  .ant-tree-checkbox-wrapper:hover .ant-tree-checkbox:after {
    visibility: visible;
  }
  .ant-tree-checkbox-inner {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    width: 14px;
    height: 14px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background-color: #fff;
    transition: all .3s;
  }
  .ant-tree-checkbox-inner:after {
    -webkit-transform: rotate(45deg) scale(0);
            transform: rotate(45deg) scale(0);
    position: absolute;
    left: 4px;
    top: 1px;
    display: table;
    width: 5px;
    height: 8px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    content: ' ';
    transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6);
  }
  .ant-tree-checkbox-input {
    position: absolute;
    left: 0;
    z-index: 1;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
  .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner:after {
    content: ' ';
    -webkit-transform: scale(1);
            transform: scale(1);
    position: absolute;
    left: 2px;
    top: 5px;
    width: 8px;
    height: 1px;
  }
  .ant-tree-checkbox-indeterminate.ant-tree-checkbox-disabled .ant-tree-checkbox-inner:after {
    border-color: rgba(0, 0, 0, 0.25);
  }
  .ant-tree-checkbox-checked .ant-tree-checkbox-inner:after {
    -webkit-transform: rotate(45deg) scale(1);
            transform: rotate(45deg) scale(1);
    position: absolute;
    left: 4px;
    top: 1px;
    display: table;
    width: 5px;
    height: 8px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    content: ' ';
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
  }
  .ant-tree-checkbox-checked .ant-tree-checkbox-inner,
  .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner {
    background-color: #108ee9;
    border-color: #108ee9;
  }
  .ant-tree-checkbox-disabled {
    cursor: not-allowed;
  }
  .ant-tree-checkbox-disabled.ant-tree-checkbox-checked .ant-tree-checkbox-inner:after {
    -webkit-animation-name: none;
            animation-name: none;
    border-color: rgba(0, 0, 0, 0.25);
  }
  .ant-tree-checkbox-disabled .ant-tree-checkbox-input {
    cursor: not-allowed;
  }
  .ant-tree-checkbox-disabled .ant-tree-checkbox-inner {
    border-color: #d9d9d9 !important;
    background-color: #f7f7f7;
  }
  .ant-tree-checkbox-disabled .ant-tree-checkbox-inner:after {
    -webkit-animation-name: none;
            animation-name: none;
    border-color: #f7f7f7;
  }
  .ant-tree-checkbox-disabled + span {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
  .ant-tree-checkbox-wrapper {
    cursor: pointer;
    font-size: 12px;
    display: inline-block;
  }
  .ant-tree-checkbox-wrapper:not(:last-child) {
    margin-right: 8px;
  }
  .ant-tree-checkbox-wrapper + span,
  .ant-tree-checkbox + span {
    padding-left: 8px;
    padding-right: 8px;
  }
  .ant-tree-checkbox-group {
    font-size: 12px;
  }
  .ant-tree-checkbox-group-item {
    display: inline-block;
  }
  @media \0screen {
    .ant-tree-checkbox-checked .ant-tree-checkbox-inner:before,
    .ant-tree-checkbox-checked .ant-tree-checkbox-inner:after {
      font-family: 'anticon';
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      content: "\\E632";
      font-weight: bold;
      font-size: 8px;
      border: 0;
      color: #fff;
      left: 2px;
      top: 3px;
      position: absolute;
    }
  }
  .ant-tree {
    margin: 0;
    padding: 0;
    font-size: 12px;
  }
  .ant-tree span[draggable="true"] {
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    border-top: 2px transparent solid;
    border-bottom: 2px transparent solid;
    margin-top: -2px;

    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }
  .ant-tree .node-drop-slot {
    display: block;
    height: 2px;
  }
  .ant-tree .node-drop-slot.is-dragging-over {
    background-color: #108ee9;
  }
  .ant-tree-node {
    padding: 4px 0;
    margin: 0;
    list-style: none;
    white-space: nowrap;
    outline: 0;
    position: relative;
  }
  .ant-tree-node .tree-children {
    margin: 0;
    padding: 0 0 0 18px;
    overflow: hidden;
  }
  .ant-tree-node .tree-node-loading {
    position: absolute;
    left: 1px;
    top: 5px;
    background: #fff;
    transition: all .3s;
    width: 24px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
  }
  .ant-tree-node .tree-node-loading:after {
    display: inline-block;
    font-family: 'anticon';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\\E6AE";
    -webkit-animation: loadingCircle 1s infinite linear;
            animation: loadingCircle 1s infinite linear;
    color: #108ee9;
  }
  .ant-tree .ant-tree-node-content-wrapper {
    display: inline-block;
    padding: 3px 5px;
    border-radius: 2px;
    margin: 0;
    cursor: pointer;
    text-decoration: none;
    vertical-align: top;
    color: rgba(0, 0, 0, 0.65);
    transition: all .3s;
    position: relative;
  }
  .ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: #ecf6fd;
  }
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #d2eafb;
  }
  .ant-tree .ant-tree-node-content-wrapper.is-dragging-over {
    background-color: #108ee9;
    color: white;
    opacity: 0.8;
  }
  .ant-tree span.ant-tree-checkbox {
    margin: 0 4px 0 2px;
    vertical-align: middle;
  }
  .ant-tree span.ant-tree-switcher,
  .ant-tree span.ant-tree-iconEle {
    margin: 0;
    width: 24px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    vertical-align: middle;
    border: 0 none;
    cursor: pointer;
    outline: none;
    text-align: center;
  }
  .ant-tree span.ant-tree-icon_loading {
    position: absolute;
    left: 0;
    top: 1px;
    background: #fff;
    -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
    transition: all .3s;
  }
  .ant-tree span.ant-tree-icon_loading:after {
    display: inline-block;
    font-family: 'anticon';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\\E6AE";
    -webkit-animation: loadingCircle 1s infinite linear;
            animation: loadingCircle 1s infinite linear;
    color: #108ee9;
  }
  .ant-tree span.ant-tree-switcher.ant-tree-switcher-noop {
    cursor: default;
  }
  .ant-tree span.ant-tree-switcher.ant-tree-switcher_open:after {
    font-size: 12px;
    font-size: 7px \9;
    -webkit-transform: scale(0.58333333) rotate(0deg);
            transform: scale(0.58333333) rotate(0deg);

    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    display: inline-block;
    font-family: 'anticon';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\\E606";
    font-weight: bold;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
  }
  :root .ant-tree span.ant-tree-switcher.ant-tree-switcher_open:after {
    -webkit-filter: none;
            filter: none;
  }
  :root .ant-tree span.ant-tree-switcher.ant-tree-switcher_open:after {
    font-size: 12px;
  }
  .ant-tree span.ant-tree-switcher.ant-tree-switcher_close {
    -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
  }
  .ant-tree span.ant-tree-switcher.ant-tree-switcher_close:after {
    font-size: 12px;
    font-size: 7px \9;
    -webkit-transform: scale(0.58333333) rotate(0deg);
            transform: scale(0.58333333) rotate(0deg);

    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    display: inline-block;
    font-family: 'anticon';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\\E606";
    font-weight: bold;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
  }
  :root .ant-tree span.ant-tree-switcher.ant-tree-switcher_close:after {
    -webkit-filter: none;
            filter: none;
  }
  :root .ant-tree span.ant-tree-switcher.ant-tree-switcher_close:after {
    font-size: 12px;
  }
  .ant-tree span.ant-tree-switcher.ant-tree-switcher_close:after {
    -webkit-transform: rotate(270deg) scale(0.59);
            transform: rotate(270deg) scale(0.59);
  }
  .ant-tree:last-child > span.ant-tree-switcher:before,
  .ant-tree:last-child > span.ant-tree-iconEle:before {
    display: none;
  }
  .ant-tree.ant-tree-show-line .ant-tree-node {
    position: relative;
  }
  .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher {
    background: #fff;
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher-noop:after {
    font-size: 12px;
    font-size: 12px \9;
    -webkit-transform: scale(1) rotate(0deg);
            transform: scale(1) rotate(0deg);

    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    display: inline-block;
    font-family: 'anticon';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\\E664";
    vertical-align: baseline;
    font-weight: normal;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
  }
  :root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher-noop:after {
    -webkit-filter: none;
            filter: none;
  }
  :root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher-noop:after {
    font-size: 12px;
  }
  .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_open {
    color: rgba(0, 0, 0, 0.43);
  }
  .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_open:after {
    font-size: 12px;
    font-size: 12px \9;
    -webkit-transform: scale(1) rotate(0deg);
            transform: scale(1) rotate(0deg);

    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    display: inline-block;
    font-family: 'anticon';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\\E621";
    vertical-align: baseline;
    font-weight: normal;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
  }
  :root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_open:after {
    -webkit-filter: none;
            filter: none;
  }
  :root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_open:after {
    font-size: 12px;
  }
  .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_close {
    color: rgba(0, 0, 0, 0.43);
  }
  .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_close:after {
    font-size: 12px;
    font-size: 12px \9;
    -webkit-transform: scale(1) rotate(0deg);
            transform: scale(1) rotate(0deg);

    -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";
    zoom: 1;
    display: inline-block;
    font-family: 'anticon';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\\E645";
    vertical-align: baseline;
    font-weight: normal;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
  }
  :root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_close:after {
    -webkit-filter: none;
            filter: none;
  }
  :root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_close:after {
    font-size: 12px;
  }
  .ant-tree.ant-tree-show-line tree-node:not(:last-child) .ant-tree-node:before {
    content: ' ';
    width: 1px;
    border-left: 1px solid #d9d9d9;
    height: 100%;
    position: absolute;
    left: 11px;
    margin: 20px 0;
  }

      `
  ]
})
export class NzTreeComponent implements OnChanges {
  _options: NzTreeOptions;

  @Input() nzNodes: any[];
  @Input() nzCheckable: boolean = false;
  @Input() nzShowLine: boolean = false;
  @Input() nzOptions: any;
  @ContentChild('nzTitle') nzTitle: TemplateRef<any>;
  @ContentChild('nzLoading') nzLoading: TemplateRef<any>;

  @Output() nzToggleExpanded = new EventEmitter();
  @Output() nzActivate = new EventEmitter();
  @Output() nzDeactivate = new EventEmitter();
  @Output() nzFocus = new EventEmitter();
  @Output() nzBlur = new EventEmitter();
  @Output() nzUpdateData = new EventEmitter();
  @Output() nzInitialized = new EventEmitter();
  @Output() nzMoveNode = new EventEmitter();
  @Output() nzCopyNode = new EventEmitter();
  @Output() nzLoadNodeChildren = new EventEmitter();
  @Output() nzChangeFilter = new EventEmitter();
  @Output() nzEvent = new EventEmitter();
  @Output() nzStateChange = new EventEmitter();
  @Output() nzCheck = new EventEmitter();

  @ViewChild(TreeComponent)
  tree: TreeComponent;

  get treeModel(): TreeModel {
    return this.tree.treeModel;
  }

  toggleCheck(node: TreeNode) {
    if (node.data.disableCheckbox !== true) {
      node.data.checked = !node.data.checked;
      this.updateCheckState(node, node.data.checked);
      this.fireEvent({ eventName: 'check', node: node, checked: node.data.checked });
    }
  }

  private updateCheckState(node: TreeNode, checkIt: boolean) {
    const childLoop = (parentNode: TreeNode) => {
      if (!parentNode.children) return;
      for (const childNode of parentNode.children) {
        if (!childNode.data.disableCheckbox) {
          childNode.data.halfChecked = false;
          childNode.data.checked = checkIt;
        }
        childLoop(childNode);
      }
    };

    childLoop(node);

    const parentLoop = (childNode: TreeNode) => {
      if (!childNode.parent) return;
      const parentNode = childNode.parent;
      let childrenCount = parentNode.children.length;
      let checkedChildrenCount = 0;
      for (const item of parentNode.children) {
        if (item.data.disableCheckbox) {
          childrenCount -= 1;
          continue;
        }
        if (item.data.checked === true) checkedChildrenCount++;
        else if (item.data.halfChecked === true) checkedChildrenCount += 0.5;
      }
      if (checkedChildrenCount === childrenCount) {
        parentNode.data.checked = true;
        parentNode.data.halfChecked = false;
      } else if (checkedChildrenCount > 0) {
        parentNode.data.checked = false;
        parentNode.data.halfChecked = true;
      } else {
        parentNode.data.checked = false;
        parentNode.data.halfChecked = false;
      }
      parentLoop(parentNode);
    };
    parentLoop(node);
  }

  fireEvent(event: any) {
    const eventName = event && event.eventName;
    if (eventName && typeof eventName === 'string') {
      const emitEventName = 'nz' + (eventName.charAt(0).toUpperCase() + eventName.slice(1));
      const emitObj = this[emitEventName];
      if (<any>this[emitEventName]) this[emitEventName].emit(event);
    }
    this.nzEvent.emit(event);
  }

  ngOnInit() {
    console.log('this._options', this._options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._options = Object.assign({
      animateExpand: true
    }, this.nzOptions);
  }


}
