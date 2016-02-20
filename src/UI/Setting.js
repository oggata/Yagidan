//
//  Setting.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var Setting2 = cc.Node.extend(
{
    ctor : function (calledLayer,type) 
    {
        this._super();
        this.calledLayer = calledLayer;

        this.settingLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.8), 640, 1136);
        this.settingLayer.setPosition(0, 0);
        this.addChild(this.settingLayer);

        this.settingWindow = cc.Sprite.create(res.Setting_Window_png);
        this.settingWindow.setPosition(320,720);
        this.addChild(this.settingWindow);

        var bgmOnButton = new cc.MenuItemImage( res.Sound_On_Button_png, res.Sound_On_Button_png, function () 
        {
            this.setBGMVolume();
        }, this);
        bgmOnButton.setAnchorPoint(0.5,0.5);
        bgmOnButton.setPosition(380,130);
        this.menuBgmButtonOn = new cc.Menu( 
            bgmOnButton
        );
        this.menuBgmButtonOn.setPosition(0,0);
        this.settingWindow.addChild(this.menuBgmButtonOn);

        var seOnButton = new cc.MenuItemImage( res.Sound_On_Button_png, res.Sound_On_Button_png, function () 
        {
            this.setSEVolume();
        }, this);
        seOnButton.setAnchorPoint(0.5,0.5);
        seOnButton.setPosition(380,90);
        this.menuSeButtonOn = new cc.Menu( 
            seOnButton
        );
        this.menuSeButtonOn.setPosition(0,0);
        this.settingWindow.addChild(this.menuSeButtonOn);

        var bgmOffButton = new cc.MenuItemImage( res.Sound_Off_Button_png, res.Sound_Off_Button_png, function () 
        {
            this.setBGMVolume();
        }, this);
        bgmOffButton.setAnchorPoint(0.5,0.5);
        bgmOffButton.setPosition(380,130);
        this.menuBgmButtonOff = new cc.Menu( 
            bgmOffButton
        );
        this.menuBgmButtonOff.setPosition(0,0);
        this.settingWindow.addChild(this.menuBgmButtonOff);

        var seOffButton = new cc.MenuItemImage( res.Sound_Off_Button_png, res.Sound_Off_Button_png, function () 
        {
            this.setSEVolume();
        }, this);
        seOffButton.setAnchorPoint(0.5,0.5);
        seOffButton.setPosition(380,90);
        this.menuSeButtonOff = new cc.Menu( 
            seOffButton
        );
        this.menuSeButtonOff.setPosition(0,0);
        this.settingWindow.addChild(this.menuSeButtonOff);

        if(type == "game_layer")
        {
            var restartButton = new cc.MenuItemImage( res.Restart_Stage_Button_png, res.Restart_Stage_Button_png, function () 
            {
                this.calledLayer.retryGameLayer();
            }, this);
            restartButton.setAnchorPoint(0.5,0.5);
            restartButton.setPosition(210 -40,30);

            var retrunButton = new cc.MenuItemImage( res.Return_Title_Button_png, res.Return_Title_Button_png, function () 
            {
                this.calledLayer.goToTopLayer();
            }, this);
            retrunButton.setAnchorPoint(0.5,0.5);
            retrunButton.setPosition(430 -40,30);

            var menu001 = new cc.Menu( 
                restartButton,retrunButton
            );
            menu001.setPosition(0, 0);
            this.settingWindow.addChild(menu001);
        }

        var closeButton = new cc.MenuItemImage( res.Tutorial_Close_Button, res.Tutorial_Close_Button, function () 
        {
            //this.setSetting();
            this.setVisible(false);
        }, this);
        closeButton.setAnchorPoint(0.5,0.5);
        closeButton.setPosition(280,-100);
        var menu003 = new cc.Menu( 
            closeButton
        );
        menu003.setPosition(0, 0);
        this.settingWindow.addChild(menu003);

        //セッティングの中でチュートリアルを読み込む
        this.tutorial = new Tutorial();
        this.addChild(this.tutorial);
        this.tutorial.setVisible(false);
        this.setVisible(false);
    },

    update : function () 
    {
        if(this.calledLayer.storage.bgmVolume == 0)
        {
            this.menuBgmButtonOn.setVisible(false);
            this.menuBgmButtonOff.setVisible(true);
        }else{
            this.menuBgmButtonOn.setVisible(true);
            this.menuBgmButtonOff.setVisible(false);
        }

        if(this.calledLayer.storage.seVolume == 0)
        {
            this.menuSeButtonOn.setVisible(false);
            this.menuSeButtonOff.setVisible(true);
        }else{
            this.menuSeButtonOn.setVisible(true);
            this.menuSeButtonOff.setVisible(false);
        }
    },

    setBGMVolume : function()
    {  
        if(this.calledLayer.storage.bgmVolume == 0)
        {
            this.calledLayer.storage.bgmVolume = 10;
            playBGM(this.calledLayer.storage);
        }else{
            this.calledLayer.storage.bgmVolume = 0;
            stopBGM(this.calledLayer.storage);
        }
        this.calledLayer.storage.saveCurrentData();
        this.update();
    },

    setSEVolume : function()
    {
        if(this.calledLayer.storage.seVolume == 0)
        {
            this.calledLayer.storage.seVolume = 10;
            playSE_Button(this.calledLayer.storage);
        }else{
            this.calledLayer.storage.seVolume = 0;
        }
        this.calledLayer.storage.saveCurrentData();
        this.update();
    },

    setTutorial : function()
    {
        this.tutorial.pageVisible();
    }
});