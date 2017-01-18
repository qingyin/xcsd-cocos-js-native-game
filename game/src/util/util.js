
var util = util || {};

util.log = function(obj,desc){
    cc.log('============='+(desc || '')+'=============start');
    if (typeof(obj) == 'object'){
	    for (var k in obj) {
	        cc.log(k+'  =  '+obj[k]);
	    };
    }
    else{    	
        cc.log(obj);
    }
    cc.log('============='+(desc || '')+'=============end');
}

util.shuffle=function(arr){
	var swap=function(array,index1,index2){            
	    var temp = array[index1];
	    array[index1] = array[index2];
	    array[index2] = temp;
	}
	var len = arr.length;
	while(len > 1){
	    len = len - 1;
	    var index1 = Math.round(Math.random()*len);
	    swap(arr,index1,len);
	}
}

util.splitStr = function(str, width, fontName, fontSize) {
    var getWidth = function(str) {
        var tmpLabel = cc.LabelTTF.create(str, fontName, fontSize);
        return tmpLabel.getContentSize().width;
    };
    
    var c = str.length,
        i = 0,
        l = parseInt(width / fontSize, 10),
        lines = [];

    while(i < c) {
        var last = current = '';

        while(true) {
            if(i + l > c) {
                break;
            }

            var s = str.substr(i, l),
                w = getWidth(s);

            if(w != width) {
                if(w > width) {
                    current = '-';
                    l--;
                } else {
                    current = '+';
                    l++;
                }

                if(last && last != current) {
                    if(current == '+') {
                        l--;
                    }
                    break;
                }

                last = current;

            } else {
                break;
            }
        }

        lines.push(str.substr(i, l));
        i += l;
    }

    return lines;
}

util.getArrycount = function(array) {
    var t = typeof array;
    if(t == 'string'){
           return array.length;
    }else if(t == 'object'){
        var n = 0;
        for(var i in array){
            n++;
        }
        return n;
    }
    return false;
}

util.getRandom = function (minNum, maxNum) {
    var random_num = Math.floor(Math.random()*(maxNum-minNum+1)+minNum);
    return random_num;
}

