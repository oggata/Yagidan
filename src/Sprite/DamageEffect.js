//
//  WindowEffect.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//
var WindowEffect = cc.Node.extend(
{
    ctor : function (effectId) 
    {
        this._super();
        this.viewCnt = 0;
        switch (effectId)
        {
            case 1:
                this.windowEffect = cc.Sprite.create( res.Window_Effect_001 );
                this.windowEffect.setAnchorPoint(0, 0);
                this.windowEffect.setScale(2, 2);
                this.addChild(this.windowEffect);
                break;
            case 2:
                this.windowEffect = cc.Sprite.create( res.Window_Effect_002 );
                this.windowEffect.setAnchorPoint(0, 0);
                this.windowEffect.setScale(2, 2);
                this.addChild(this.windowEffect);
                break;
        }
        this.direction = 1;
    },
    update : function () 
    {
        this.viewCnt += this.direction;
        this.windowEffect.setOpacity(255 * this.viewCnt  / 10);
        if (this.viewCnt >= 10 * 1) {
            this.direction = - 1;
        }
        if (this.viewCnt < 0) {
            this.direction = 1;
        }
    },
});
var PowerUpEffect = cc.Node.extend(
{
    ctor : function (effectId) 
    {
        this._super();
        this.effectTime = 0;
        var frameSeqEffect2 = [];
        switch (effectId) 
        {
            case 1:
                this.effectImage = res.Effect_001_png;
                this.imageCnt = 12;
                this.imageWidth = 240;
                this.imageHeight = 240;
                for (var x = 0; x < this.imageCnt; x++) 
                {
                    var frame = cc.SpriteFrame.create(this.effectImage, cc.rect(this.imageWidth * x, 0, this.imageWidth, 
                    this.imageHeight));
                    frameSeqEffect2.push(frame);
                }
                this.wa = cc.Animation.create(frameSeqEffect2, 0.1);
                this.ra = cc.Repeat.create(cc.Animate.create(this.wa),1);
                //this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
                this.attackAnimation = cc.Sprite.create(this.effectImage, cc.rect(0, 0, this.imageWidth, this.imageHeight));
                this.attackAnimation.runAction(this.ra);
                this.attackAnimation.setScale(1, 1);
                this.addChild(this.attackAnimation);
                break;
            case 2:
                this.effectImage = res.Effect_003_png;
                this.imageCnt = 5;
                this.imageWidth = 480/5;
                this.imageHeight = 192/2;
                //for (var y = 0; y <= 1; y++) {
                for (var x = 0; x < this.imageCnt; x++) 
                {
                    var frame = cc.SpriteFrame.create(this.effectImage, cc.rect(this.imageWidth * 0, this.imageHeight * x, 
                    this.imageWidth, this.imageHeight));
                    frameSeqEffect2.push(frame);
                }
                //}
                this.wa = cc.Animation.create(frameSeqEffect2, 0.1);
                this.ra = cc.Repeat.create(cc.Animate.create(this.wa), 1);
                //this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
                this.attackAnimation = cc.Sprite.create(this.effectImage, cc.rect(0, 0, this.imageWidth, this.imageHeight));
                this.attackAnimation.runAction(this.ra);
                this.attackAnimation.setScale(0.8, 0.8);
                this.addChild(this.attackAnimation);
                break;
        }
    },
    update : function () 
    {
        this.effectTime++;
        if (this.effectTime <= 60 * 5) {
            return true;
        }
        this.removeChild(this.attackAnimation);
        return false;
    },
});