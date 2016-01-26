(function () {
	'use strict';

	function rightmostPolicy(node) {
		return node.right;
	}

	function createInsertPolicy(data) {
		return (node) => {
			return data <= node.data ? node.left : node.right;
		};
	}

	function createSearchPolicy(data) {
		return (node) => {
			return node.data === data ? null : (data < node.data ? node.left : node.right);
		};
	}

	function createDoesContainReducer(data) {
		return (previousValue, node) => {
			return previousValue || (node && node.data === data);
		};
	}

	function parentReduce(previousValue, node) {
		return {
			parent: previousValue.node,
			node: node,
		};
	}

	function nodeReduce(previousValue, node) {
		return node;
	}

	function traverse(node, policy, reduce, initialValue) {
		const nextNode = policy(node);
		const value = reduce(initialValue, node);
		return nextNode ? traverse(nextNode, policy, reduce, value) : value;
	}

	function rehang(parent, child, newChild) {
		if (parent.left === child) {
			parent.left = newChild;
		} else {
			parent.right = newChild;
		}
	}

	const nodes = Symbol();

	class BinaryTree {
		constructor() {
			this.root = null;
			this[nodes] = 0;
		}

		insert(data) {
			this[nodes]++;

			if (!this.root) {
				this.root = new Node(data);
				return;
			}
			
			const policy = createInsertPolicy(data);
			const node = traverse(this.root, policy, nodeReduce, null);

			if (data <= node.data) {
				node.left = new Node(data);
			} else {
				node.right = new Node(data);
			}
		}

		contains(data) {
			const policy = createSearchPolicy(data);
			const reduce = createDoesContainReducer(data);
			return traverse(this.root, policy, reduce, false);
		}

		remove(data) {
			const policy = createSearchPolicy(data);
			//const {parent, node} = traverse(this.root, policy, parentReduce, { parent: null, node: null });
			const res = traverse(this.root, policy, parentReduce, { parent: null, node: null });
			const parent = res.parent;
			const node = res.node;

			if (!node || node.data !== data) {
				return;
			}
			
			if (!parent) {
				this.root = null;
			} else if (!node.left || !node.right) {
				rehang(parent, node, node.left || node.right);
			} else {
				const replacement = traverse(node.left, rightmostPolicy, parentReduce, { parent: null, node });
				rehang(parent, node, replacement.node);
				rehang(replacement.parent, replacement.node, replacement.node.left);
				replacement.node.left = node.left;
				replacement.node.right = node.right;
			}

			this[nodes]--;
		}

		size() {
			return this[nodes];
		}

		isEmpty() {
			return this.root === null;
		}
	}

	window.BinaryTree = BinaryTree;
})();
