'use strict';
/*
function split(node, key) {
	if (!node) {
		return [null, null];
	}

	if (node.data <= key) {
		// const [left, right] = split(node.right, key); :c
		let res = split(node.right, key);
		res[0] = new Node(node.data, node.left, res[0]);
		return res;
		//return [new Node(node.data, node.left, left), right];
	} else {
		//const [left, right] = split(node.left, key);
		//return [left, new Node(node.data, right, node.right)];
		let res = split(node.left, key);
		res[1] = new Node(node.data, res[1], node.right);
		return res;
	}
}

function merge(left, right) {
	if (!left || !right) {
		return left || right;
	}

	return new Node(left.data, left.left, merge(left.right, right));
}
*/

function rightmostPolicy(node) {
	return node.right;
}

function parentReduce(previousValue, node) {
	return {
		parent: previousValue.node,
		node: node,
	};
}

function traverse(node, policy, reduce, initialValue) {
	const nextNode = policy(node);
	const nextValue = reduce(initialValue, nextNode);
	return nextNode ? traverse(nextNode, policy, reduce, nextValue) : initialValue;
}

function rehang(parent, child, newChild) {
	if (parent.left === child) {
		parent.left = newChild;
	} else {
		parent.right = newChild;
	}
}

function rightmost(node) {
	return !node.right ? node : rightmost(node.right);
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

		let node = this.root;

		for (;;) {
			if (data <= node.data) {
				if (node.left) {
					node = node.left;
				} else {
					node.left = new Node(data);
					break;
				}
			} else {
				if (node.right) {
					node = node.right;
				} else {
					node.right = new Node(data);
					break;
				}
			}
		}
		/*const res = split(this.root, data);
		this.root = merge(merge(res[0], new Node(data)), res[1]);

		console.log(JSON.stringify(this.root));*/
	}

	contains(data) {
		let node = this.root;

		while (node && node.data !== data) {
			node = data < node.data ? node.left : node.right;
		}

		return !!node;
	}

	remove(data) {
		let node = this.root;
		let parent = null;

		while (node && node.data !== data) {
			parent = node;
			node = data < node.data ? node.left : node.right;
		}

		if (!node) {
			return;
		}
		
		if (!parent) {
			this.root = null;
		} else if (!node.left || !node.right) {
			rehang(parent, node, node.left || node.right);
		} else {
			const replacement = traverse(node.left, rightmostPolicy, parentReduce, { parent: node, node: node.left });
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
