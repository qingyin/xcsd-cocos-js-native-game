
var LoadResource = LoadResource || {};

LoadResource.loadingResourses = function (resAdd, target, addLayer) {
	var resLoad = [];
    for(var k in resAdd){
        resLoad.push(resAdd[k]);
    }
    //this.initWithResources(resLoad, addLayer, target);
	cc.loader.load(resLoad, addLayer, target);
}

LoadResource.unLoadResourses = function (resAdd) {
	var resLoad = [];
    for(var k in resAdd){
        resLoad.push(resAdd[k]);
    }
	resLoad.forEach(function(item){
        cc.loader.release(item);
    });
}

