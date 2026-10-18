/**
 * AVLTree.js - Complete AVL Tree Data Structure with Step-by-Step Visualization Tracking
 * 
 * Supports:
 * - AVL Node with unique ID, value, height, left, right, and computed balance factor.
 * - Insertion & Deletion with rebalancing.
 * - Rotations: LL (Right Rotate), RR (Left Rotate), LR (Left-Right Double Rotate), RL (Right-Left Double Rotate).
 * - Step-by-step recording with tree snapshots for playback/scrubbing.
 * - In-order, Pre-order, Post-order, Level-order traversals.
 * - Tree metrics (height, count, balance status).
 * - 2D tree layout coordinate generation for SVG rendering.
 */

export class AVLNode {
  constructor(value, id = null) {
    this.value = value;
    this.height = 1; // Leaf node height is 1
    this.left = null;
    this.right = null;
    // Unique ID preserves node identity across animations/renders
    this.id = id || `node-${value}-${Math.random().toString(36).substring(2, 9)}`;
  }

  get balanceFactor() {
    const leftHeight = this.left ? this.left.height : 0;
    const rightHeight = this.right ? this.right.height : 0;
    return leftHeight - rightHeight;
  }
}

export class AVLTree {
  constructor() {
    this.root = null;
    this.steps = []; // Stores step-by-step logs for visualization
  }

  // Helper: Height of a node (0 if null)
  getHeight(node) {
    return node ? node.height : 0;
  }

  // Helper: Recalculate node height
  updateHeight(node) {
    if (!node) return 0;
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    return node.height;
  }

