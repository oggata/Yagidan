//
//  CutIn.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//
var CutIn = cc.Node.extend(
{
    ctor : function (game) 
    {
        this._super();
        this.effectTime = 0;
        this.game = game;
                
        this.reportLabel = cc.LabelTTF.create("", "Arial", 32);
        this.reportLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        this.reportLabel.setAnchorPoint(0.5,0.5);
        this.reportLabel.setPosition(350,0);

        this.cutInSprite = cc.Sprite.create(res.Message_png);
        this.addChild(this.cutInSprite);
        this.cutInSprite.setAnchorPoint(0,0.5);

        this.addChild(this.reportLabel);
        this.setCutInVisible(false);

        var _posY = this.game.header.getPosition().y - 30;
        this.setPosition(0,_posY);
        this.tmpPosY = this.getPosition().y;

        this.spriteOpacity = 0;
    },

    update : function () 
    {
        if(this.tmpPosY < this.getPosition().y && this.effectTime < 30*1.5)
        {
            this.spriteOpacity+=0.1;
            if(this.spriteOpacity >= 1)
            {
                this.spriteOpacity = 1;
            }
            this.setPosition(
                this.getPosition().x,this.getPosition().y - 5
            );
        }

        if (this.effectTime >= 30*1.5)
        {
            this.spriteOpacity-=0.1;
            if(this.spriteOpacity < 0)
            {
                this.spriteOpacity = 0;
            }
        }
        if (this.effectTime >= 30*2) 
        {
            this.setCutInVisible(false);
        }
        this.effectTime++;
        this.setOpacity(this.spriteOpacity);
    },

    setCutInText : function (text)
    {
        this.setPosition(
            this.getPosition().x,this.tmpPosY + 50
        );
        this.effectTime = 0;
        this.setCutInVisible(true);
        this.reportLabel.setString(text);
        this.spriteOpacity = 0;
    },

    setCutInVisible : function (isTrue)
    {
        if (isTrue) {
            this.setVisible(true);
        }
        else {
            this.setVisible(false);
        }
    },
});