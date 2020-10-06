/**
 * Tree Node class
 *
 * @TODO: should it have an index for easier handling?
 *
 * @export
 * @class BbTreeNode
 */
export class BbTreeNode {
    /**
     * parent tree node
     */
    private _parent : BbTreeNode | null;
    parent() : BbTreeNode | null {
        return this._parent;
    }
    setParent(v : BbTreeNode | null): void {
        this._parent = v;
    }


    /**
     * children nodes
     * @readonly
     */
    private _children : BbTreeNode[];
    children(): BbTreeNode[] {
        return this._children;
    }


    /**
     * Creates an instance of BbTreeNode.
     * @param [parent=null] the parent element
     */
    constructor(parent: BbTreeNode | null = null) {
        this._parent = parent;
        this._children = [];
        parent?.appendChild(this);
    }

    /**
     * Convert the object to a human understandable string
     *
     * Use this method as a placeholder for text in tree views
     */
    public get toString(): string {
        return 'tree-node';
    }

    /**
     * Insert child 'child' at position 'index'.
     *
     * When looping, don't forget to update the index
     * @param index The future index of the new child
     * @param child the child to add
     */
    insertChildren(index: number, ...children: BbTreeNode[]): void {
        this.children().splice(index, 0, ...children);
    }

    /**
     * True if the element has no parent. False otherwise.
     */
    isRoot(): boolean {
        return this.parent() ? false : true;
    }

    /**
     * True if the element has no children. false otherwise.
     */
    isLeaf(): boolean {
        return this.children().length ? false : true;
    }

    /**
     * True if the element has no children. false otherwise.
     */
    isBranch(): boolean {
        return !(this.isRoot() || this.isLeaf());
    }

    /**
     * Appends children to the {@link children} list
     * @param children The children to append
     * @return Returns itself for chaining
     */
    appendChildren(...children: BbTreeNode[]): BbTreeNode {
        children.forEach((child) => child.setParent(this) );
        this.children().push(...children);
        return this;
    }

    /**
     * Prepends children to the {@link children} list
     * @param children The children to prepend
     * @return Returns itself for chaining
     */
    prependChildren(...children: BbTreeNode[]): BbTreeNode {
        children.forEach((child) => child.setParent(this));
        this.children().unshift(...children);
        return this;
    }

    /**
     * Prepends a child to the {@link children} list
     *
     * Convenience function similar to {@link prependChildren}, but with only one child
     *
     * @param child The child to prepend
     * @return Returns itself for chaining
     */
    prependChild(child: BbTreeNode): BbTreeNode {
        child.setParent(this);
        this.children().unshift(child);
        return this;
    }

    /**
     * Appends child to {@link children} list
     *
     * Convenience function similar to {@link appendChildren}, but with only one child
     *
     * @param child The child to append
     * @return Returns itself for chaining
     */
    appendChild(child: BbTreeNode): BbTreeNode {
        child.setParent(this);

        this.children().push(child);
        return this;
    }

    /**
     * Drop the tree node from the tree.
     * The parent has this node removed from its children, and this element loses its parent
     *
     * @return Returns itself for chaining
     */
    drop(): BbTreeNode {
        // 1) remove this item from the parent's children
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1);

