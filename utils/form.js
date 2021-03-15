


/**
 * 
 * @param {Node} form 
 * @returns Object
 */
const serializeForm = function (form) {
	var obj = {};
	var formData = new FormData(form);
	for (var key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return obj;
};