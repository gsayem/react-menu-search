import React from "react";

export default class SearchInput extends React.Component {
	render() {
		return <div className="form-group">
			<label className="form-label" style={{ margin: '10px' }} >Menu search</label>
			<input
				className="react-my-menu-default-search-input form-input"
				style={{ width: '300px' }}
				placeholder="Type here to search the menu"
				onClick={this.props.startSearching} value={this.props.searchInput} onChange={this.props.setSearchInput} /></div>;
	}
}

