//
//  Animal.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var Animal = cc.Node.extend(
{
    ctor : function (game) 
    {
        this._super();
        this.game = game;
        this.hp = 100;
        this.maxHp = 100;
        //image
        this.image = res.Animal_png;
        this.imgWidth = 192 / 3;
        this.imgHeight = 350 / 4;
        //init
        this.direction = "front";
        this.walkingDirection = "up";
        this.tmpWalkingDirection = "up";
        this.initializeWalkAnimation();
        this._mostNearMarker = null;
        this._mostNearDistance = 99999;

        this.isGoal = 0;
        this.isFailed = 0;
        this.targetRefreshTime = 0;
        this.walkSpeed = 0.8;
        this.jumpDistance = 0;
        this.spriteScale = 0.8;
        this.spriteScaleAddNum = 0.1
        //this.sigh = cc.LayerColor.create(new cc.Color(0, 0, 0, 255), 80, 80);
        //this.sigh.setPosition(0,0);
        //this.addChild(this.sigh,9999);
    },
    init : function () { },

    gameFinished : function(){
        //playSE_Sheep(this.game.storage);
        this.isGoal = 1;
        this.game.player.successCount += 1;
        this.game.addScore(1);
        this.game.addGoalEffect(this.getPosition().x, this.getPosition().y);
        //this.game.windowEffect001Cnt = 1;
    },

    update : function () 
    {
        //1秒に1回、ターゲットを取得する
        this.targetRefreshTime += 1;
        if (this.targetRefreshTime >= 30) 
        {
            this.targetRefreshTime = 0;
            this._mostNearMarker = null;
            this._mostNearDistance = 9999;
            for (var i = 0; i < this.game.player._markerArray.length; i++) 
            {
                var dX = this.game.player._markerArray[i].getPosition().x - this.getPosition().x;
                var dY = this.game.player._markerArray[i].getPosition().y - this.getPosition().y;
                var dist = Math.sqrt(dX * dX + dY * dY);
                //最も近い距離で、なおかつ100以内のマーカーが対象
                if ( dist <= this._mostNearDistance && dist <= 75) 
                {
                    this._mostNearDistance = dist;
                    this._mostNearMarker = this.game.player._markerArray[i];
                    this._tmpMostNearMarke = this.game.player._markerArray[i];
                }
            }
        }
        if (this._mostNearMarker && this.walkingDirection != "jump") 
        {
            if (this._mostNearMarker.type == 1) {
                this.walkingDirection = "up";
            }
            if (this._mostNearMarker.type == 2) {
                this.walkingDirection = "right";
            }
            if (this._mostNearMarker.type == 3) {
                this.walkingDirection = "down";
            }
            if (this._mostNearMarker.type == 4) {
                this.walkingDirection = "left";
            }
            if (this._mostNearMarker.type == 5) {
                this.walkingDirection = "stop";
            }
            if (this._mostNearMarker.type == 6) {
                this.tmpWalkingDirection = this.walkingDirection;
                this.walkingDirection = "jump";
            }
            
            //マーカーを移動直後
            if (this._mostNearMarker.isEffect == true) {
                this.walkSpeed = 1.2;
            }
            else {
                this.walkSpeed = 0.8;
            }
        }
        else {
            this.walkSpeed = 0.8;
        }
        /*
        if (this.game.isFeaver == true) {
            this.walkSpeed = 2;
        }*/
        //アイテムによる効果
        //スピードアップ
        if(this.game.item001IsOn == 1)
        {
            this.walkSpeed = 2;
        }
        //透明になる
        if(this.game.item003IsOn == 1)
        {
            this.sprite.setOpacity(0.5 * 255);
        }else{
            this.sprite.setOpacity(1 * 255);
        }
        if (this.walkingDirection == "up") {
            this.moveToUp(this.walkSpeed, this._tmpMostNearMarke);
        }
        if (this.walkingDirection == "right") {
            this.moveToRight(this.walkSpeed, this._tmpMostNearMarke);
        }
        if (this.walkingDirection == "down") {
            this.moveToDown(this.walkSpeed, this._tmpMostNearMarke);
        }
        if (this.walkingDirection == "left") {
            this.moveToLeft(this.walkSpeed, this._tmpMostNearMarke);
        }
        if (this.walkingDirection == "stop") 
        {
            if (this._mostNearMarker) {
                this.moveToTarget(this._mostNearMarker, this.walkSpeed, 5);
            }
        }
        if (this.walkingDirection == "jump") 
        {
            if (this._mostNearMarker) {
                this.moveToTargetAndJump(this._mostNearMarker, this.walkSpeed, 15);
            }
        }
        /*範囲から外れたらfalseにする*/
        if ((this.getPosition().x <= 0) || (this.getPosition().x >= 320 * 2)) 
        {
            //アイテムの効果があるときは免除される
            if (this.game.item004IsOn == 0 && this.isFailed == 0) 
            {
                this.isFailed = 1;
                this.game.player.failCount += 1;
                this.game.setMessage(CONFIG.MESSAGE_LOST_WAY + this.game.player.failCount + "匹ロスト..");
                this.game.windowEffect002Cnt = 1;
                playSE_Fail(this.game.storage);
            }
            return false;
        }
        if (this.getPosition().y <= 0) 
        {
            if (this.game.item004IsOn == 0 && this.isFailed == 0) 
            {
                this.isFailed = 1;
                this.game.player.failCount += 1;
                this.game.setMessage(CONFIG.MESSAGE_LOST_WAY + this.game.player.failCount + "匹ロスト..");
                this.game.windowEffect002Cnt = 1;
                playSE_Fail(this.game.storage);
            }
            return false;
        }

        //Escapeゾーンとhitしたものは成功とみなす
        if (this.getPosition().y >= this.game.escape.getPosition().y) 
        {
            if (this.isGoal == 0) 
            {
                this.game.setCombo(this.getPosition().x,this.getPosition().y);

                playSE_Sheep(this.game.storage);
                this.isGoal = 1;
                this.game.player.successCount += 1;
                if (this.game.getReastAnimalCnt() == 0) {
                    this.game.setMessage("成功! あと" + 　this.game.player.successCount + "匹.");
                }
                else {
                    this.game.setMessage("成功! あと" + 　this.game.getReastAnimalCnt() + "匹.");
                }
                this.game.addScore(1);
                this.game.sumCombo += this.game.comboCnt;
                this.game.addGoalEffect(this.getPosition().x, this.getPosition().y);
                this.game.windowEffect001Cnt = 1;
            }
            return false;
        }
        if (this.hp <= 0) {
            return false;
        }
        return true;
    },
    remove : function () 
    {
        this.removeChild(this.sprite);
    },
    getDirection : function ()
    {
        return this.direction;
    },
    initializeWalkAnimation : function ()
    {
        var frameSeq = [];
        for (var i = 0; i < 3; i++) 
        {
            var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 0, 
            this.imgWidth, this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq, 0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image, cc.rect(0, 0, this.imgWidth, this.imgHeight));
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);
        this.sprite.setScale(0.8, 0.8);
    },
    setDirection : function (targetSprite)
    {
        var diffX = Math.floor(targetSprite.getPosition().x - this.getPosition().x);
        var diffY = Math.floor(targetSprite.getPosition().y - this.getPosition().y);
        if (diffX > 0 && diffY > 0) {
            this.walkDown();
        }
        if (diffX > 0 && diffY < 0) {
            this.walkRight();
        }
        if (diffX < 0 && diffY > 0) {
            this.walkUp();
        }
        if (diffX < 0 && diffY < 0) {
            this.walkLeft();
        }
    },
    moveToTarget : function (object, speed, targetDist) 
    {
        var dX = object.getPosition().x - this.getPosition().x;
        var dY = object.getPosition().y - this.getPosition().y;
        var dist = Math.sqrt(dX * dX + dY * dY);
        if ( dist > targetDist ) 
        {
            var rad = Math.atan2(dX, dY);
            var speedX = speed * Math.sin(rad);
            var speedY = speed * Math.cos(rad);
            this.setPosition( this.getPosition().x + speedX, this.getPosition().y + speedY );
        }
    },
    moveToTargetAndJump : function (object, speed, targetDist) 
    {
        var dX = object.getPosition().x - this.getPosition().x;
        var dY = object.getPosition().y - this.getPosition().y;
        var dist = Math.sqrt(dX * dX + dY * dY);
        if ( dist > targetDist && this.jumpDistance == 0) 
        {
            var rad = Math.atan2(dX, dY);
            var speedX = speed * Math.sin(rad);
            var speedY = speed * Math.cos(rad);
            this.setPosition( this.getPosition().x + speedX, this.getPosition().y + speedY );
            this.jumpDistance = 0;
        }else{
            var _jumpDistance = 10;
            this.jumpDistance += _jumpDistance;

            if(this.spriteScale > 1.8)
            {
                this.spriteScaleAddNum = -0.1;
            }
            if(this.spriteScale < 0.8)
            {
                this.spriteScaleAddNum = 0.1;
            }
            this.spriteScale += this.spriteScaleAddNum;
            this.sprite.setScale(this.spriteScale,this.spriteScale); 

            if(this.direction == "back")
            {
                this.setPosition( this.getPosition().x, this.getPosition().y + _jumpDistance );
            }
            if(this.direction == "right")
            {
                this.setPosition( this.getPosition().x + _jumpDistance, this.getPosition().y );
            }
            if(this.direction == "front")
            {
                this.setPosition( this.getPosition().x, this.getPosition().y - _jumpDistance );
            }
            if(this.direction == "left")
            {
                this.setPosition( this.getPosition().x - _jumpDistance, this.getPosition().y );
            }
            if(this.jumpDistance >= 200)
            {
                this.walkingDirection = this.tmpWalkingDirection;
                this.jumpDistance = 0;
                this.spriteScale = 0.8;
                this.spriteScaleAddNum = 0.1;
                this._mostNearMarker = null;
                this.sprite.setScale(this.spriteScale,this.spriteScale); 
            }
        }
    },
    moveToRight : function (speed, target) 
    {
        var _ySPeed = 0;
        if (target)
        {
            var dY = target.getPosition().y - this.getPosition().y;
            if (dY >= 20) {
                _ySPeed = speed;
            }
            if (dY <= - 20) {
                _ySPeed = speed * - 1;
            }
        }
        this.setPosition( this.getPosition().x + speed, this.getPosition().y + _ySPeed );
        this.walkRight();
    },
    moveToLeft : function (speed, target) 
    {
        var _ySPeed = 0;
        if (target)
        {
            var dY = target.getPosition().y - this.getPosition().y;
            if (dY >= 20) {
                _ySPeed = speed;
            }
            if (dY <= - 20) {
                _ySPeed = speed * - 1;
            }
        }
        this.setPosition( this.getPosition().x - speed, this.getPosition().y + _ySPeed );
        this.walkLeft();
    },
    moveToUp : function (speed, target) 
    {
        var _xSPeed = 0;
        if (target)
        {
            var dX = target.getPosition().x - this.getPosition().x;
            if (dX >= 20) {
                _xSPeed = speed;
            }
            if (dX <= - 20) {
                _xSPeed = speed * - 1;
            }
        }
        this.setPosition( this.getPosition().x + _xSPeed, this.getPosition().y + speed );
        this.walkBack();
    },
    moveToDown : function (speed, target) 
    {
        var _xSPeed = 0;
        if (target) 
        {
            var dX = target.getPosition().x - this.getPosition().x;
            if (dX >= 20) {
                _xSPeed = speed;
            }
            if (dX <= - 20) {
                _xSPeed = speed * - 1;
            }
        }
        this.setPosition( this.getPosition().x + _xSPeed, this.getPosition().y - speed);
        this.walkFront();
    },
    walkFront : function ()
    {
        if (this.direction != "front")
        {
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) 
            {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 0, 
                this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkLeft : function ()
    {
        if (this.direction != "left")
        {
            this.direction = "left";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) 
            {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 1, 
                this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkRight : function ()
    {
        if (this.direction != "right")
        {
            this.direction = "right";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) 
            {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 2, 
                this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
    walkBack : function ()
    {
        if (this.direction != "back")
        {
            this.direction = "back";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) 
            {
                var frame = cc.SpriteFrame.create(this.image, cc.rect(this.imgWidth * i, this.imgHeight * 3, 
                this.imgWidth, this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq, 0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
});