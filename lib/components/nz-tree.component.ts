import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ContentChild, TemplateRef, OnInit, SimpleChange } from '@angular/core';
import { TreeComponent, TreeModel, TreeNode, TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
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
            [ngTemplateOutletContext]="{ $implicit:node, node: node, index: index }">
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
  styleUrls: [
    './style/index.less',
    './style/patch.less'
  ]
})
export class NzTreeComponent implements OnInit, OnChanges {
  _options: NzTreeOptions;

  @Input() nzNodes: any[];
  @Input() nzCheckable = false;
  @Input() nzAutoExpandParent: boolean | number = false;
  @Input() nzAllowParentLinkage = false;
  @Input() nzShowLine = false;
  @Input() nzOptions: any;
  @Input() nzShiftSelectedMulti = true;
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
      if (node.data.disableCheckbox) return ;
      node.data.checked = !node.data.checked;
      node.data.halfChecked = false;
      this.updateCheckState(node, node.data.checked);
      this.fireEvent({ eventName: 'check', node: node, checked: node.data.checked });
  }

  private traverseData(
      nodes: any[],
      callback: (node: any, level: number, parent: any, nodes: any[]) => void
    ): void {
    const traverse = (subTreeNodes: any[], level: number, parent: any) => {
        if (Array.isArray(subTreeNodes)) {
            subTreeNodes = subTreeNodes.filter(item => !!item);
        }
        subTreeNodes.forEach((item, index) => {
            // if (!item.children) item.children = [];
            if (item.children && item.children.length > 0) {
                traverse(item.children, ++level, item);
            }
            callback(
                item,
                level,
                parent,
                subTreeNodes
            );
        });
    };
    traverse(nodes, 0, null);
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
    if(nzAllowParentLinkage){
        parentLoop(node);
    }
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

  private traverseNode(): this {
    // nzAutoExpandParent
    let maxLevel = 0;
    let expand = this.nzAutoExpandParent;
    if (typeof expand === 'number') {
        maxLevel = expand;
        expand = true;
    }
    this.traverseData(this.nzNodes, (node, level, parent, nodes) => {
        // expand
        if (expand && typeof node.isExpanded === 'undefined') {
            node.isExpanded = maxLevel === 0 || level <= maxLevel;
            console.log(node);
        }
        // checked
        if (!parent || node.checked) return;
        const validNodes = nodes.filter(w => !w.disableCheckbox);
        const checkCount = validNodes.filter(w => w.checked).length;
        if (checkCount === 0) return;

        if (checkCount === validNodes.length)
            parent.checked = true;
        else
            parent.halfChecked = true;
    });
    return this;
  }

  ngOnInit() {
    console.log('this._options', this._options);
  }

  ngOnChanges(changes: { [P in keyof this]?: SimpleChange } & SimpleChanges): void {
    const actionMapping: IActionMapping = { };
    if (this.nzShiftSelectedMulti) {
        actionMapping.mouse = {
            click: (tree, node, $event: any) => {
              $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
                : TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
            }
        };
    }
    this._options = Object.assign({
      actionMapping,
      animateExpand: true
    }, this.nzOptions);
    if (changes.nzNodes) {
        this.traverseNode();
    }
  }
}