  // Helper: Balance Factor = height(left) - height(right)
  getBalanceFactor(node) {
    if (!node) return 0;
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  // Creates a deep snapshot of the tree for playback
  cloneTree(node) {
    if (!node) return null;
    const copy = new AVLNode(node.value, node.id);
    copy.height = node.height;
    copy.left = this.cloneTree(node.left);
    copy.right = this.cloneTree(node.right);
    return copy;
  }

  // Record a playback step
  logStep({
    type,
    description,
    activeNodeId = null,
    highlightedNodeIds = [],
    rotationType = null,
    bfInfo = null,
    operation = null,
    currentRoot = null
  }) {
    this.steps.push({
      stepNumber: this.steps.length + 1,
      type,
      description,
      activeNodeId,
      highlightedNodeIds,
      rotationType,
      bfInfo,
      operation,
      treeSnapshot: this.cloneTree(currentRoot || this.root),
      timestamp: Date.now()
    });
  }

  /* ---------------- ROTATIONS ---------------- */

  /**
   * Right Rotation (LL Rotation)
   * Used when Left subtree is heavier and new node was inserted in Left subtree of Left child.
   *        y                               x
   *       / \     Right Rotate (y)        / \
   *      x   T3   ----------------->     T1   y
   *     / \                                  / \
   *    T1  T2                               T2  T3
   */
  rotateRight(y, contextMessage = "") {
    const x = y.left;
    const T2 = x.right;

    this.logStep({
      type: "ROTATION_PREP",
      description: contextMessage || `Preparing Right Rotation on Node ${y.value}. Node ${x.value} will become the new local root.`,
      activeNodeId: y.id,
      highlightedNodeIds: [y.id, x.id],
      rotationType: "LL",
      currentRoot: this.root
    });

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    this.updateHeight(y);
    this.updateHeight(x);

    return x; // New root of subtree
  }

  /**
   * Left Rotation (RR Rotation)
   * Used when Right subtree is heavier and new node was inserted in Right subtree of Right child.
   *      y                               x
   *     / \      Left Rotate (y)        / \
   *    T1  x     ----------------->    y   T3
   *       / \                         / \
   *      T2  T3                      T1  T2
   */
  rotateLeft(y, contextMessage = "") {
    const x = y.right;
    const T2 = x.left;

    this.logStep({
      type: "ROTATION_PREP",
      description: contextMessage || `Preparing Left Rotation on Node ${y.value}. Node ${x.value} will become the new local root.`,
      activeNodeId: y.id,
      highlightedNodeIds: [y.id, x.id],
      rotationType: "RR",
      currentRoot: this.root
    });

    // Perform rotation
    x.left = y;
    y.right = T2;

    // Update heights
    this.updateHeight(y);
    this.updateHeight(x);

    return x; // New root of subtree
  }

  /* ---------------- INSERTION ---------------- */

  /**
   * Insert value into AVL tree with step-by-step recording
   * @param {number} value
   * @returns {Object} { root, steps, rotations, alreadyExisted }
   */
  insert(value) {
    this.steps = [];
    const numValue = Number(value);

    if (isNaN(numValue)) {
      return { root: this.root, steps: [], error: "Invalid number" };
    }

    this.logStep({
      type: "START",
      description: `Starting insertion of value ${numValue}.`,
      operation: "INSERT",
      currentRoot: this.root
    });

    let rotationCount = { LL: 0, RR: 0, LR: 0, RL: 0 };
    let alreadyExists = false;

    const insertHelper = (node) => {
      // 1. Standard BST insertion
      if (!node) {
        const newNode = new AVLNode(numValue);
        this.logStep({
          type: "INSERT_LEAF",
          description: `Created new leaf node with value ${numValue}.`,
          activeNodeId: newNode.id,
          highlightedNodeIds: [newNode.id],
          operation: "INSERT",
          currentRoot: this.root || newNode
        });
        return newNode;
      }

      this.logStep({
        type: "COMPARE",
        description: `Comparing insert value ${numValue} with current node ${node.value}.`,
        activeNodeId: node.id,
        highlightedNodeIds: [node.id],
        operation: "INSERT",
        currentRoot: this.root
      });

      if (numValue < node.value) {
        this.logStep({
          type: "TRAVERSE",
          description: `${numValue} < ${node.value}: Traversing to LEFT child of ${node.value}.`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id],
          operation: "INSERT",
          currentRoot: this.root
        });
        node.left = insertHelper(node.left);
      } else if (numValue > node.value) {
        this.logStep({
          type: "TRAVERSE",
          description: `${numValue} > ${node.value}: Traversing to RIGHT child of ${node.value}.`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id],
          operation: "INSERT",
          currentRoot: this.root
        });
        node.right = insertHelper(node.right);
      } else {
        // Duplicate values not inserted
        alreadyExists = true;
        this.logStep({
          type: "DUPLICATE",
          description: `Value ${numValue} already exists in the tree. No duplicates allowed in AVL tree.`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id],
          operation: "INSERT",
          currentRoot: this.root
        });
        return node;
      }

      // 2. Update height of ancestor node
      this.updateHeight(node);
      const balance = this.getBalanceFactor(node);

      this.logStep({
        type: "CHECK_BALANCE",
        description: `Backtracking to Node ${node.value}: Height = ${node.height}, Balance Factor = ${balance >= 0 ? "+" + balance : balance}.`,
        activeNodeId: node.id,
        highlightedNodeIds: [node.id],
        bfInfo: { nodeValue: node.value, bf: balance, height: node.height },
        operation: "INSERT",
        currentRoot: this.root
      });

      // 3. Balance Check & Rotations

