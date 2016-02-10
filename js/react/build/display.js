/**
 * First render point for React components
 */

ReactDOM.render(React.createElement(CatalogView, { items: catalog }), document.getElementById('react-container'));