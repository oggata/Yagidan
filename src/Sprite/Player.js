//
//  Player.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var Player = cc.Node.extend(
{
    markerCol01 : [], markerCol02 : [], markerCol03 : [], markerCol04 : [], markerCol05 : [], touchedMarkers : [], 
    ctor : function (game, code) 
    {
        this._super();
        this.game = game;
        this._markerArray = [];
        //initialize
        this.initializeParam(code);
        this.successCount = 0;
        this.failCount = 0;
        this.markerCol01 = [];
        this.markerCol02 = [];
        this.markerCol03 = [];
        this.markerCol04 = [];
        this.markerCol05 = [];
    },
    initializeParam : function (code) 
    {
        this.coin = 0;
    },

    setItemAndOrders : function () 
    {
        var itemData = [];
        //シャッフルする
        //itemData.sort(this.shuffle);
        //var this._markerArray = [];
        var _i = 0;
        for (var k = 1; k <= 5; k++) 
        {
            for (var i = 0; i <= 4; i++) 
            {
                var _typeId = this.game.cardsPos[_i];
                var _mk = new Marker(this.game, i, 1, itemData[0], 'player', _typeId);
                //var _mk = new Marker(this.game, i, 1, itemData[0], 'player', getRandNumberFromRange(1,5));
                //var _mk = new Marker(this.game, i, 1, itemData[0], 'player', 6);
                this._markerArray.push(_mk);
                this.game.baseNode.addChild(_mk, 100);
                _i++;
            }
        }
        this._markerArray.sort(this.shuffle);
        for (var i = 0; i <= 4; i++) {
            this.markerCol01.push(this._markerArray[i]);
        }
        for (var i = 5; i <= 9; i++) {
            this.markerCol02.push(this._markerArray[i]);
        }
        for (var i = 10; i <= 14; i++) {
            this.markerCol03.push(this._markerArray[i]);
        }
        for (var i = 15; i <= 19; i++) {
            this.markerCol04.push(this._markerArray[i]);
        }
        for (var i = 20; i <= 24; i++) {
            this.markerCol05.push(this._markerArray[i]);
        }

        this.setStartPosition();
    },

    update : function () 
    {
        
        if (this.markerCol01.length >= 1) 
        {
            for (var i = 0; i < this.markerCol01.length; i++) 
            {
                this.markerCol01[i].orderNum = i;
                this.markerCol01[i].columnNum = 1;
                if (this.markerCol01[i].update() == false) 
                {
                    this.game.baseNode.removeChild(this.markerCol01[i]);
                    this.markerCol01.splice(this.markerCol01[i].orderNum, 1);
                }
            }
        }
        if (this.markerCol02.length >= 1) 
        {
            for (var i = 0; i < this.markerCol02.length; i++) 
            {
                this.markerCol02[i].orderNum = i;
                this.markerCol02[i].columnNum = 2;
                if (this.markerCol02[i].update() == false) 
                {
                    this.game.baseNode.removeChild(this.markerCol02[i]);
                    this.markerCol02.splice(this.markerCol02[i].orderNum, 1);
                }
            }
        }
        if (this.markerCol03.length >= 1) 
        {
            for (var i = 0; i < this.markerCol03.length; i++) 
            {
                this.markerCol03[i].orderNum = i;
                this.markerCol03[i].columnNum = 3;
                if (this.markerCol03[i].update() == false) 
                {
                    this.game.baseNode.removeChild(this.markerCol03[i]);
                    this.markerCol03.splice(this.markerCol03[i].orderNum, 1);
                }
            }
        }
        if (this.markerCol04.length >= 1) 
        {
            for (var i = 0; i < this.markerCol04.length; i++) 
            {
                this.markerCol04[i].orderNum = i;
                this.markerCol04[i].columnNum = 4;
                if (this.markerCol04[i].update() == false) 
                {
                    this.game.baseNode.removeChild(this.markerCol04[i]);
                    this.markerCol04.splice(this.markerCol04[i].orderNum, 1);
                }
            }
        }
        if (this.markerCol05.length >= 1) 
        {
            for (var i = 0; i < this.markerCol05.length; i++) 
            {
                this.markerCol05[i].orderNum = i;
                this.markerCol05[i].columnNum = 5;
                if (this.markerCol05[i].update() == false) 
                {
                    this.game.baseNode.removeChild(this.markerCol05[i]);
                    this.markerCol05.splice(this.markerCol05[i].orderNum, 1);
                }
            }
        }

        if(this.failCount >= this.game.failCount)
        {
            return false;
        }

        return true;
    },

    setStartPosition : function () 
    {
        for (var i = 0; i < this.markerCol01.length; i++) 
        {
            this.markerCol01[i].orderNum = i;
            this.markerCol01[i].columnNum = 1;
            this.markerCol01[i].setStartPosition();
        }
        for (var i = 0; i < this.markerCol02.length; i++) 
        {
            this.markerCol02[i].orderNum = i;
            this.markerCol02[i].columnNum = 2;
            this.markerCol02[i].setStartPosition();
        }
        for (var i = 0; i < this.markerCol03.length; i++) 
        {
            this.markerCol03[i].orderNum = i;
            this.markerCol03[i].columnNum = 3;
            this.markerCol03[i].setStartPosition();
        }
        for (var i = 0; i < this.markerCol04.length; i++) 
        {
            this.markerCol04[i].orderNum = i;
            this.markerCol04[i].columnNum = 4;
            this.markerCol04[i].setStartPosition();
        }
        for (var i = 0; i < this.markerCol05.length; i++) 
        {
            this.markerCol05[i].orderNum = i;
            this.markerCol05[i].columnNum = 5;
            this.markerCol05[i].setStartPosition();
        }
    },

    moveToPosition : function () 
    {
        var speed = 40;
        var _rtn = true;
        for (var i = 0; i < this.markerCol01.length; i++) {
            if (this.markerCol01[i].moveToPosition(speed) == false) {
                _rtn = false;
            }
        }
        for (var i = 0; i < this.markerCol02.length; i++) {
            if (this.markerCol02[i].moveToPosition(speed) == false) {
                _rtn = false;
            }
        }
        for (var i = 0; i < this.markerCol03.length; i++) {
            if (this.markerCol03[i].moveToPosition(speed) == false) {
                _rtn = false;
            }
        }
        for (var i = 0; i < this.markerCol04.length; i++) {
            if (this.markerCol04[i].moveToPosition(speed) == false) {
                _rtn = false;
            }
        }
        for (var i = 0; i < this.markerCol05.length; i++) {
            if (this.markerCol05[i].moveToPosition(speed) == false) {
                _rtn = false;
            }
        }
        return _rtn;
    },

    shuffle : function () 
    {
        return Math.random() - .5 ;
    },
});