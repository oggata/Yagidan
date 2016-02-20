//
//  StageLayer.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var StageLayer = cc.Layer.extend(
{
    ctor : function (storage) 
    {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.viewSize = cc.director.getVisibleSize();
        this.storage = storage;
        playBGM(this.storage);

        this.maxStageNum = 18;

        var _getData = this.storage.getDataFromStorage();
        cc.sys.localStorage.setItem("gameStorage", _getData);
        this.clearedStageData = this.storage.clearedStageData;
        this.currentStageNumber = 1;
        this.isCurrentStageLocked = false;

        this.scrollBackX = 0;
        this.scrollBackSprite = cc.Sprite.create( res.Scroll_Back_png );
        this.scrollBackSprite.setPosition(this.scrollBackX,0);
        this.scrollBackSprite.setAnchorPoint(0,0);
        this.addChild(this.scrollBackSprite);

        this.girlSprite = cc.Sprite.create( res.Girl_png );
        //this.girlSprite.setAnchorPoint(0.5,0.5);
        this.girlPosY = 740;
        this.girlSprite.setPosition(130,this.girlPosY);
        this.addChild(this.girlSprite);

        this.backSprite = cc.Sprite.create( res.Back002_png );
        this.backSprite.setAnchorPoint(0.5,0.5);
        this.backSprite.setPosition(this.viewSize.width/2,this.viewSize.height/2);
        this.addChild(this.backSprite);
        //header
        this.header = cc.Sprite.create( res.HeaderStage150_png );
        this.header.setPosition(this.viewSize.width/2, this.viewSize.height - 150);
        this.header.setAnchorPoint(0.5,0);
        this.addChild(this.header);
        //conf
        this.stageData = CONFIG.STAGE;
        this.stageListNode = cc.Node.create();
        this.backSprite.addChild(this.stageListNode);
        this.stageListNode.setPosition(0, 0);
        this.stageListNode.retain();
        this.titleLable = cc.LabelTTF.create("", "Arial", 35);
        this.titleLable.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.titleLable.setAnchorPoint(0.5, 0);
        this.titleLable.setPosition(450, 720 + 30);
        //this.titleLable.enableStroke(new cc.Color(0, 0, 0, 255), 3, true);
        this.backSprite.addChild(this.titleLable);
        this.detailLable = cc.LabelTTF.create("", "Arial", 25);
        this.detailLable.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.detailLable.setAnchorPoint(0.5, 1);
        this.detailLable.setPosition(450, 700 + 30);
        //this.detailLable.enableStroke(new cc.Color(0, 0, 0, 255), 2, true);
        this.backSprite.addChild(this.detailLable);
        this.scoreLable = cc.LabelTTF.create("", "Arial", 34);
        this.scoreLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.scoreLable.setAnchorPoint(0, 0);
        this.scoreLable.setPosition(480, 970);
        this.backSprite.addChild(this.scoreLable);
        //this.scoreLable.setString(this.storage.totalGameScore);
        this.expGauge = new Gauge(160, 35, 'white');
        this.expGauge.setPosition(60 - 30, 970 - 930);
        this.header.addChild(this.expGauge);
        this.levelGaugeSprite = cc.Sprite.create( res.Level_Gauge_Cover_png );
        this.levelGaugeSprite.setAnchorPoint(0,0);
        this.levelGaugeSprite.setPosition(40  - 30,955 - 930);
        this.header.addChild(this.levelGaugeSprite);
        this.expLable = cc.LabelTTF.create("10", "Arial", 28);
        this.expLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.expLable.setPosition(30,30);
        this.expLable.enableStroke(new cc.Color(105, 105, 105, 255), 2, true);
        this.levelGaugeSprite.addChild(this.expLable);
        //settingLayer(一番手前に表示)
        this.setting = new Setting2(this,'stage_layer');
        this.backSprite.addChild(this.setting,9999);
        this.setting.setPosition(0,0);
        var stageStart = new cc.MenuItemImage( res.Stage_Start_png, res.Stage_Start_On_png, function () 
        {
            if (this.isCurrentStageLocked == false) {
                this.goToGameLayer();
            }
        }, this);
        stageStart.setAnchorPoint(0.5, 0.5);
        stageStart.setPosition(450, 560);
        var menu001 = new cc.Menu( stageStart );
        menu001.setPosition(0, 0);
        this.backSprite.addChild(menu001);
        var _maxClearedStage = 1;
        var stData = this.clearedStageData;
        for (var stDataKey in stData) 
        {
            if (stData.hasOwnProperty(stDataKey)) 
            {
                var value = stData[stDataKey];
                var toObj = JSON.parse(value);
                if (_maxClearedStage <= toObj['id']) {
                    _maxClearedStage = toObj['id'];
                }
            }
        }
        //cc.log(_maxClearedStage);
        this.maxUnlockedStage = this.storage.maxUnlockedStage;
        if (this.maxUnlockedStage < this.getLockedStage(_maxClearedStage)) 
        {
            //ここでunlockのイベントを作成
            this.maxUnlockedStage = this.getLockedStage(_maxClearedStage);
            this.storage.maxUnlockedStage = this.maxUnlockedStage;
        }
        this.resultLable = cc.LabelTTF.create("", "Arial", 32);
        this.resultLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.resultLable.setAnchorPoint(1, 0.5);
        this.resultLable.setPosition(230, 580);
        this.resultLable.enableStroke(new cc.Color(0, 0, 0, 255), 2, true);
        this.backSprite.addChild(this.resultLable);
        this.star000Sprite = cc.Sprite.create( res.Star000_png );
        var _starPosY = 550;
        this.star000Sprite.setPosition(160, _starPosY);
        this.backSprite.addChild(this.star000Sprite);
        this.star001Sprite = cc.Sprite.create( res.Star001_png );
        this.star001Sprite.setPosition(160, _starPosY);
        this.backSprite.addChild(this.star001Sprite);
        this.star002Sprite = cc.Sprite.create( res.Star002_png );
        this.star002Sprite.setPosition(160, _starPosY);
        this.backSprite.addChild(this.star002Sprite);
        this.star003Sprite = cc.Sprite.create( res.Star003_png );
        this.star003Sprite.setPosition(160, _starPosY);
        this.backSprite.addChild(this.star003Sprite);
        this.setStageButtons();
        this.setStageNum(1, false);

        this.nextStageButton = new cc.MenuItemImage( res.Next_Stage_Button_png, res.Next_Stage_Button_png, function () 
        {
            if(this.setting.isVisible() == true){return;}
            this.stageListNum += 1;
            if(this.stageListNum >= 3)
            {
                this.stageListNum = 3;
            }
        }, this);
        this.nextStageButton.setPosition(560, 320);

        this.backStageButton = new cc.MenuItemImage( res.Back_Stage_Button_png, res.Back_Stage_Button_png, function () 
        {
            if(this.setting.isVisible() == true){return;}
            this.stageListNum -= 1;
            if(this.stageListNum <= 1)
            {
                this.stageListNum = 1;
            }
        }, this);
        this.backStageButton.setPosition(80, 320);

        var menu002 = new cc.Menu( this.nextStageButton, this.backStageButton);
        menu002.setPosition(0, 0);
        this.backSprite.addChild(menu002);
                
        //settingButton
        var settingButton = new cc.MenuItemImage( res.Setting_Button_png, res.Setting_Button_png, function () 
        {
            if(this.setting.isVisible() == true){return;}
            this.setting.setVisible(true);
        }, this);
        settingButton.setPosition(370, 870);

        var tutorialButton = new cc.MenuItemImage( res.Tutorial_png, res.Tutorial_png, function () 
        {
            this.tutorial.pageVisible();
        }, this);
        tutorialButton.setPosition(520, 870);

        var menuSetting = new cc.Menu( settingButton, tutorialButton );
        menuSetting.setPosition(0, 0);
        this.backSprite.addChild(menuSetting);
        this.stageListNum = 1;

        this.currentStageMarker = cc.Sprite.create( res.Current_Stage_Icon_png );
        this.currentStageMarker.setPosition(100,100);
        this.stageListNode.addChild(this.currentStageMarker);

        //現在のレベル
        var _data = this.getLevel(this.storage.totalGameScore);
        this.expGauge.update( _data["gauge_rate"] );
        this.expLable.setString( "lv." + _data["current_level"] );


        //チュートリアル用
        this.tutorialLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.8), 640, 1136);
        this.tutorialLayer.setPosition(0, 0);
        this.addChild(this.tutorialLayer);
        this.tutorial = new Tutorial();
        this.addChild(this.tutorial);
        this.tutorial.setVisible(false);
        this.tutorialLayer.setVisible(false);

        this.scheduleUpdate();
        return true;
    },

    getLevel:function(currentExp)
    {
        var _currentLevel = 1;
        var _formerExp = 0;
        var _nextExp = 0;
        var _gaugeRate = 0;
        var _master = CONFIG.EXP_MASTER;
        for (var i = 0; i < _master.length; i++)
        {
            var _exp = _master[i];
            if(currentExp + 1 <= _exp)
            {
                if(i >= 1){
                    _formerExp = _master[i-1];
                }
                _currentLevel = i + 1;
                _nextExp = _exp;
                _gaugeRate = (( currentExp - _formerExp ) / (_nextExp - _formerExp));
                break;
            }
        }

        return { 
            former_level:_formerExp , 
            current_level:_currentLevel , 
            current_exp : currentExp,
            next_level:_nextExp,
            gauge_rate : _gaugeRate
        };
    },

    setStageButtons : function () 
    {
        //最大のステージ数は固定
        for (var i = 1; i <= 20; i++) 
        {
            eval("this.stage" + ("00"+i).slice(-3) + " = new StageButtonSprite(this, " + i + ");");
            eval("this.stage" + ("00"+i).slice(-3) + ".setPosition(" + CONFIG.STAGE_POSITION[i][0] + "," + CONFIG.STAGE_POSITION[i][1] + ");");
            eval("this.stageListNode.addChild(this.stage" + ("00"+i).slice(-3) + ");");
        }
    },
    setStageNum : function (stageNum, isLocked) 
    {
        if (isLocked == false) 
        {
            this.isCurrentStageLocked = false;
            this.titleLable.setString(this.stageData[stageNum]['name']);
            this.detailLable.setString(this.stageData[stageNum]['detail']);
            var _text = "";
            var _starCount = 0;
            var stData = this.clearedStageData;
            for (var key in stData) 
            {
                if (stData.hasOwnProperty(key)) 
                {
                    var stDataValue = stData[key];
                    var toObj = JSON.parse(stDataValue);
                    if (toObj['id'] == stageNum) {
                        _text = "score:" + toObj["score"] + "";
                        _starCount = toObj["starCount"];
                    }
                }
            }
            this.girlPosY = 760;
            this.resultLable.setString(_text);
            this.setStarLabel(_starCount);
        }
        else
        {
            this.isCurrentStageLocked = true;
            this.titleLable.setString("Locked....");
            this.detailLable.setString("....");
            this.resultLable.setString("");
            this.setStarLabel(0);
        }
        this.currentStageNumber = stageNum;
        playSE_Button(this.storage);
    },
    setStarLabel : function (starCount) 
    {
        if (starCount == 0) 
        {
            this.star000Sprite.setVisible(true);
            this.star001Sprite.setVisible(false);
            this.star002Sprite.setVisible(false);
            this.star003Sprite.setVisible(false);
        }
        if (starCount == 1) 
        {
            this.star000Sprite.setVisible(false);
            this.star001Sprite.setVisible(true);
            this.star002Sprite.setVisible(false);
            this.star003Sprite.setVisible(false);
        }
        if (starCount == 2) 
        {
            this.star000Sprite.setVisible(false);
            this.star001Sprite.setVisible(false);
            this.star002Sprite.setVisible(true);
            this.star003Sprite.setVisible(false);
        }
        if (starCount == 3) 
        {
            this.star000Sprite.setVisible(false);
            this.star001Sprite.setVisible(false);
            this.star002Sprite.setVisible(false);
            this.star003Sprite.setVisible(true);
        }
    },
    //シーンの切り替え----->
    goToGameLayer : function (pSender) 
    {
        if (this.setting.isVisible() == true) {
            return;
        }
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage, this.currentStageNumber));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    update : function (dt) 
    {
        if (this.tutorial.tutorialIsVisible == true) {
            this.tutorialLayer.setVisible(true);
        }
        else {
            this.tutorialLayer.setVisible(false);
        }

        this.scrollBackX -= 1;
        if(this.scrollBackX < -67*8)
        {
            this.scrollBackX = 0;
        }
        this.scrollBackSprite.setPosition(this.scrollBackX,0);

        this.girlSprite.setPosition(130,this.girlPosY);
        if(this.girlPosY >=740)
        {
            this.girlPosY-=1;
        }

        //現在のステージを示す
        this.currentStageMarker.setPosition(
            CONFIG.STAGE_POSITION[this.currentStageNumber][0],
            CONFIG.STAGE_POSITION[this.currentStageNumber][1]
        );

        //設定画面の状態
        this.setting.update();

        //リストをスライドするボタン
        if(this.stageListNum == 1)
        {
            this.backStageButton.setVisible(false);
            this.nextStageButton.setVisible(true);
        }
        if(this.stageListNum == 2)
        {
            this.backStageButton.setVisible(true);
            this.nextStageButton.setVisible(true);
        }
        if(this.stageListNum == 3)
        {
            this.backStageButton.setVisible(true);
            this.nextStageButton.setVisible(false);
        }

        //リストをスライドさせる
        if(this.stageListNum == 1)
        {
            if(this.stageListNode.getPosition().x > 0)
            {
                this.stageListNode.setPosition(
                    this.stageListNode.getPosition().x-=40,
                    this.stageListNode.getPosition().y
                );
            }
            if(this.stageListNode.getPosition().x < 0)
            {
                this.stageListNode.setPosition(
                    this.stageListNode.getPosition().x+=40,
                    this.stageListNode.getPosition().y
                );
            }
        }

        if(this.stageListNum == 2)
        {
            if(this.stageListNode.getPosition().x > -640)
            {
                this.stageListNode.setPosition(
                    this.stageListNode.getPosition().x-=40,
                    this.stageListNode.getPosition().y
                );
            }
            if(this.stageListNode.getPosition().x < -640)
            {
                this.stageListNode.setPosition(
                    this.stageListNode.getPosition().x+=40,
                    this.stageListNode.getPosition().y
                );
            }
        }

        if(this.stageListNum == 3)
        {
            if(this.stageListNode.getPosition().x > -640 * 2)
            {
                this.stageListNode.setPosition(
                    this.stageListNode.getPosition().x-=40,
                    this.stageListNode.getPosition().y
                );
            }
            if(this.stageListNode.getPosition().x < -640 * 2)
            {
                this.stageListNode.setPosition(
                    this.stageListNode.getPosition().x+=40,
                    this.stageListNode.getPosition().y
                );
            }
        }
    },
    getLockedStage : function (maxClearedStage) 
    {
        if (maxClearedStage == 0) {
            return 1;
        }
        if (maxClearedStage == 1) {
            return 3;
        }
        if (maxClearedStage == 2) {
            return 3;
        }
        if (maxClearedStage == 3) {
            return 5;
        }
        if (maxClearedStage == 4) {
            return 5;
        }
        if (maxClearedStage == 5) {
            return 8;
        }
        if (maxClearedStage == 6) {
            return 8;
        }
        if (maxClearedStage == 7) {
            return 8;
        }
        if (maxClearedStage == 8) {
            return 11;
        }
        if (maxClearedStage == 9) {
            return 11;
        }
        if (maxClearedStage == 10) {
            return 11;
        }
        if (maxClearedStage == 11) {
            return 14;
        }
        if (maxClearedStage == 12) {
            return 14;
        }
        if (maxClearedStage == 13) {
            return 14;
        }
        if (maxClearedStage == 14) {
            return 16;
        }
        if (maxClearedStage == 15) {
            return 16;
        }
        if (maxClearedStage == 16) {
            return 20;
        }
        if (maxClearedStage == 17) {
            return 20;
        }
        if (maxClearedStage == 18) {
            return 20;
        }
        if (maxClearedStage == 19) {
            return 20;
        }
        if (maxClearedStage == 20) {
            return 20;
        }
        return 20;
    }
});