      // Case 1: Left-Left (LL) -> Single Right Rotation
      if (balance > 1 && numValue < node.left.value) {
        rotationCount.LL++;
        this.logStep({
          type: "ROTATION_LL",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} > 1) and insert value ${numValue} is in LEFT subtree of LEFT child ${node.left.value}. Performing Right Rotation (LL Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.left.id],
          rotationType: "LL",
          operation: "INSERT",
          currentRoot: this.root
        });
        const newSubRoot = this.rotateRight(node);
        this.logStep({
          type: "ROTATION_DONE",
          description: `LL Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "LL",
          operation: "INSERT",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      // Case 2: Right-Right (RR) -> Single Left Rotation
      if (balance < -1 && numValue > node.right.value) {
        rotationCount.RR++;
        this.logStep({
          type: "ROTATION_RR",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} < -1) and insert value ${numValue} is in RIGHT subtree of RIGHT child ${node.right.value}. Performing Left Rotation (RR Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.right.id],
          rotationType: "RR",
          operation: "INSERT",
          currentRoot: this.root
        });
        const newSubRoot = this.rotateLeft(node);
        this.logStep({
          type: "ROTATION_DONE",
          description: `RR Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "RR",
          operation: "INSERT",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      // Case 3: Left-Right (LR) -> Left rotate left child, then Right rotate node
      if (balance > 1 && numValue > node.left.value) {
        rotationCount.LR++;
        this.logStep({
          type: "ROTATION_LR",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} > 1) and insert value ${numValue} is in RIGHT subtree of LEFT child ${node.left.value}. Performing Left-Right Rotation (LR Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.left.id],
          rotationType: "LR",
          operation: "INSERT",
          currentRoot: this.root
        });
        // Step 1: Left rotate left child
        node.left = this.rotateLeft(node.left, `LR Step 1: Left rotating left child ${node.left.value} to align into LL shape.`);
        // Step 2: Right rotate current node
        const newSubRoot = this.rotateRight(node, `LR Step 2: Right rotating node ${node.value}.`);
        this.logStep({
          type: "ROTATION_DONE",
          description: `LR Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "LR",
          operation: "INSERT",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      // Case 4: Right-Left (RL) -> Right rotate right child, then Left rotate node
      if (balance < -1 && numValue < node.right.value) {
        rotationCount.RL++;
        this.logStep({
          type: "ROTATION_RL",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} < -1) and insert value ${numValue} is in LEFT subtree of RIGHT child ${node.right.value}. Performing Right-Left Rotation (RL Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.right.id],
          rotationType: "RL",
          operation: "INSERT",
          currentRoot: this.root
        });
        // Step 1: Right rotate right child
        node.right = this.rotateRight(node.right, `RL Step 1: Right rotating right child ${node.right.value} to align into RR shape.`);
        // Step 2: Left rotate current node
        const newSubRoot = this.rotateLeft(node, `RL Step 2: Left rotating node ${node.value}.`);
        this.logStep({
          type: "ROTATION_DONE",
          description: `RL Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "RL",
          operation: "INSERT",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      return node;
    };

    this.root = insertHelper(this.root);

    this.logStep({
      type: "COMPLETE",
      description: alreadyExists
        ? `Insertion finished. Value ${numValue} already existed.`
        : `Successfully inserted ${numValue}. Tree is now height-balanced.`,
      activeNodeId: null,
      highlightedNodeIds: [],
      operation: "INSERT",
      currentRoot: this.root
    });

    return {
      root: this.root,
      steps: this.steps,
      rotations: rotationCount,
      alreadyExists
    };
  }

  /* ---------------- DELETION ---------------- */

  // Helper: Find node with minimum value (in-order successor)
  getMinValueNode(node) {
    let current = node;
    while (current && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  /**
   * Delete value from AVL tree with step-by-step recording
   * @param {number} value
   * @returns {Object} { root, steps, rotations, found }
   */
  delete(value) {
    this.steps = [];
    const numValue = Number(value);

    if (isNaN(numValue)) {
      return { root: this.root, steps: [], error: "Invalid number" };
    }

    this.logStep({
      type: "START",
      description: `Starting deletion of value ${numValue}.`,
      operation: "DELETE",
      currentRoot: this.root
    });

    let rotationCount = { LL: 0, RR: 0, LR: 0, RL: 0 };
    let found = false;

    const deleteHelper = (node, key) => {
      // 1. Standard BST Deletion
      if (!node) {
        this.logStep({
          type: "NOT_FOUND",
          description: `Value ${key} not found in the AVL tree.`,
          operation: "DELETE",
          currentRoot: this.root
        });
        return null;
      }

      this.logStep({
        type: "COMPARE",
        description: `Searching for ${key}: Comparing with Node ${node.value}.`,
        activeNodeId: node.id,
        highlightedNodeIds: [node.id],
        operation: "DELETE",
        currentRoot: this.root
      });

      if (key < node.value) {
        node.left = deleteHelper(node.left, key);
      } else if (key > node.value) {
        node.right = deleteHelper(node.right, key);
      } else {
        // Node found!
        found = true;
        this.logStep({
          type: "NODE_FOUND",
          description: `Found Node ${node.value} to delete. Evaluating deletion cases.`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id],
          operation: "DELETE",
          currentRoot: this.root
        });

        // Case 1 & 2: Node with 0 or 1 child
        if (!node.left || !node.right) {
          const temp = node.left ? node.left : node.right;
          if (!temp) {
            // No children (Leaf node)
            this.logStep({
              type: "DELETE_LEAF",
              description: `Node ${node.value} is a leaf node. Removing it directly.`,
              activeNodeId: node.id,
              highlightedNodeIds: [node.id],
              operation: "DELETE",
              currentRoot: this.root
            });
            node = null;
          } else {
            // One child
            this.logStep({
              type: "DELETE_ONE_CHILD",
              description: `Node ${node.value} has 1 child (${temp.value}). Replacing node with its child.`,
              activeNodeId: node.id,
              highlightedNodeIds: [node.id, temp.id],
              operation: "DELETE",
              currentRoot: this.root
            });
            node = temp;
          }
        } else {
          // Case 3: Node with two children
          // Find in-order successor (smallest in right subtree)
          const successor = this.getMinValueNode(node.right);
          this.logStep({
            type: "FIND_SUCCESSOR",
            description: `Node ${node.value} has two children. Finding in-order successor (minimum in right subtree): Found ${successor.value}.`,
            activeNodeId: successor.id,
            highlightedNodeIds: [node.id, successor.id],
            operation: "DELETE",
            currentRoot: this.root
          });

          // Copy successor's value to current node
          node.value = successor.value;

          this.logStep({
            type: "SWAP_SUCCESSOR",
            description: `Replaced target node's value with successor value ${successor.value}. Now recursively deleting successor from right subtree.`,
            activeNodeId: node.id,
            highlightedNodeIds: [node.id],
            operation: "DELETE",
            currentRoot: this.root
          });

          // Delete the in-order successor
          node.right = deleteHelper(node.right, successor.value);
        }
      }

      // If tree had only one node or became empty
      if (!node) return null;

      // 2. Update height
      this.updateHeight(node);
      const balance = this.getBalanceFactor(node);

      this.logStep({
        type: "CHECK_BALANCE",
        description: `Backtracking to Node ${node.value} after deletion: Height = ${node.height}, Balance Factor = ${balance >= 0 ? "+" + balance : balance}.`,
        activeNodeId: node.id,
        highlightedNodeIds: [node.id],
        bfInfo: { nodeValue: node.value, bf: balance, height: node.height },
        operation: "DELETE",
        currentRoot: this.root
      });

      // 3. Balance Check & Rotations for Deletion

      // LL Case: balance > 1 and left child's BF >= 0
      if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
        rotationCount.LL++;
        this.logStep({
          type: "ROTATION_LL",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} > 1, Left child BF = ${this.getBalanceFactor(node.left)} >= 0). Performing Right Rotation (LL Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.left.id],
          rotationType: "LL",
          operation: "DELETE",
          currentRoot: this.root
        });
        const newSubRoot = this.rotateRight(node);
        this.logStep({
          type: "ROTATION_DONE",
          description: `LL Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "LL",
          operation: "DELETE",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      // LR Case: balance > 1 and left child's BF < 0
      if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
        rotationCount.LR++;
        this.logStep({
          type: "ROTATION_LR",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} > 1, Left child BF = ${this.getBalanceFactor(node.left)} < 0). Performing Left-Right Rotation (LR Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.left.id],
          rotationType: "LR",
          operation: "DELETE",
          currentRoot: this.root
        });
        node.left = this.rotateLeft(node.left, `LR Step 1: Left rotating left child ${node.left.value}.`);
        const newSubRoot = this.rotateRight(node, `LR Step 2: Right rotating node ${node.value}.`);
        this.logStep({
          type: "ROTATION_DONE",
          description: `LR Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "LR",
          operation: "DELETE",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      // RR Case: balance < -1 and right child's BF <= 0
      if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
        rotationCount.RR++;
        this.logStep({
          type: "ROTATION_RR",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} < -1, Right child BF = ${this.getBalanceFactor(node.right)} <= 0). Performing Left Rotation (RR Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.right.id],
          rotationType: "RR",
          operation: "DELETE",
          currentRoot: this.root
        });
        const newSubRoot = this.rotateLeft(node);
        this.logStep({
          type: "ROTATION_DONE",
          description: `RR Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "RR",
          operation: "DELETE",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      // RL Case: balance < -1 and right child's BF > 0
      if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
        rotationCount.RL++;
        this.logStep({
          type: "ROTATION_RL",
          description: `IMBALANCE DETECTED at Node ${node.value} (BF = ${balance} < -1, Right child BF = ${this.getBalanceFactor(node.right)} > 0). Performing Right-Left Rotation (RL Case).`,
          activeNodeId: node.id,
          highlightedNodeIds: [node.id, node.right.id],
          rotationType: "RL",
          operation: "DELETE",
          currentRoot: this.root
        });
        node.right = this.rotateRight(node.right, `RL Step 1: Right rotating right child ${node.right.value}.`);
        const newSubRoot = this.rotateLeft(node, `RL Step 2: Left rotating node ${node.value}.`);
        this.logStep({
          type: "ROTATION_DONE",
          description: `RL Rotation complete: Node ${newSubRoot.value} is now root of this subtree.`,
          activeNodeId: newSubRoot.id,
          highlightedNodeIds: [newSubRoot.id],
          rotationType: "RL",
          operation: "DELETE",
          currentRoot: this.root === node ? newSubRoot : this.root
        });
        return newSubRoot;
      }

      return node;
    };

    this.root = deleteHelper(this.root, numValue);

    this.logStep({
      type: "COMPLETE",
      description: found
        ? `Deletion finished. Node ${numValue} successfully removed and tree rebalanced.`
        : `Deletion completed. Node ${numValue} was not present in tree.`,
      activeNodeId: null,
      highlightedNodeIds: [],
      operation: "DELETE",
      currentRoot: this.root
    });

    return {
      root: this.root,
      steps: this.steps,
      rotations: rotationCount,
      found
    };
  }

  /* ---------------- SEARCH ---------------- */

  search(value) {
    this.steps = [];
    const numValue = Number(value);
    const searchPath = [];

    this.logStep({
      type: "START",
      description: `Starting BST search for value ${numValue}.`,
      operation: "SEARCH",
      currentRoot: this.root
    });

    let current = this.root;
    let found = false;

    while (current) {
      searchPath.push(current.id);
      this.logStep({
        type: "COMPARE",
        description: `Inspecting Node ${current.value}: Comparing with search key ${numValue}.`,
        activeNodeId: current.id,
        highlightedNodeIds: [...searchPath],
        operation: "SEARCH",
        currentRoot: this.root
      });

      if (numValue === current.value) {
        found = true;
        this.logStep({
          type: "NODE_FOUND",
          description: `Key ${numValue} FOUND at Node ${current.value}! Height = ${current.height}, BF = ${this.getBalanceFactor(current)}.`,
          activeNodeId: current.id,
          highlightedNodeIds: [...searchPath],
          operation: "SEARCH",
          currentRoot: this.root
        });
        break;
      } else if (numValue < current.value) {
        this.logStep({
          type: "TRAVERSE",
          description: `${numValue} < ${current.value}: Moving to LEFT child.`,
          activeNodeId: current.id,
          highlightedNodeIds: [...searchPath],
          operation: "SEARCH",
          currentRoot: this.root
        });
        current = current.left;
      } else {
        this.logStep({
          type: "TRAVERSE",
          description: `${numValue} > ${current.value}: Moving to RIGHT child.`,
          activeNodeId: current.id,
          highlightedNodeIds: [...searchPath],
          operation: "SEARCH",
          currentRoot: this.root
        });
        current = current.right;
      }
    }

    if (!found) {
      this.logStep({
        type: "NOT_FOUND",
        description: `Key ${numValue} was NOT found in the AVL tree.`,
        activeNodeId: null,
        highlightedNodeIds: [...searchPath],
        operation: "SEARCH",
        currentRoot: this.root
      });
    }

    return {
      found,
      steps: this.steps,
      path: searchPath
    };
  }

  /* ---------------- TRAVERSALS ---------------- */

  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }

  preOrder(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
    return result;
  }

  postOrder(node = this.root, result = []) {
    if (node) {
      this.postOrder(node.left, result);
      this.postOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  levelOrder(node = this.root) {
    if (!node) return [];
    const result = [];
    const queue = [node];
    while (queue.length > 0) {
      const curr = queue.shift();
      result.push(curr.value);
      if (curr.left) queue.push(curr.left);
      if (curr.right) queue.push(curr.right);
    }
    return result;
  }

  /* ---------------- METRICS & CHECKS ---------------- */

  getNodeCount(node = this.root) {
    if (!node) return 0;
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }

  isBalanced(node = this.root) {
    if (!node) return true;
    const bf = this.getBalanceFactor(node);
    if (Math.abs(bf) > 1) return false;
    return this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  clear() {
    this.root = null;
    this.steps = [];
  }

  /* ---------------- 2D TREE LAYOUT GENERATOR ---------------- */

  /**
   * Generates clean (x, y) 2D coordinates for rendering nodes & edges in SVG.
   * Uses an intelligent subtree bounding layout to guarantee non-overlapping nodes
   * regardless of tree depth or skew.
   */
  calculateLayout(canvasWidth = 900, canvasHeight = 550) {
    if (!this.root) return { nodes: [], edges: [], bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 } };

    const nodeRadius = 26;
    const levelHeight = 85;

    // First pass: In-order traversal assigns horizontal ranking (1, 2, 3...)
    // This mathematically guarantees no horizontal overlaps!
    let horizontalRank = 0;
    const ranks = new Map();

    const assignRanks = (node, depth = 0) => {
      if (!node) return;
      assignRanks(node.left, depth + 1);
      horizontalRank += 1;
      ranks.set(node.id, { rank: horizontalRank, depth });
      assignRanks(node.right, depth + 1);
    };

    assignRanks(this.root, 0);

    const totalNodes = horizontalRank;
    // Calculate total layout width based on node spacing
    const spacing = Math.max(55, Math.min(100, (canvasWidth - 120) / Math.max(1, totalNodes)));
    const startX = Math.max(50, (canvasWidth - totalNodes * spacing) / 2);

    const nodes = [];
    const edges = [];
    const positions = new Map();

    // Second pass: Calculate exact (x, y) coordinates
    const buildLayout = (node) => {
      if (!node) return;

      const { rank, depth } = ranks.get(node.id);
      const x = startX + (rank - 0.5) * spacing;
      const y = 60 + depth * levelHeight;

      positions.set(node.id, { x, y });

      const nodeData = {
        id: node.id,
        value: node.value,
        height: node.height,
        balanceFactor: this.getBalanceFactor(node),
        x,
        y,
        radius: nodeRadius,
        hasLeft: !!node.left,
        hasRight: !!node.right
      };
      nodes.push(nodeData);

      if (node.left) {
        buildLayout(node.left);
        const childPos = positions.get(node.left.id);
        edges.push({
          id: `edge-${node.id}-${node.left.id}`,
          fromId: node.id,
          toId: node.left.id,
          from: { x, y },
          to: childPos,
          side: "left"
        });
      }

      if (node.right) {
        buildLayout(node.right);
        const childPos = positions.get(node.right.id);
        edges.push({
          id: `edge-${node.id}-${node.right.id}`,
          fromId: node.id,
          toId: node.right.id,
          from: { x, y },
          to: childPos,
          side: "right"
        });
      }
    };

    buildLayout(this.root);

    return {
      nodes,
      edges,
      treeHeight: this.getHeight(this.root),
      totalNodes
    };
  }
}
