//
//  ResultWin.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//
var ResultWin = cc.Node.extend(
{
    //Win->受け取り->戻る
    resultCnt : 0, viewExp : 0, isGettingExpFlg : 0,
    ctor : function (game) 
    {
        this._super();
        this.game = game;
        this.starCount = 0;

        playClearBGM(this.game.storage);

        this.backLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.8), 640, 1136);
        this.backLayer.setPosition(0, 0);
        this.addChild(this.backLayer);

        this.clearSprite = cc.Sprite.create(res.GameClear_png);
        this.clearSprite.setAnchorPoint(0.5, 0.5);
        this.clearSprite.setPosition(320, 1136 / 2);
        this.addChild(this.clearSprite);

        //合計スコア
        
        this.resultLable = cc.LabelTTF.create("", "Arial", 27);
        this.resultLable.setFontFillColor(new cc.Color(255, 255, 255, 255));
        this.resultLable.setAnchorPoint(0.5, 1);
        this.resultLable.setPosition(320, 1136 / 2 + 50);
        this.addChild(this.resultLable);
        this.resultComment = "";

        //star
        this.star000Sprite = cc.Sprite.create( res.Star000_png );
        this.star000Sprite.setPosition(140,750);
        this.addChild(this.star000Sprite);
        this.star001Sprite = cc.Sprite.create( res.Star001_png );
        this.star001Sprite.setPosition(140,750);
        this.addChild(this.star001Sprite);
        this.star002Sprite = cc.Sprite.create( res.Star002_png );
        this.star002Sprite.setPosition(140,750);
        this.addChild(this.star002Sprite);
        this.star003Sprite = cc.Sprite.create( res.Star003_png );
        this.star003Sprite.setPosition(140,750);
        this.addChild(this.star003Sprite);

        //結果からスター数を計測する
        //普通にクリアすれば+1
        this.starCount = 1;
        this.timeScore = Math.floor(this.game.remainingTime / 30);
        var _gameScore = Math.floor(this.game.score + this.timeScore + this.game.sumCombo - this.game.player.failCount);
        if(_gameScore >= 150)
        {
            this.starCount = 2;
        }
        if(_gameScore >= 300)
        {
            this.starCount = 3;
        }
        this.setStarLabel(this.starCount);
        //データを保存する
        this.game.storage.saveClearedDataToStorage(
            this.game.stageNum,
            _gameScore,
            this.starCount
        );

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

        this.tmpPosY = this.getPosition().y;
        this.mvPosY = 50;

        this.viewCount = 0;
    },

    update : function () 
    {
        this.mvPosY-=5;
        if(this.mvPosY<0)
        {
            this.mvPosY=0;
        }
        this.setPosition(0,this.tmpPosY - this.mvPosY);

        if(this.viewCount < this.game.score)
        {
            this.viewCount+=1;
        }
        var _comment = "";
        _comment += "+ヤギ " + this.viewCount + "点\n";
        _comment += "+時間 " + this.timeScore + "点\n";
        _comment += "+コンボ " + this.game.sumCombo + "点\n";
        _comment += "-迷子 " + this.game.player.failCount + "点\n";
        _comment += "----------------------\n";
        _comment += "合計: " + Math.floor(this.viewCount + this.timeScore + this.game.sumCombo - this.game.player.failCount) + "\n";

        this.resultLable.setString(_comment);
    },

    setStarLabel : function(starCount)
    {
        if(starCount == 0)
        {
            this.star000Sprite.setVisible(true);
            this.star001Sprite.setVisible(false);
            this.star002Sprite.setVisible(false);
            this.star003Sprite.setVisible(false);
        }
        if(starCount == 1)
        {
            this.star000Sprite.setVisible(false);
            this.star001Sprite.setVisible(true);
            this.star002Sprite.setVisible(false);
            this.star003Sprite.setVisible(false);
        }
        if(starCount == 2)
        {
            this.star000Sprite.setVisible(false);
            this.star001Sprite.setVisible(false);
            this.star002Sprite.setVisible(true);
            this.star003Sprite.setVisible(false);
        }
        if(starCount == 3)
        {
            this.star000Sprite.setVisible(false);
            this.star001Sprite.setVisible(false);
            this.star002Sprite.setVisible(false);
            this.star003Sprite.setVisible(true);
        }
    },
});