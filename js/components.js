/** @jsx React.DOM */

var EntryList = React.createClass({
	render: function(){
		var _this = this,
			items = _this.props.items.map(function(item, i){
				return (
					<li key={item.key}>
						{item.name}
						{item.description}
					</li>
				);
			});

		return (
			<ul className={'basic-catalog-list'}>
				{items}
			</ul>
		);
	}
});