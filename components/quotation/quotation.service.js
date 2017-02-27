app.service('QuotationService', function ($resource) {
	var API = 'http://localhost:1234/';
	create = function (data) {
		console.log(data);
		return $resource(API +'/softdev').save(data);
	}
});