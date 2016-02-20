//
//  Building.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var Building = cc.Node.extend(
{
    ctor : function (game) 
    {
        this._super();
        this.game = game;
        this.type = 1;
        this.buildingSprite = cc.Sprite.create(res.Hole_png);
        this.addChild(this.buildingSprite);
    },
    init : function () { },
    update : function () 
    {

    },
});

var Switch = cc.Node.extend(
{
    ctor : function (game) 
    {
        this._super();
        this.game = game;
        this.pushAnimalCnt = 0;
        this.type = 1;
        this.switchSprite = cc.Sprite.create(res.Switch_png);
        this.addChild(this.switchSprite);
    },
    init : function () { },
    update : function () 
    {

    },
});

var Item = cc.Node.extend(
{
    ctor : function (game,itemID) 
    {
        this._super();
        this.game = game;
        this.itemID = itemID;
        this.effectText = "";

        if(itemID == 1)
        {
            this.itemSprite = cc.Sprite.create(res.Milk_001_png);
            this.addChild(this.itemSprite);
            this.effectText = "スピードアップ！(10sec)";
        }
        if(itemID == 2)
        {
            this.itemSprite = cc.Sprite.create(res.Milk_002_png);
            this.addChild(this.itemSprite);
            this.effectText = "ヤギ数アップ！(10sec)";
        }
        if(itemID == 3)
        {
            this.itemSprite = cc.Sprite.create(res.Milk_003_png);
            this.addChild(this.itemSprite);
            this.effectText = "透明になった！(10sec)";
        }
        /*
        if(itemID == 4)
        {
            this.itemSprite = cc.Sprite.create(res.Item_Milk_png);
            this.addChild(this.itemSprite);
            this.effectText = "迷いペナルティが無効！(10sec)";
        }
        if(itemID == 5)
        {
            this.itemSprite = cc.Sprite.create(res.Item_Milk_png);
            this.addChild(this.itemSprite);
            this.effectText = "迷いペナルティが無効！(30sec)";
        }*/
    },
    init : function () { },
    update : function () 
    {

    },
    getMessage:function()
    {
        return this.effectText;
    }
});

var ItemEffect = cc.Node.extend(
{
    ctor : function (game,itemID) 
    {
        this._super();
        this.game = game;
        this.itemID = itemID;
        this.timeCnt = 0;
        this.maxTimeCnt = 30 * 10;
        
        if(itemID == 1)
        {
            this.itemEffectSprite = cc.Sprite.create(res.Effect001_png);
            this.addChild(this.itemEffectSprite);
            this.maxTimeCnt = 30 * 10;
        }
        if(itemID == 2)
        {
            this.itemEffectSprite = cc.Sprite.create(res.Effect002_png);
            this.addChild(this.itemEffectSprite);
            this.maxTimeCnt = 30 * 10;
        }
        if(itemID == 3)
        {
            this.itemEffectSprite = cc.Sprite.create(res.Effect003_png);
            this.addChild(this.itemEffectSprite);
            this.maxTimeCnt = 30 * 30;
        }
        /*
        if(itemID == 4)
        {
            this.itemEffectSprite = cc.Sprite.create(res.Effect004_png);
            this.addChild(this.itemEffectSprite);
        }
        if(itemID == 5)
        {
            this.itemEffectSprite = cc.Sprite.create(res.Effect001_png);
            this.addChild(this.itemEffectSprite);
        }*/

        this._timeLabel = cc.LabelTTF.create("00","Arial",30);
        this._timeLabel.setFontFillColor(new cc.Color(255,255,255,255));
        //this._timeLabel.setAnchorPoint(0.5,0.5);
        this._timeLabel.enableStroke(new cc.Color(0,0,0,255),2,false);
        this.addChild(this._timeLabel);

    },
    init : function () { },
    update : function () 
    {
        var leastTime = Math.floor((this.maxTimeCnt - this.timeCnt) / 30);
        this._timeLabel.setString(leastTime);

        if(this.itemID == 1)
        {
            this.game.item001IsOn = 1;
        }
        if(this.itemID == 2)
        {
            this.game.item002IsOn = 1;
        }
        if(this.itemID == 3)
        {
            this.game.item003IsOn = 1;
        }
        /*
        if(this.itemID == 4)
        {
            this.game.item004IsOn = 1;
        }
        if(this.itemID == 5)
        {
            this.game.item005IsOn = 1;
        }*/

        this.timeCnt++;
        if(this.timeCnt >= this.maxTimeCnt)
        {
            return false;
        }
        return true;
    },
});
