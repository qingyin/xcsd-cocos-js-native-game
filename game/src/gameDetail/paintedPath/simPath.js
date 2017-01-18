var SimPath = cc.Layer.extend({
	_pathStartCell:null,
	_pos:null,
	ctor: function (pos, pathStartCell) {
		this._super();

		this._pos = pos;
		this._pathStartCell = pathStartCell;
	},

	getPos: function () {
		return this._pos;
	},

	setPos: function (pos) {
		this._pos = pos;
	},

	getPathStartCell: function () {
		return this._pathStartCell;
	},

	setPathStartCell: function (pathStartCell) {
		this._pathStartCell = pathStartCell;
	},

});