var SimCell = cc.Layer.extend({
	_blocked:null,
	_idealPath:null,
	_pos:null,
	_value:null,
	_isAddFlag:null,
	ctor: function () {
		this._super();

		this._idealPath = new Array();
		this._blocked = false;
		this._isAddFlag = false;
	},

	getPos: function () {
		return this._pos;
	},

	setPos: function (pos) {
		this._pos = pos;
	},

	getValue: function () {
		return this._value;
	},

	setValue: function (value) {
		this._value = value;
	},

	isBlocked: function () {
		return this._blocked;
	},

	setBlocked: function (blocked) {
		this._blocked = blocked;
	},

	getFlagged: function () {
		return this._isAddFlag;
	},

	setFlagged: function (isAddFlag) {
		this._isAddFlag = isAddFlag;
	},

	getIdealPath: function () {
		return this._idealPath;
	},

	setIdealPath: function (idealPath) {
		this._idealPath = idealPath;
	},

	onExit: function () {
		
		for (var i = 0; i < this._idealPath.length; i++) {
			this._idealPath[i].removeFromParent(true);
			this._idealPath.splice(i, 1);
		};
		this._super();
	},
	 
});

SimCell.createForPos = function (pos) {
	var cell = new SimCell();
	cell.setPos(pos);
	return cell;
};