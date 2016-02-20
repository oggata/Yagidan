//
//  TopLayer.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var TopLayer = cc.Layer.extend(
{
    ctor : function () 
    {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.isCreditVisible = false;
        this.isShareVisible = false;
        this.viewSize = cc.director.getVisibleSize();
        this.mapChip = cc.Sprite.create( res.Back001_png );
        this.mapChip.setAnchorPoint(0, 0);
        this.addChild(this.mapChip);
        this.storage = new Storage();
        try 
        {
/*
            this.storage.saveClearedDataToStorage(1,100,3);
            this.storage.saveClearedDataToStorage(2,100,3);
            this.storage.saveClearedDataToStorage(3,100,3);
            this.storage.saveClearedDataToStorage(4,100,3);
            this.storage.saveClearedDataToStorage(5,100,3);
            this.storage.saveClearedDataToStorage(6,100,3);
            this.storage.saveClearedDataToStorage(7,100,3);
            this.storage.saveClearedDataToStorage(8,100,3);
            this.storage.saveClearedDataToStorage(9,100,3);
            this.storage.saveClearedDataToStorage(10,100,3);
            this.storage.saveClearedDataToStorage(11,100,3);
*/
            var _data = cc.sys.localStorage.getItem("gameStorage");
            if (_data == null) 
            {
                cc.log("dataはnullなので新たに作成します.");
                var _getData = this.storage.getDataFromStorage();
                cc.sys.localStorage.setItem("gameStorage", _getData);
                var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                this.storage.setDataToStorage(JSON.parse(_acceptData));
            }
            if (_data != null) 
            {
                var storageData = JSON.parse(cc.sys.localStorage.getItem("gameStorage"));
                if (storageData["saveData"] == true) 
                {
                    cc.log("保存されたデータがあります");
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    cc.log(_acceptData);
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                }
                else 
                {
                    cc.log("保存されたデータはありません");
                    var _getData = this.storage.getDataFromStorage();
                    cc.sys.localStorage.setItem("gameStorage", _getData);
                    var _acceptData = cc.sys.localStorage.getItem("gameStorage");
                    this.storage.setDataToStorage(JSON.parse(_acceptData));
                }
            }
        }
        catch (e) {
            cc.log("例外..");
            cc.sys.localStorage.clear();
        }
        var _sheepCount = Math.round(this.storage.totalGameScore  / 20);
        if (_sheepCount >= 50) {
            _sheepCount = 50;
        }
        if (_sheepCount <= 3) {
            _sheepCount = 3;
        }
        /*
        for (var i = 0; i < _sheepCount; i++) 
        {
            this.sheep = cc.Sprite.create(res.StageBase_png);
            this.addChild(this.sheep);
            this.sheep.setPosition(getRandNumberFromRange(40, 600), getRandNumberFromRange(150, 1000));
        }*/
        this.logo = cc.Sprite.create(res.App_Name_Logo_png);
        this.addChild(this.logo);
        this.logo.setPosition(320, 650);
        var startButton = new cc.MenuItemImage( res.Tap_To_Start_button, res.Tap_To_Start_button, function () 
        {
            if (this.tutorial.tutorialIsVisible == false) {
                cc.log("start button clicked");
                this.goToStageLayer();
                playSE_Button(this.storage);
            }
        }, this);
        startButton.setAnchorPoint(0.5, 0.5);
        startButton.setPosition(320, 240);

        var creditButton = new cc.MenuItemImage( res.Credit_Button_png, res.Credit_Button_png, function () 
        {
            if(this.isCreditVisible == true)
            {
                this.isCreditVisible = false;
            }else{
                this.isCreditVisible = true;
            }
            playSE_Button(this.storage);
        }, this);
        creditButton.setAnchorPoint(0.5, 0.5);
        creditButton.setPosition(320, 140);

        this.creditLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.8), 640, 1136);
        this.creditLayer.setPosition(0, 0);
        this.addChild(this.creditLayer);

        this.creditContent = cc.Sprite.create(res.Credit_Image_png);
        this.creditContent.setPosition(320,620);
        this.creditLayer.addChild(this.creditContent);

        var shareButton = new cc.MenuItemImage( res.Twitter_Button_png, res.Twitter_Button_png, function () 
        {
            //this.storage.invokeSDK();
            if(this.isShareVisible == false)
            {
                this.isShareVisible = true;
            }else{
                this.isShareVisible = false;
            }
            playSE_Button(this.storage);
        }, this);
        shareButton.setAnchorPoint(0.5, 0.5);
        shareButton.setPosition(580, 80);

        this.shareLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.8), 640, 1136);
        this.shareLayer.setPosition(0, 0);
        this.addChild(this.shareLayer);

        this.shareContent = cc.Sprite.create(res.Share_Contents_png);
        this.shareContent.setPosition(320,620);
        this.shareLayer.addChild(this.shareContent);

        var tweetButton = new cc.MenuItemImage( res.Share_by_Twitter_png, res.Share_by_Twitter_png, function () 
        {
            this.isShareVisible = false;
            playSE_Button(this.storage);
            this.storage.invokeSDK2();
        }, this);
        tweetButton.setAnchorPoint(0.5, 0.5);
        tweetButton.setPosition(300, 50);
        var menu001 = new cc.Menu( tweetButton );
        menu001.setPosition(0, 0);
        this.shareContent.addChild(menu001);

        if(this.storage.totalGameScore == 0)
        {
            this.scoreLabel = cc.LabelTTF.create("「ヤギダン始めたメェー！」", "Arial", 35);
        }else{
            this.scoreLabel = cc.LabelTTF.create("「" + this.storage.totalGameScore + "匹、集めたメェー」", "Arial", 35);
        }
        this.scoreLabel.setFontFillColor(new cc.Color(250, 250, 250, 255));
        this.scoreLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.scoreLabel.setPosition(300, 130);
        this.shareContent.addChild(this.scoreLabel);
