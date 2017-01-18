
var PlayingKoiSettings = cc.Class.extend(
{    
    ctor:function(fileLocation)
    {
        if ( fileLocation === undefined )
        {
            cc.log( "No file location specified for settings file. It will be empty." );
        }
        else
        {
            var txtData = Platform.loadFileSync(fileLocation);        
            var jsonObjdata = JSON.parse(txtData);
            for (var settingKey in jsonObjdata )
            {                        
                var firstChar = settingKey.charAt( 0 ).toLowerCase();
                var localKey = firstChar + settingKey.substring( 1 );//使用驼峰命名法
                this[ localKey ] = jsonObjdata[ settingKey ];
                //cc.log("------settings",localKey,jsonObjdata[ settingKey ]);
            }           
        }
        //cc.log("setting------------this---",this.startFish,this);
    },
});