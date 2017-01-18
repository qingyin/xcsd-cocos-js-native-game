

var gameData = gameData || {};
gameData.data = {};

gameData.key = {
	curGameId : "curGameId",
	curLevel : "curLevel",
}
gameData.LevelInfoKey = {
	starsList : "starsList",
	gameId : "gameId",
	isTest : "isTest",
	isSettle : "isSettle",
}

gameData.UserRankKey = {
	userId : "userId",
	name : "name",
	rank : "rank",
	score : "score",
	avatar : "avatar",//optional
}

gameData.setValue = function(key,value){
	key = key + "";
	gameData.data[key] = value;
}

gameData.getValue = function(key){
	key = key + "";
	return gameData.data[key];
}

gameData.setGameLevels = function(gameId,array){
	var gamekey = gameId;
	gameData.data[gamekey] = gameData.data[gamekey] ? gameData.data[gamekey] : {};
	for (var k in array) {
		gameData.data[gamekey][k] = array[k];
	}
}

gameData.setGameValue = function(gameId, key, value){
	var gamekey = gameId;
	gameData.data[gamekey] = gameData.data[gamekey] ? gameData.data[gamekey] : {};
	key = key + "";
	gameData.data[gamekey][key] = value;
}

gameData.getGameValue = function(gameId,key){
	var gamekey = gameId;
	gameData.data[gamekey] = gameData.data[gamekey] ? gameData.data[gamekey] : {};
	if (util.getArrycount(gameData.data[gamekey]) == 0) {
		cc.log("value is null", gamekey);
		return null;
	}
	key = key + "";
	return gameData.data[gamekey][key];
}

gameData.setGameStars = function(gameId,key,array){
	var gamekey = gameId;
	var starsKey = gameData.LevelInfoKey.starsList;
	gameData.data[gamekey][starsKey][key] = gameData.data[gamekey][starsKey][key] ? gameData.data[gamekey][starsKey][key] : {};
	gameData.data[gamekey][starsKey][key].gameId = array.gameID;
    gameData.data[gamekey][starsKey][key].level = array.level;
    gameData.data[gamekey][starsKey][key].score = array.starNum;
    gameData.data[gamekey][starsKey][key].stars = array.starNum;
}
gameData.getGameStars = function(gameId, levelKey, key){
	var gamekey = gameId;
	var starsKey = gameData.LevelInfoKey.starsList;
	gameData.data[gamekey][starsKey][levelKey] = gameData.data[gamekey][starsKey][levelKey] ? gameData.data[gamekey][starsKey][levelKey] : {};
	if (util.getArrycount(gameData.data[gamekey][starsKey][levelKey]) == 0) {
		cc.log("level stars is null", levelKey);
		return null;
	}
	return gameData.data[gamekey][starsKey][levelKey][key];
}

gameData.testEditionGuide = function (level) {
    if (isLocalData == true && level == 1) {
    	return true;
    }else if (isLocalData == false) {
    	return true;
    }else {
    	return false;
    }
}


gameData.initGameData = function () {
	if (util.getArrycount(gameData.data) == 0) {
		for (var i = 1; i <= UNIT_LAYOUT.length-1; i++) {
			gameData.data[i] = {};
			if (isLocalData == true) {
				gameData.data[i].gameId = i;
		        gameData.data[i].starsList = {};
		        gameData.data[i].isTest = true;
		        gameData.data[i].isSettle = false;
			}
		};
		gameData.firstGame = true;
	}else {
		gameData.firstGame = false;
	}
}

gameData.setLevelDifficulty = function(gameId,DifficultyIndex,levelNum){//DifficultyIndex:1;2;3
	gameData.data["LevelDifficulty"] = gameData.data["LevelDifficulty"] || {};
	gameData.data["LevelDifficulty"][gameId+""] = gameData.data["LevelDifficulty"][gameId+""] || {};
	
	gameData.data["LevelDifficulty"][gameId+""][DifficultyIndex+""] = levelNum;
}
gameData.getLevelDifficulty = function(gameId,DifficultyIndex){//DifficultyIndex:0;1;2
	if (gameData.data["LevelDifficulty"]) {
		if (gameData.data["LevelDifficulty"][gameId+""]) {
			return gameData.data["LevelDifficulty"][gameId+""][DifficultyIndex+""];
		}
	}
	return 0;
}

gameData.setMySelfRankScore = function(gameId,score){
	gameData.data["MySelfRankScore"] = gameData.data["MySelfRankScore"] || {};
	gameData.data["MySelfRankScore"][gameId+""] = score;
}

gameData.getMySelfRankScore = function(gameId){
	if (gameData.data["MySelfRankScore"]) {
		return gameData.data["MySelfRankScore"][gameId+""] || 0;
	}
	return 0;
}

gameData.setRankInfo = function(gameId,rankIndex,rankInfo){
	gameData.data["RankInfoRankInfo"] = gameData.data["RankInfoRankInfo"] || {}; 
	gameData.data["RankInfoRankInfo"][gameId+""] = gameData.data["RankInfoRankInfo"][gameId+""] || {};
	gameData.data["RankInfoRankInfo"][gameId+""][rankIndex+""] = rankInfo;
}


gameData.getRankInfo = function(gameId,rankIndex){
	if (gameData.data["RankInfoRankInfo"]) {
		if (gameData.data["RankInfoRankInfo"][gameId+""]) {
			return gameData.data["RankInfoRankInfo"][gameId+""][rankIndex+""];
		}
	}
	return null;
}

