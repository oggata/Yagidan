//
//  Enemy.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var Enemy = cc.Node.extend({

    ctor:function (game,route) {
        this._super();
        this.game             = game;

        this.hp = 100;
        this.maxHp = 100;
        //image
        this.image             = res.Enemy_png;
        this.imgWidth          = 192/3; 
        this.imgHeight         = 350/4;

        //init
        this.direction         = "front";
        this.initializeWalkAnimation();
        this.route = route;
        this.routeOrder = 0;
        this.directionCnt = 0;

        this.beforeX = 0;
        this.beforeY = 0;
    },
    
    init:function () {
    },

    update:function() {
        //経路を設定
        this.targetRouteNum = this.route[this.routeOrder];
        var position = this.game.getMarkerPositionByMarkerId(this.targetRouteNum);

        //距離を測る
        var dX = position[0] - this.getPosition().x;
        var dY = position[1] - this.getPosition().y;
        var dist = Math.sqrt(dX * dX + dY * dY);
        if(dist <= 15)
        {
            this.routeOrder+=1;
            if(this.routeOrder >= this.route.length)
            {
                this.routeOrder = 0;
            }
        }

        //移動
        this.moveToTarget(position[0],position[1],0.5,10);

        //方向制御
        this.directionCnt++;
        if(this.directionCnt >= 5){
            this.directionCnt = 0;
            this.setDirection(this.getPosition().x,this.getPosition().y,this.beforeX,this.beforeY);
            this.beforeX = this.getPosition().x;
            this.beforeY = this.getPosition().y;
        }

        return true;
    },

    remove:function() {
        this.removeChild(this.sprite);
    },
    
    getDirection:function(){
        return this.direction;
    },

    initializeWalkAnimation:function(){        
        var frameSeq = [];
        for (var i = 0; i < 3; i++) {
            var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.image,cc.rect(0,0,this.imgWidth,this.imgHeight));
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);
    },

    setDirection:function(posX,posY,tmpPosX,tmpPosY){
        var diffX = Math.floor(posX - tmpPosX);
        var diffY = Math.floor(posY - tmpPosY);

        var distX = Math.abs(diffX);
        var distY = Math.abs(diffY);
        if(distX > distY)
        {
            if(diffX > 0)
            {
                this.walkRight();
            }else{
                this.walkLeft();
            }
        }else{
            if(diffY > 0)
            {
                this.walkBack();
            }else{
                this.walkFront();
            }
        }
    },

    moveToTarget : function (distX, distY, speed, targetDist) 
    {
        var dX = distX - this.getPosition().x;
        var dY = distY - this.getPosition().y;
        var dist = Math.sqrt(dX * dX + dY * dY);
        if ( dist > targetDist ) 
        {
            var rad = Math.atan2(dX, dY);
            var speedX = speed * Math.sin(rad);
            var speedY = speed * Math.cos(rad);
            this.setPosition( this.getPosition().x + speedX, this.getPosition().y + speedY );
        }
    },

    walkFront:function(){
        if(this.direction != "front"){
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkLeft:function(){
        if(this.direction != "left"){
            this.direction = "left";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*1,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkRight:function(){
        if(this.direction != "right"){
            this.direction = "right";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*2,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkBack:function(){
        if(this.direction != "back"){
            this.direction = "back";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.image,cc.rect(this.imgWidth*i,this.imgHeight*3,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
});