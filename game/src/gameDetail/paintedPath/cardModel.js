var CradModel = cc.Layer.extend({
	_point:null,
	ctor: function (point) {
		this._super();

		this._point = point;

		this.init();
	},

	init: function () {

	},
});