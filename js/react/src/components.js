var CatalogView = React.createClass({
	getInitialState: function(){
		return {
			activeEntry: null,
			categoryFilter: []
		}
	},

	setActiveCatalog: function(key){
		var _this = this;

		_this.setState({'activeEntry': key});
	},

	setCategoryFilter: function(categoryList){
		var _this = this;

		_this.setState({'categoryFilter': categoryList});
	},

	addCategoryFilter: function(category){
		var _this = this,
			categoryList = _this.state.categoryFilter.concat(category);

		_this.setState({'categoryFilter': categoryList});
	},

	render: function(){
		var _this = this,
			activeEntry = _this.state.activeEntry || Object.keys(_this.props.items)[0];

		return (
			<div>
				<CategoryFilterList categoryFilters={_this.state.categoryFilter} setCategoryFilter={_this.setCategoryFilter}/>
				<div className='col1of2'>
					<EntryList 
						items={_this.props.items} 
						categoryFilter={_this.state.categoryFilter} 
						activeEntry={activeEntry} 
						setActiveCatalog={_this.setActiveCatalog}
						setCategoryFilter={_this.setCategoryFilter}/>
				</div>
				<div className='col1of2'>
					<Entry item={_this.props.items[activeEntry]} addCategoryFilter={_this.addCategoryFilter} />
				</div>
			</div>
		);
	}
});

var EntryList = React.createClass({
	getDefaultProps: function(){
		return {
			categoryFilter: []
		};
	},

	render: function(){
		var _this = this,
			items = [];

		Object.keys(_this.props.items).forEach(function(key){
			var item = _this.props.items[key],
				categories = item.categories,
				categoryFilterMatches = categories && categories.intersection(_this.props.categoryFilter).length === _this.props.categoryFilter.length;

			if(!_this.props.categoryFilter.length || categoryFilterMatches){
				items.push(
					<EntryListItem 
						isActive={_this.props.activeEntry == key}
						company={item.company}
						description={item.description}
						setActiveCatalog={_this.props.setActiveCatalog}
						itemKey={key}
						key={key}/>
				);
			}
		});

		return (
			<div>
				<ul className='basic-catalog-list'>
					{items}
				</ul>
			</div>
		);
	}
});

var EntryListItem = React.createClass({
	handleClick: function(key){
		var _this = this;

		_this.props.setActiveCatalog(key);
	},

	render: function(){
		var _this = this;

		return (
			<li key={_this.props.itemKey} className={_this.props.isActive ? 'active' : ''} onClick={_this.handleClick.bind(_this, _this.props.itemKey)}>
				<p>{_this.props.company}</p>
				<p>{_this.props.description}</p>
			</li>
		);
	}
});

var Entry = React.createClass({
	render: function(){
		var _this = this,
			item = _this.props.item || {},
			categoryList, contactList, company;

		if(item){
			company = item.company || '';
			categoryList = item.categories.map(function(val){ 
				return <CategoryLink addCategoryFilter={_this.props.addCategoryFilter} category={val} key={val+'_link'}/>;
			});

			contactList = item.contact.map(function(val){
				return <Contact contact={val} key={(val.name.toLowerCase() + val.role.toLowerCase()).replace(' ', '')}/>;
			});
		}

		return (
			<section>
				<article className='entry'>
					<h2 className='company-name'>{company}</h2>
					<p>{categoryList}</p>
					<p>{item.description || ''}</p>
					<hr/>
					<Payment payment={item.payment} />
					<hr/>
					<div className='contact-summary'>
						<h3>{'Contact' + (item.contact.length > 1 ? 's' : '')}</h3>
						{contactList.length ? contactList : <em>No contact information</em>}
					</div>
				</article>
			</section>
		);

	}
});

var CategoryFilterList = React.createClass({
	removeCategory: function(categoryToRemove){
		var _this = this,
			categoryFilters = _this.props.categoryFilters.filter(function(category){
				return category !== categoryToRemove;
			});

		_this.props.setCategoryFilter(categoryFilters);
	},

	render: function(){
		var _this = this,
			displayCategories = _this.props.categoryFilters.length,
			categoryList = [], filters;

		categoryList = _this.props.categoryFilters.map(function(filter){
			return <LinkWithRemove key={filter} label={filter} val={filter} removeAction={_this.removeCategory}/>;
		});

		return (
			<ul className='category-filter-list' style={{display: displayCategories ? 'block' : 'none'}}>
				{categoryList}
			</ul>
		);
	}
});

var CategoryLink = React.createClass({
	handleClick: function(category){
		var _this = this;

		_this.props.addCategoryFilter(category);
	},

	render: function(){
		var _this = this;

		return <a className='category-link' href='#' onClick={_this.handleClick.bind(_this, [_this.props.category])} >{_this.props.category.ucFirst()}</a>;
	}
});

var LinkWithRemove = React.createClass({
	render: function(){
		var _this = this;

		return (
			<li className='delete-link' onClick={_this.props.removeAction.bind(null, _this.props.val)}>
				<i className="fa fa-remove"></i>
				<a className='delete-link' href='#'>{_this.props.label.ucFirst()}</a>
			</li>
		);
	}
});

var Payment = React.createClass({
	render: function(){
		var _this = this,
			amount = _this.props.payment.amount_paid 
				? _this.props.payment.amount_paid 
				: null,
			frequency = _this.props.payment && _this.props.payment.frequency
				? ' occuring ' + _this.props.payment.frequency.toLowerCase() 
				: null,
			type = _this.props.payment.type
				? ' by ' + _this.props.payment.type
				: null;

		return _this.props.payment
			? <div className='payment-summary'>
				<h3>Payment</h3>
				<p>
					{
						(amount || '') + 
						(frequency || '') + 
						(type || '')
					}
					{
						amount || frequency || type 
						? null 
						: <em>No payment info recorded</em>
					}
				</p>
			</div>
			: null;

	}
});

var Contact = React.createClass({
	render: function(){
		var _this = this,
			contact = _this.props.contact;

		return (
			<div className='contact-entry'>
				<h4>{contact.name}</h4>
				<div>
					{contact.address ? <p>{contact.address}</p> : null}
					{contact.city ? <p>{contact.city + ' ' + contact.state + ', ' + contact.zip}</p> : null}
					{contact.email ? <a href={'mailto:'+contact.email}>{contact.email}</a> : null}
					{contact.phone ? <a href={'tel:'+contact.phone}>{contact.phone}</a> : null}
				</div>
			</div>
		);
	}
});