        // 2) remove this item's parent
        this.setParent(null);
        return this;
    }

    /**
     * Convert the tree to a string of this form:
     *
     * ```
     * tree
     *   ├branch
     *   │ ├branch
     *   │ │ └leaf
     *   │ ├branch
     *   │ │ └leaf
     *   │ └branch
     *   │   └leaf
     *   ├branch
     *   │ └branch
     *   │   └leaf
     *   └branch
     *     ├branch
     *     │ └leaf
     *     └branch
     *       └leaf
     * ```
     *
     * The text used to display is contained in the {@link toString} property.
     * You should override to string in your subclass for an appropriate meaning.
     *
     * @see {@link toString}
     *
     * @static
     * @param node The node that will be root of this tree
     * @param [level=0] The start level
     * @param [endedLevels=[]] The levels that are ended.
     * @param [last=true] Whether this node is the last in his parent
     * @param [root=true] Whether this node is the root
     * @return {string} The result string
     */
    static treeToString(node: BbTreeNode, level: number = 0, endedLevels: number[] = [], last = true, root = true): string {
        let result = '';
        for (let i = 0; i < level; i++) {
            if (endedLevels.includes(i))
                result += '  '
            else
                result += "│ "
        }
        if (!root){
            if (last)
                result += '└'
            else
                result += '├'
        }

        result += node.toString + "\n";
        const len = node.children().length
        for (let i = 0; i < len; i++) {
            const arr = endedLevels.slice()
            if (last)
                arr.push(level)
            result += BbTreeNode.treeToString(
                node.children()[i],
                level + 1,
                arr,
                (i === (len - 1)),
                false)
        }
        return result;
    }

    /**
     * Move the node and its children to a new parent.
     *
     * note: changing the root item's parent results in undefined behavior
     * @param newParent the future parent of this node.
     * @param start True to add it
     */
    changeParent(newParent: BbTreeNode, index?: number): BbTreeNode {
        // 1) remove this item from the parent's children
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1);

        // 2) change this item's parent
        index ? newParent.insertChildren(index, this): newParent.appendChild(this);
        return this;
    }

    /**
     * Similar to the Array's forEach function, this one iterates through
     *    the children and applies a callback to them.
     *
     * For breadth-first traversal, use {@link traverse}
     *
     * If the order does not matter, walk is probably faster.
     *
     * ```
     *       tree
     *       ----
     *        j         <-- level 0
     *      /   \
     *     f      k     <-- level 1
     *   /   \      \
     *  a     h      z  <-- level 2
     *   \
     *    d             <-- level 3
     * ```
     *
     * Calling walk with only a beforeChildrenCallback
     * is equivalent to a **depth-first** tree traversal.
     * It will give this order of children: `j, f, a, d, h, k, z`.
     * Also called *preorder traversal*.
     *
     * Calling it with only afterChildrenCallback
     * is the opposite of depth-first: it starts from the leaves.
     * It will give this order: `z, k, h, d, a, f, j`.
     *
     * @param node The node from which to start iterating.
     *    The callback will be called on this node and its children
     * @param afterChildrenCallback The callback to apply to every node
     *                                  **after** applying it to its children
     * @param beforeChildrenCallback The callback to apply to every node
     *                                  **before** applying it to its children
     */
    static walk(node: BbTreeNode,
                beforeChildrenCallback?: (node: BbTreeNode) => void,
                afterChildrenCallback?: (node: BbTreeNode) => void): void {
        beforeChildrenCallback?.(node);
        node.children().forEach((child: BbTreeNode) => {
            BbTreeNode.walk(child, beforeChildrenCallback, afterChildrenCallback);
        });
        afterChildrenCallback?.(node);
    }

    /**
     * Transform the tree deeper than node into an array.
     *
     * Note that this function does not keep ordering.
     *
     * Useful for *breadth-first* traversal:
     *
     * ```
     *       tree
     *       ----
     *        j         <-- level 0
     *      /   \
     *     f      k     <-- level 1
     *   /   \      \
     *  a     h      z  <-- level 2
     *   \
     *    d             <-- level 3
     * ```
     *
     * ```
     * console.log(BbTreeNode.flatten(j))
     * // [j, fk, a, h, z, d]
     * ```
     *
     * {@see breadthFirst}
     *
     * If the order does not matter, walk is probably faster.
     *
     */
    static flatten(node: BbTreeNode): BbTreeNode[] {
        return Array.prototype.concat.apply(node.children(),
                                            node.children().map(BbTreeNode.flatten));
    }

    /**
     * Breadth-first tree traversal algorithm: goes level by level.
     *
     * For depth-first traversal, use {@link walk}
     *
     * ```
     *       tree
     *       ----
     *        j         <-- level 0
     *      /   \
     *     f      k     <-- level 1
     *   /   \      \
     *  a     h      z  <-- level 2
     *   \
     *    d             <-- level 3
     * ```
     *
     * ```
     * j.traverse((node: BbTreeNode) => console.log(node))
     * // j, fk, a, h, z, d
     * ```
     *
     * @param callback the callback to apply
     */
    traverse(callback: (node: BbTreeNode) => void) {
        BbTreeNode.flatten(this).forEach((node) => callback(node) )
    }

    /**
     * Move the node deeper in the tree, by replacing the element with its new parent
     *
     * @example
     * -1 -11
     *    -121
     *    -13
     *
     * `child12.moveDeeper(12)`:
     *
     * -1 -11
     *    -12 --121
     *    -13
     * @param newParent the new parent in the hierarchy tree
     * @returns itself for chaining
     */
    moveDeeper(newParent: BbTreeNode): BbTreeNode {
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1, newParent);
        newParent.children().push(this);
        this.setParent(newParent);
        return this;
    }

    /**
     * Replace this node in the tree with a new one.
     *
     * @param node The node that will take this node's place
     * @returns itself for chaining
     *
     * @see {@link moveDeeper}
     */
    replaceWith(node: BbTreeNode): BbTreeNode {
        const p = this.parent();
        if (p)
            p.children().splice(p.children().indexOf(this), 1, node);
        this.setParent(null);
        return this;
    }

    /**
     * index of this child in the parent's children array
     *
     * Note that this function uses `Array.prototype.indexOf`, and **may be slow**.
     *
     * @returns the index
     */
    index(): number | undefined {
        const p = this.parent();
        if (!p)
            return undefined;
        return p.children().indexOf(this);
    }

    /**
     * Returns the next element at the same depth in the tree
     *
     * Try not to use this function to iterate: it will be slow.
     *
     */
    nextSameLevel(): BbTreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        return p.children()[i + 1];
    }

    /**
     * Returns the next element at the same depth in the tree
     *
     * Try not to use this function to iterate: it will be slow.
     *
     */
    prevSameLevel(): BbTreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        return p.children()[i - 1];
    }


    /**
     * Similar to {@link nextInParent}, but if there is
     * no next child a the same depth, on higher levels.
     *
     * Try not to use this function to iterate: it will be slow.
     *
     * @return the next element at the same level,
     *         or *the parent's **next** element*, if not found.
     *         Recursively.
     */
    nextUp(): BbTreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        const nextInParent = p.children()[i + 1];
        if (nextInParent)
            return nextInParent;

        return p.nextUp();
    }

    /**
     * Similar to {@link previousInParent}, but if there is
     * no next child a the same depth, on higher levels.
     *
     * Try not to use this function to iterate: it will be slow.
     *
     * @return the previous element,
     *          or the parent element, if not found.
     */
    previousUp(): BbTreeNode | undefined {
        const p = this.parent();
        if (!p)
            return undefined;

        const i = this.index();
        if (i == undefined)
            return undefined;

        const nextInParent = p.children()[i - 1];
        if (nextInParent)
            return nextInParent;

        return p;
    }


    /**
     * The next element, including children.
     *
     * Try not to use this function to iterate: it will be slow.
     */
    next(): BbTreeNode | undefined {
        if (this.children().length)
            return this.children()[0];

        return this.nextUp();
    }
    /**
     * The previous element, including children
     *
     * Try not to use this function to iterate: it will be slow.
     */
    prev(): BbTreeNode | undefined {
        const prevSameLevel = this.prevSameLevel();
        if (prevSameLevel) {
            const prevCount = prevSameLevel.children().length;
            return prevCount ? prevSameLevel.children()[prevCount - 1] : prevSameLevel;
        }

        return this.previousUp();
    }
}

export type TN = BbTreeNode
