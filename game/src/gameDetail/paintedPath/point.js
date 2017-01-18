var Point = cc.Layer.extend({
	_x:null,
	_y:null,
	ctor: function (row, col) {
		this._super();

		this._x = row;
		this._y = col;

		this.init();
	},

	init: function () {
		this.getX();
		this.getY();
	},

	getX: function () {
		return this._x;
	},

	getY: function () {
		return this._y;
	},
});