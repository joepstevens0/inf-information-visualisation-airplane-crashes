import PlaneCrash from "../../types/planecrash";

export type SunburstElement = {
    name: string;
    parent: SunburstElement | null,
    children: SunburstElement[];
    value: number;
    crash: PlaneCrash | null;
};

// get the maximum depth of a tree
export function treeDepth(el: SunburstElement): number {
    if (el.children === undefined || el.children.length <= 0) {
        return 0;
    }
    let max_depth = 0;
    el.children.forEach((child: SunburstElement) => {
        max_depth = Math.max(max_depth, treeDepth(child));
    });
    return max_depth + 1;
}

/**
 * create a tree of AC types from planecrash data
 * @returns
 */
export function createTree(crashdata: PlaneCrash[]): SunburstElement {
    let root: SunburstElement = {
        name: "AC types",
        children: [],
        value: 0,
        crash: null,
        parent: null
    };

    // add all strings to root in their own node
    crashdata.forEach((crash: PlaneCrash, index: number) => {
        let child = crashToTree(crash);

        root.children.push(child);

        root.value += child.value;
    });

    // merge children with the same names in every level of the tree
    root = mergeTree(root);
    root = removeAloneElements(root);
    root = setElementParents(root);
    return root;
}

// sets the parent parameter for the elements
function setElementParents(tree: SunburstElement): SunburstElement{
    for (let i = 0; i < tree.children.length;++i){
        tree.children[i].parent = tree;
        tree.children[i] = setElementParents(tree.children[i]);
    }
    return tree;
}

// merges parent and child if only 1 child
function removeAloneElements(tree: SunburstElement): SunburstElement {
    while (
        tree.children.length === 1 &&
        tree.children[0].crash === null // do not merge crashes
    ) {
        tree.name += " " + tree.children[0].name;
        tree.children = tree.children[0].children;
    }

    for (let i = 0; i < tree.children.length; ++i) {
        tree.children[i] = removeAloneElements(tree.children[i]);
    }

    return tree;
}

/**
 * merges every siblings in the tree with the same name
 * @param tree: the tree merging, siblings need to be sorted by name
 * @returns a tree with nog siblings with the same name
 */
function mergeTree(tree: SunburstElement): SunburstElement {
    if (tree.children.length <= 0) return tree;

    const newTree: SunburstElement = {
        name: tree.name,
        children: [],
        value: tree.value,
        crash: null,
        parent: tree.parent
    };

    for (let i = 0; i < tree.children.length; ++i) {
        // for every child, check if a child with same name is already added
        let current = tree.children[i];
        let other_index = indexOfChild(newTree, current.name);
        if (
            other_index >= 0 &&
            !current.crash // do not merge crashes
        ) {
            // merge elements
            newTree.children[other_index] = mergeElements(
                newTree.children[other_index],
                current
            );
        } else {
            // push the child to the tree
            newTree.children.push(current);
        }
    }

    // merge all the children of the tree
    for (let i = 0; i < newTree.children.length; ++i) {
        newTree.children[i] = mergeTree(newTree.children[i]);
    }

    return newTree;
}

// Merge two elements
function mergeElements(
    el1: SunburstElement,
    el2: SunburstElement
): SunburstElement {
    // add the children of child to the duplicate element
    el1.children.push(...(el2.children as SunburstElement[]));
    el1.value += el2.value;
    return el1;
}

function indexOfChild(parent: SunburstElement, name: string): number {
    for (let i = 0; i < parent.children.length; ++i) {
        if (parent.children[i].name === name) return i;
    }
    return -1;
}

// create a simple tree from a planecrash, splitting AC type nodes on spaces
function crashToTree(crash: PlaneCrash): SunburstElement {
    const split = crash.actype.trim().split(" ");
    return listToTree(split, 1, [
        {
            name: crash.time ? crash.time.getFullYear().toString() : "?",
            children: [],
            value: 1,
            crash: crash,
            parent: null
        },
    ]);
}

// create a simple tree from a list of strings
function listToTree(
    l: string[],
    value: number,
    children: SunburstElement[] = []
): SunburstElement {
    if (l.length <= 0) {
        return { name: "", children: children, value: value, crash: null, parent: null };
    }
    if (l.length === 1) {
        return { name: l[0], children: children, value: value, crash: null, parent: null };
    }

    const prefix = l[l.length - 1];
    l.pop();
    return listToTree(l, value, [
        { name: prefix, children: children, value: value, crash: null, parent: null },
    ]);
}
