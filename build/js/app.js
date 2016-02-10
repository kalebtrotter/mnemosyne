'use strict';

/**
 * Main Vanilla JS file
 */

String.prototype.ucFirst = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

function getIfSet($Obj, $sKey) {
	var $mDefault = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	return isset($Obj[$sKey]) ? $Obj[$sKey] : $mDefault;
}

Array.prototype.intersection = function (arr) {
	return this.filter(function (n) {
		return arr.indexOf(n) != -1;
	});
};
var CatalogView = React.createClass({
	getInitialState: function getInitialState() {
		return {
			activeEntry: null,
			categoryFilter: []
		};
	},

	setActiveCatalog: function setActiveCatalog(key) {
		var _this = this;

		_this.setState({ 'activeEntry': key });
	},

	setCategoryFilter: function setCategoryFilter(categoryList) {
		var _this = this;

		_this.setState({ 'categoryFilter': categoryList });
	},

	addCategoryFilter: function addCategoryFilter(category) {
		var _this = this,
		    categoryList = _this.state.categoryFilter.concat(category);

		_this.setState({ 'categoryFilter': categoryList });
	},

	render: function render() {
		var _this = this,
		    activeEntry = _this.state.activeEntry || Object.keys(_this.props.items)[0];

		return React.createElement('div', null, React.createElement(CategoryFilterList, { categoryFilters: _this.state.categoryFilter, setCategoryFilter: _this.setCategoryFilter }), React.createElement('div', { className: 'col1of2' }, React.createElement(EntryList, {
			items: _this.props.items,
			categoryFilter: _this.state.categoryFilter,
			activeEntry: activeEntry,
			setActiveCatalog: _this.setActiveCatalog,
			setCategoryFilter: _this.setCategoryFilter })), React.createElement('div', { className: 'col1of2' }, React.createElement(Entry, { item: _this.props.items[activeEntry], addCategoryFilter: _this.addCategoryFilter })));
	}
});

var EntryList = React.createClass({
	getDefaultProps: function getDefaultProps() {
		return {
			categoryFilter: []
		};
	},

	render: function render() {
		var _this = this,
		    items = [];

		Object.keys(_this.props.items).forEach(function (key) {
			var item = _this.props.items[key],
			    categories = item.categories,
			    categoryFilterMatches = categories && categories.intersection(_this.props.categoryFilter).length === _this.props.categoryFilter.length;

			if (!_this.props.categoryFilter.length || categoryFilterMatches) {
				items.push(React.createElement(EntryListItem, {
					isActive: _this.props.activeEntry == key,
					company: item.company,
					description: item.description,
					setActiveCatalog: _this.props.setActiveCatalog,
					itemKey: key,
					key: key }));
			}
		});

		return React.createElement('div', null, React.createElement('ul', { className: 'basic-catalog-list' }, items));
	}
});

var EntryListItem = React.createClass({
	handleClick: function handleClick(key) {
		var _this = this;

		_this.props.setActiveCatalog(key);
	},

	render: function render() {
		var _this = this;

		return React.createElement('li', { key: _this.props.itemKey, className: _this.props.isActive ? 'active' : '', onClick: _this.handleClick.bind(_this, _this.props.itemKey) }, React.createElement('p', null, _this.props.company), React.createElement('p', null, _this.props.description));
	}
});

var Entry = React.createClass({
	render: function render() {
		var _this = this,
		    item = _this.props.item || {},
		    categoryList,
		    contactList,
		    company;

		if (item) {
			company = item.company || '';
			categoryList = item.categories.map(function (val) {
				return React.createElement(CategoryLink, { addCategoryFilter: _this.props.addCategoryFilter, category: val, key: val + '_link' });
			});

			contactList = item.contact.map(function (val) {
				return React.createElement(Contact, { contact: val, key: (val.name.toLowerCase() + val.role.toLowerCase()).replace(' ', '') });
			});
		}

		return React.createElement('section', null, React.createElement('article', { className: 'entry' }, React.createElement('h2', { className: 'company-name' }, company), React.createElement('p', null, categoryList), React.createElement('p', null, item.description || ''), React.createElement('hr', null), React.createElement(Payment, { payment: item.payment }), React.createElement('hr', null), React.createElement('div', { className: 'contact-summary' }, React.createElement('h3', null, 'Contact' + (item.contact.length > 1 ? 's' : '')), contactList.length ? contactList : React.createElement('em', null, 'No contact information'))));
	}
});

var CategoryFilterList = React.createClass({
	removeCategory: function removeCategory(categoryToRemove) {
		var _this = this,
		    categoryFilters = _this.props.categoryFilters.filter(function (category) {
			return category !== categoryToRemove;
		});

		_this.props.setCategoryFilter(categoryFilters);
	},

	render: function render() {
		var _this = this,
		    displayCategories = _this.props.categoryFilters.length,
		    categoryList = [],
		    filters;

		categoryList = _this.props.categoryFilters.map(function (filter) {
			return React.createElement(LinkWithRemove, { key: filter, label: filter, val: filter, removeAction: _this.removeCategory });
		});

		return React.createElement('ul', { className: 'category-filter-list', style: { display: displayCategories ? 'block' : 'none' } }, categoryList);
	}
});

var CategoryLink = React.createClass({
	handleClick: function handleClick(category) {
		var _this = this;

		_this.props.addCategoryFilter(category);
	},

	render: function render() {
		var _this = this;

		return React.createElement('a', { className: 'category-link', href: '#', onClick: _this.handleClick.bind(_this, [_this.props.category]) }, _this.props.category.ucFirst());
	}
});

var LinkWithRemove = React.createClass({
	render: function render() {
		var _this = this;

		return React.createElement('li', { className: 'delete-link', onClick: _this.props.removeAction.bind(null, _this.props.val) }, React.createElement('i', { className: 'fa fa-remove' }), React.createElement('a', { className: 'delete-link', href: '#' }, _this.props.label.ucFirst()));
	}
});

var Payment = React.createClass({
	render: function render() {
		var _this = this,
		    amount = _this.props.payment.amount_paid ? _this.props.payment.amount_paid : null,
		    frequency = _this.props.payment && _this.props.payment.frequency ? ' occuring ' + _this.props.payment.frequency.toLowerCase() : null,
		    type = _this.props.payment.type ? ' by ' + _this.props.payment.type : null;

		return _this.props.payment ? React.createElement('div', { className: 'payment-summary' }, React.createElement('h3', null, 'Payment'), React.createElement('p', null, (amount || '') + (frequency || '') + (type || ''), amount || frequency || type ? null : React.createElement('em', null, 'No payment info recorded'))) : null;
	}
});

var Contact = React.createClass({
	render: function render() {
		var _this = this,
		    contact = _this.props.contact;

		return React.createElement('div', { className: 'contact-entry' }, React.createElement('h4', null, contact.name), React.createElement('div', null, contact.address ? React.createElement('p', null, contact.address) : null, contact.city ? React.createElement('p', null, contact.city + ' ' + contact.state + ', ' + contact.zip) : null, contact.email ? React.createElement('a', { href: 'mailto:' + contact.email }, contact.email) : null, contact.phone ? React.createElement('a', { href: 'tel:' + contact.phone }, contact.phone) : null));
	}
});
/**
 * First render point for React components
 */

ReactDOM.render(React.createElement(CatalogView, { items: catalog }), document.getElementById('react-container'));