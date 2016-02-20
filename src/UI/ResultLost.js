//
//  ResultLost.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//
var ResultLost = cc.Node.extend(
{
    //Lose->戻る
    ctor : function (game) 
    {
        this._super();
        this.game = game;

        playClearBGM(this.game.storage);

        //Menu_button_001_png
        this.backLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.8), 640, 1136);
        this.backLayer.setPosition(0, 0);
        this.addChild(this.backLayer);

        this.tutorialSprite = cc.Sprite.create(res.GameOver_png);
        this.tutorialSprite.setAnchorPoint(0.5, 0.5);
        this.tutorialSprite.setPosition(640 / 2, 1136 / 2);
        this.addChild(this.tutorialSprite);

        var goToStageButton = new cc.MenuItemImage( 
            res.Result_Return_button, res.Result_Return_button, function () 
        {
            this.game.goToTopLayer();
        }, this);
        goToStageButton.setPosition(640 / 3 * 1, 260);
        goToStageButton.setOpacity(255 * 1);

        var retryButton = new cc.MenuItemImage( 
            res.Result_Retry_button, res.Result_Retry_button, function () 
        {
            this.game.retryGameLayer();
        }, this);
        retryButton.setPosition(640 / 3 * 2, 260);
        retryButton.setOpacity(255 * 1);

        var menu = new cc.Menu(goToStageButton,retryButton);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        this.resultCommentLable = cc.LabelTTF.create("", "Arial", 25);
        this.resultCommentLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.resultCommentLable.setAnchorPoint(0, 1);
        this.resultCommentLable.setPosition(400, 650);
        //this.resultCommentLable.enableStroke(new cc.Color(169, 169, 169, 255), 5, true);
        this.addChild(this.resultCommentLable);

        this.tmpPosY = this.getPosition().y;
        this.mvPosY = 50;
    },

    update : function () 
    {
        this.mvPosY-=5;
        if(this.mvPosY<0)
        {
            this.mvPosY=0;
        }
        this.setPosition(0,this.tmpPosY - this.mvPosY);
    }, 
});
