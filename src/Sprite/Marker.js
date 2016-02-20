//
//  Marker.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var Marker = cc.Node.extend(
{
    damages : [], damageEffecs : [], magicEffecs : [], 

    ctor : function (game, orderNum, columnNum, itemData, side, type) 
    {
        this._super();
        this.game = game;
        this.orderNum = orderNum;
        this.columnNum = columnNum;
        this.type = type;
        this.width = 106;
        this.height = 106;
        this.isEffect = false;
        this.effectCnt = 0;
        this.animalCnt = 0;
        //上
        if (this.type == 1) 
        {
            this.markerImage = res.Marker_Up_png;
        }
        //右
        if (this.type == 2) 
        {
            this.markerImage = res.Marker_Right_png;
        }
        //下
        if (this.type == 3) 
        {
            this.markerImage = res.Marker_Down_png;
        }
        //左
        if (this.type == 4) 
        {
            this.markerImage = res.Marker_Left_png;
        }
        //停止
        if (this.type == 5) 
        {
            this.markerImage = res.Marker_Stop_png;
        }
        //ジャンプ
        if (this.type == 6) 
        {
            this.markerImage = res.Marker_Jump_png;
        }
        this.charactorSpriteLv1 = cc.Sprite.create(this.markerImage);
        this.addChild(this.charactorSpriteLv1);

        //effect用のsprite
        var frameSeqEffect2= [];
        this.effectImage = res.Marker_Gauge_png;
        this.imageCnt    = 5;
        this.imageWidth  = 100;
        this.imageHeight = 100;
        for (var x = 0; x < this.imageCnt; x++) {
            var frame = cc.SpriteFrame.create(this.effectImage,cc.rect(this.imageWidth*x,0,this.imageWidth,this.imageHeight));
            frameSeqEffect2.push(frame);
        }
        this.wa = cc.Animation.create(frameSeqEffect2,0.1);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.effectAnimation = cc.Sprite.create(this.effectImage,cc.rect(0,0,this.imageWidth,this.imageHeight));
        this.effectAnimation.runAction(this.ra);
        this.effectAnimation.setScale(1,1);
        this.addChild(this.effectAnimation);
        this.effectAnimation.setVisible(false);

        //this.sigh = cc.LayerColor.create(new cc.Color(255, 0, 0, 255), 80, 80);
        //this.sigh.setPosition(0,0);
        //this.addChild(this.sigh,9999);
    },
    setStartPosition : function () 
    {
        this.posX = this.columnNum * this.width;
        this.posY = this.orderNum * this.height * - 1 + 680;
        this.setPosition(this.posX, this.posY);
    },

    moveToPosition : function (speed) 
    {
        this.posX = this.columnNum * this.width;
        this.posY = this.orderNum * this.height * - 1 + 680;
        this.game.baseNode.reorderChild( this, Math.floor(this.orderNum));
        this.walkSpeed = speed;
        if (this.getPosition().x < this.posX) 
        {
            if (Math.abs(this.getPosition().x - this.posX) > this.walkSpeed) {
                this.setPosition( this.getPosition().x + this.walkSpeed, this.getPosition().y );
            }
            else {
                this.setPosition( this.posX, this.getPosition().y );
            }
        }
        if (this.getPosition().x > this.posX) 
        {
            if (Math.abs(this.getPosition().x - this.posX) > this.walkSpeed) {
                this.setPosition( this.getPosition().x - this.walkSpeed, this.getPosition().y );
            }
            else {
                this.setPosition( this.posX, this.getPosition().y );
            }
        }
        if (this.getPosition().y < this.posY) 
        {
            if (Math.abs(this.getPosition().y - this.posY) > this.walkSpeed) {
                this.setPosition( this.getPosition().x, this.getPosition().y + this.walkSpeed );
            }
            else {
                this.setPosition( this.getPosition().x, this.posY );
            }
        }
        if (this.getPosition().y > this.posY) 
        {
            if (Math.abs(this.getPosition().y - this.posY) > this.walkSpeed) {
                this.setPosition( this.getPosition().x, this.getPosition().y - this.walkSpeed );
            }
            else {
                this.setPosition( this.getPosition().x, this.posY );
            }
        }
        if ((this.getPosition().x == this.posX) && (this.getPosition().y == this.posY)) {
            return true;
        }
        else {
            return false;
        }
    },

    update : function () 
    {
        if(this.isEffect == true)
        {
            this.effectAnimation.setVisible(true);
            this.effectCnt+=1;
            if(this.effectCnt>=15)
            {
                this.effectCnt = 0;
                this.isEffect = false;
            }
        }else{
            this.effectAnimation.setVisible(false);
        }

        if(this.game.isFeaver == true)
        {
            this.effectCnt = 0;
            this.isEffect = true;
        }

/*
        //自分をターゲットにしている動物が何匹いるかカウントする
        this.animalCnt = 0;
        for (var m = 0; m < this.game.animals.length; m++)
        {
            if(this.game.animals[m]._mostNearMarker == this)
            {
                this.animalCnt++;
            }
        }
*/
        return true;
    },

    remove : function () 
    {
        this.removeChild(this.markerSprite);
        //this.removeChild(this.shadow);
    },
});