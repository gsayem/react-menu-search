import PropTypes from "prop-types";
import React from "react";
import SearchInput from "./search-input";
import _get from "lodash.get";

export default class MyMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: {
				isSearching: false,
				searchInput: ""
			}
		};
		this.setSearchInput = this.setSearchInput.bind(this);
		this.stopSearching = this.stopSearching.bind(this);
		this.startSearching = this.startSearching.bind(this);
	}


	startSearching() {
		this.setState({
			search: {
				isSearching: true,
				searchInput: ""
			}
		});
	}
	stopSearching() {
		this.setState({
			search: {
				isSearching: false,
				searchInput: ""
			}
		});
	}
	setSearchInput(event) {
		this.setState({
			search: {
				isSearching: true,
				searchInput: event.target.value
			}
		});
	}

	findFiltered(trees, node, key) {
		if (!node.children) {
			const nodeMatchesSearchFilter = this.props.filter(node, this.state.search.searchInput);
			if (nodeMatchesSearchFilter) {
				node.isSearchDisplay = true;
				trees[key] = node;
				return trees;
			}
			else {
				node.isSearchDisplay = false;
				trees[key] = node;
				return trees;
			}
		}
		else {
			const filteredSubFolder = node.children.length ? node.children.reduce((p, c, k) => {
				return this.findFiltered(p, c, k);
			}, []) : [];
			const shouldDisplay = filteredSubFolder.some(child => child.isSearchDisplay);

			if (shouldDisplay) {
				node.isSearchOpen = true;
				node.children = filteredSubFolder;
				node.isSearchDisplay = true;
				node.maxLeaves = (node.maxLeaves) ? node.maxLeaves : this.props.maxLeaves;
				trees[key] = node;
				return trees;
			}
			else {
				node.isSearchOpen = false;
				node.isSearchDisplay = false;
				trees[key] = node;
				return trees;
			}
		}
	}


	setDisplayTree(tree, prevs, curr, keyPath) {
		const currLevel = Math.floor(keyPath.length / 2);
		const isSearching = this.state.search.isSearching && this.state.search.searchInput;
		const shouldDisplay = (isSearching && curr.isSearchDisplay) || !isSearching;
		curr.keyPath = keyPath;

		if (!curr.children) {
			const keyPathArray = keyPath.split(".");
			const parentPath = Object.assign([], keyPathArray).splice(0, keyPathArray.length - 2);
			const parentNode = _get(this.props.tree, parentPath);
			const filteredChildren = (
				parentNode.children.some(child => child.isSearchDisplay === true)
					?
					parentNode.children.filter(child => child.isSearchDisplay === true)
					:
					parentNode.children
			);
			const itemKey = "my-menu-leaf-" + curr.id;
			const visIds = filteredChildren.map((e) => e.id);

			let relativeIndex = visIds.indexOf(curr.id);
			relativeIndex = (relativeIndex === -1) ? Infinity : relativeIndex;

			let parentMaxLeaves = parentNode.maxLeaves || this.props.maxLeaves;
			if (shouldDisplay && parentMaxLeaves > relativeIndex) {

				prevs.push(
					<li key={itemKey}
						className="my-menu-leaf-container"
						onMouseDown={(e) => this.props.onLeafMouseDown ? this.props.onLeafMouseDown(e, curr) : null}
						onMouseUp={(e) => this.props.onLeafMouseUp ? this.props.onLeafMouseUp(e, curr) : null}
					>
						<span>{curr.name}</span>
					</li>
				);

			}
			else {
				if (relativeIndex === filteredChildren.length - 1) {
					prevs.push(
						<li key={itemKey}
							className="my-menu-load-more-container"
						>
						</li>
					);
				}
			}
			return prevs;
		}
		else {
			const key = "my-menu-node-" + currLevel + "-" + curr.id;
			const nodeName = curr.name;
			if ((!curr.isOpen && !isSearching) || (!curr.isSearchOpen && isSearching)) {
				if (shouldDisplay || curr.isTopParent) {
					prevs.push(
						<div key={key}
							className="my-menu-node-container"
						>
							<label>{nodeName}</label>
						</div>
					);

				}
				return prevs;
			}
			else {
				let openedNode = [];
				if (shouldDisplay) {
					openedNode.push(
						<div key={key}
							className="my-menu-node-container"
						>
							<label>{nodeName}</label>
						</div>
					);


					const childrenList = curr.children.length ? curr.children.reduce((p, c, k) => {
						if (c === undefined || k === undefined) {
							return p;
						}
						return this.setDisplayTree(tree, p, c, keyPath + ".children." + k);
					}, []) : [];


					if (childrenList.length > 0) {
						openedNode.push(
							<ul key={"my-menu-children-list" + currLevel}>
								{childrenList}
							</ul>
						);
					}
					prevs.push(openedNode);
				}
				return prevs;
			}
		}
	}

	renderBody(displayTree) {
		const {
			emptyTreeComponent,
			emptyTreeComponentProps
		} = this.props;

		if (displayTree.length) {
			return displayTree;
		}
		else if (emptyTreeComponent) {
			const emptyTreeElement = React.createElement(emptyTreeComponent, emptyTreeComponentProps);
			return emptyTreeElement;
		}
		else {
			return null;
		}
	}

	render() {
		const tree = this.props.tree;
		let filteredTree = this.state.search.isSearching && this.state.search.searchInput ? tree.reduce((prev, curr, key) => {
			if (key === undefined) {
				return prev;
			}
			return this.findFiltered(prev, curr, key);
		}, []) : tree;

		//debugger;
		//console.log(filteredTree)
		if (filteredTree === null || filteredTree === undefined || filteredTree === '') {
			filteredTree = [];

		}
		const displayTree = filteredTree.reduce((prev, curr, key) => {
			if (key === undefined) {
				return prev;
			}
			return this.setDisplayTree(tree, prev, curr, key.toString());
		}, []);


		const headerProps = {
			isSearching: this.state.search.isSearching,
			searchInput: this.state.search.searchInput,
			setSearchInput: this.setSearchInput,
			stopSearching: this.stopSearching,
			startSearching: this.startSearching,
			...this.props.headerProps
		};

		const bodyContent = this.renderBody(displayTree);
		const defaultHeaderContent = this.props.disableDefaultHeaderContent ? null : React.createElement(SearchInput, headerProps);
		const headerContent = this.props.headerContent ? React.createElement(this.props.headerContent, headerProps) : defaultHeaderContent;

		return (
			<div className="my-menu-container">
				{headerContent}
				<div className="my-menu-display-tree-container">
					{bodyContent}
				</div>
			</div>
		);
	}
}

MyMenu.propTypes = {
	tree: PropTypes.array,
	headerContent: PropTypes.any,
	disableDefaultHeaderContent: PropTypes.bool,
	headerProps: PropTypes.object,
	emptyTreeComponent: PropTypes.any,
	emptyTreeComponentProps: PropTypes.object,
	filter: PropTypes.func,
	maxLeaves: PropTypes.number
};

MyMenu.defaultProps = {
	tree: [],
	headerContent: null,
	disableDefaultHeaderContent: false,
	headerProps: {},
	emptyTreeComponent: null,
	emptyTreeComponentProps: {},
	filter: (node, searchInput) => node.name.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0,
	maxLeaves: Infinity
};
