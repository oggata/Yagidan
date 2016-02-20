//
//  DamageText.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var DamageText = cc.Node.extend({
    ctor:function (damageText) {
        this._super();
        this.effectTime     = 0;
        this.dx             = 0;
        this.dy             = 0.8;

        this._damage = cc.LabelTTF.create(damageText,"Arial",55);
        this._damage.setFontFillColor(new cc.Color(255,0,0,255));
        this._damage.setAnchorPoint(0.5,0);
        this._damage.enableStroke(new cc.Color(0,0,0,255),5,false);
        this.addChild(this._damage);

        //var randX = getRandNumberFromRange(-80,80);
        //var randY = getRandNumberFromRange(-80,80);
        //this.setPosition(randX,randY);
        this.setPosition(0,0);
    },

    update:function() {
        this.effectTime++;
        if(this.effectTime<=60*2){
            var pp = this.getPosition();
            this.setPosition(pp.x + this.dx,pp.y + this.dy);
            return true;
        }
        //this.removeChild(this.comicText);
        this.removeChild(this._damage);
        return false;
    },

    set_text:function(text){
        this.damageNumLabel.setString(text);
    },

    remove:function(){
        this.removeChild(this._damage);
    }
});