var StageButtonSprite = cc.Node.extend(
{
    ctor : function (current, stageNum) 
    {
        this._super();
        this.isLocked = false;

        //var tag = pTag || 1;
        var titleButton = new cc.MenuItemImage( res.StageButton_png, res.StageButtonOn_png, function () 
        {
            current.setStageNum(stageNum, this.isLocked);
        }, this);
        var menu = new cc.Menu( titleButton );
        menu.setPosition(0, 0);
        this.addChild(menu);

        //lock
        this.lockedSprite = cc.Sprite.create(res.SecretB01);
        this.addChild(this.lockedSprite);
        if (current.maxUnlockedStage >= stageNum) {
            this.isLocked = false;
            this.lockedSprite.setVisible(false);
        }
        else {
            this.isLocked = true;
            this.lockedSprite.setVisible(true);
        }

        //clearしたボタンにはバッチをつける
        var stData = current.clearedStageData;
        for (var key in stData) 
        {
            if (stData.hasOwnProperty(key)) 
            {
                var stDataValue = stData[key];
                var toObj = JSON.parse(stDataValue);
                if (toObj['id'] == stageNum) {
                    //clear
                    this.clearedSprite = cc.Sprite.create(res.Stage_Clear_Icon_png);
                    this.addChild(this.clearedSprite);
                }
            }
        }
    },
    update : function () { }
});
StageLayer.create = function (storage) 
{
    return new StageLayer(storage);
};
var StageLayerScene = cc.Scene.extend(
{
    onEnter : function (storage) 
    {
        this._super();
        var layer = new StageLayer(storage);
        this.addChild(layer);
    }
});