/*
        var tutorialButton = new cc.MenuItemImage( res.Tutorial_Button_png, res.Tutorial_Button_png, function () 
        {
            cc.log("start button clicked");
            this.setTutorial();
            playSE_Button(this.storage);
        }, this);
        tutorialButton.setAnchorPoint(0.5, 0.5);
        tutorialButton.setPosition(320, 140);
*/
        var clearButton = new cc.MenuItemImage( res.Tap_To_Start_button, res.Tap_To_Start_button, function () 
        {
            cc.log("start button clicked");
            playSE_Button(this.storage);
            cc.sys.localStorage.clear();
        }, this);
        clearButton.setAnchorPoint(0.5, 0.5);
        clearButton.setPosition(320, 100);

        var menu001 = new cc.Menu( startButton,creditButton,shareButton );
        menu001.setPosition(0, 0);
        this.addChild(menu001);
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
    init : function () { },
    update : function (dt) 
    {
        if(this.isCreditVisible == true)
        {
            this.creditLayer.setVisible(true);
        }else{
            this.creditLayer.setVisible(false);
        }

        if(this.isShareVisible == true)
        {
            this.shareLayer.setVisible(true);
        }else{
            this.shareLayer.setVisible(false);
        }

        if (this.tutorial.tutorialIsVisible == true) {
            this.tutorialLayer.setVisible(true);
        }
        else {
            this.tutorialLayer.setVisible(false);
        }
        return true;
    },
    setTutorial : function () 
    {
        this.tutorial.pageVisible();
    },
    //シーンの切り替え----->
    goToStageLayer : function (pSender) 
    {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(StageLayer.create(this.storage));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
});
TopLayer.create = function () 
{
    return new TopLayer();
};
var TopLayerScene = cc.Scene.extend({
    onEnter : function () 
    {
        this._super();
        var layer = new TopLayer();
        this.addChild(layer);
    }
});