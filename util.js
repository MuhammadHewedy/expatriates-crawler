
module.exports.extend = function (o, propsObj){
	var newO = {};
	Object.keys(o).forEach(function(key){
		newO[key] = o[key];
	});
	Object.keys(propsObj).forEach(function(key){
		newO[key] = propsObj[key];
	});
	return newO;
}
