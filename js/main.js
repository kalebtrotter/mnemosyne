/**
 * Main Vanilla JS file
 */

String.prototype.ucFirst = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
}

function getIfSet($Obj, $sKey, $mDefault = null){
	return isset($Obj[$sKey]) ? $Obj[$sKey] : $mDefault;
}

Array.prototype.intersection = function(arr){
	return this.filter(function(n){
		return arr.indexOf(n) != -1;
	});
}