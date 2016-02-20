//
//  GameLayer.js
//  Yagidan
//
//  Created by Fumitoshi Ogata on 10/10/15.
//  Copyright (c) 2015 http://oggata.github.io All rights reserved.
//

var GameLayer = cc.Layer.extend(
{
    ctor : function (storage, stageNum) 
    {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.viewSize = cc.director.getVisibleSize();
        playBGM(storage);
        this.stageNum = stageNum;
        this.storage = storage;

        //conf
        var stageData = CONFIG.STAGE[stageNum];
        this.title = stageData['name'];
        this.detail = stageData['detail'];
        this.maxAnimalCnt = stageData['maxAnimalCount'];
        this.clearCount = stageData['clearCount'];
        this.failCount = stageData['failCount'];
        this.itemsPos = stageData['items'];
        this.enemiePos = stageData['enemies'];
        this.cardsPos = stageData['cards'];
        this.isFence = stageData['is_fence'];

        //init
        this.gameTime = 0;
        this.maxGameTime = 30 * 60 * 2;
        this.sumCombo = 0;
        this.score = 0;
        this.sumScore = 0;
        this.remainingTime = 30 * 60 * 2;
        this.cycleTime = 0;
        this.animals = [];
        this.enemies = [];
        this.effects = [];
        this.traps = [];
        this.buildings = [];
        this.items = [];
        this.itemCnt = 0;
        this.itemEffects = [];
        //this.isFeaver = false;
        //this.feaverTime = 0;
        //this.feaverMaxTime = 30 * 10;
        this.resultCnt = 0;
        //this.isStopGame = false;
        this.isSetting = false;

        this.item001IsOn = 0;
        this.item002IsOn = 0;
        this.item003IsOn = 0;
        this.item004IsOn = 0;
        this.item005IsOn = 0;

        //マップチップ
        this.mapChip = cc.Sprite.create( res.Floor_png );
        this.mapChip.setAnchorPoint(0, 0);
        this.addChild(this.mapChip);

        this.baseNode = cc.Node.create();
        this.baseNode.setPosition(0, 0);
        this.addChild(this.baseNode);
        
        this.escape = cc.Sprite.create(res.Escape_png);
        this.escape.setPosition(320, 850);
        this.baseNode.addChild(this.escape);

        //GetTouchEvent
        cc.eventManager.addListener(cc.EventListener.create( 
        {
            event : cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan : function (touches, event) 
            {
                var location = touches[0].getLocation();
                event.getCurrentTarget().touchStart(touches[0].getLocation());
            },
            onTouchesMoved : function (touches, event) 
            {
                var location = touches[0].getLocation();
                event.getCurrentTarget().touchMove(touches[0].getLocation());
            },
            onTouchesEnded : function (touches, event) 
            {
                event.getCurrentTarget().touchFinish(touches[0].getLocation());
            }
        }), this);

        //traps
        for (var i = 0; i < stageData['traps'].length; i++)
        {
            var position = this.getMarkerPositionByMarkerId(stageData['traps'][i]);
            this.addTrap(position[0], position[1]);
        }

        //building
        for (var i = 0; i < stageData['buildings'].length; i++)
        {
            var position = this.getMarkerPositionByMarkerId(stageData['buildings'][i]['pos']);
            this.addSwitch(position[0], position[1]);
        }

        //item
        for (var i = 0; i < this.itemsPos.length; i++)
        {
            var position = this.getMarkerPositionByMarkerId(this.itemsPos[i]['pos']);
            var itemID = this.itemsPos[i]['id'];
            this.addItem(position[0], position[1], itemID);
        }
        //enemy
        for (var i = 0; i < this.enemiePos.length; i++)
        {
            var position = this.getMarkerPositionByMarkerId(this.enemiePos[i]["route"][0]);
            this.addEnemy(position[0], position[1], this.enemiePos[i]["route"]);
        }
        this.player = new Player(this, "aaa");
        this.player.setPosition(0, 0);
        this.player.setItemAndOrders();

        //settingLayer
        this.setting = new Setting2(this,'game_layer');
        this.addChild(this.setting,99999);
        this.setting.setVisible(false);

        //header
        this.header = cc.Sprite.create( res.Header150_png );
        this.header.setPosition(320, this.viewSize.height - 150);
        this.header.setAnchorPoint(0.5,0);
        this.addChild(this.header);

        //stopButton
        var stopButton = new cc.MenuItemImage( res.Stop_Button_png, res.Stop_Button_On_png, function () 
        {
            this.setting.setVisible(true);
        }, this);
        stopButton.setAnchorPoint(0.5, 0.5);
        stopButton.setPosition(590, 90);
        var menu001 = new cc.Menu( stopButton );
        menu001.setPosition(0, 0);
        this.header.addChild(menu001);
        //時間
        this.timeLabel = cc.LabelTTF.create("00", "Arial", 40);
        this.timeLabel.setFontFillColor(new cc.Color(250, 250, 250, 255));
        this.timeLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.timeLabel.setPosition(53, 35 + 55);
        this.header.addChild(this.timeLabel);
        //カウントダウン用
        this.countDownTime = 0;
        this.countDownLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 255 * 0.8), 640, 1136);
        this.countDownLayer.setPosition(0, 0);
        this.addChild(this.countDownLayer);
        this.countDownLabel = cc.LabelTTF.create("X01", "Arial", 80);
        this.countDownLabel.setFontFillColor(new cc.Color(250, 250, 250, 255));
        this.countDownLabel.enableStroke(new cc.Color(0, 0, 0, 255), 2, false);
        this.countDownLabel.setPosition(320,480);
        this.countDownLayer.addChild(this.countDownLabel);
        //カットインを作成
        this.cutIn = new CutIn(this);
        this.addChild(this.cutIn);
        //タッチ用のボタン
        this.touchedMarker001 = cc.Sprite.create(res.Marker_Touched_png);
        this.baseNode.addChild(this.touchedMarker001, 999999);
        this.touchedMarker002 = cc.Sprite.create(res.Marker_Touched_png);
        this.baseNode.addChild(this.touchedMarker002, 999999);
        this.touchedMarker001.setPosition(-500, - 500);
        this.touchedMarker002.setPosition(-500, - 500);
        this.clearGauge = new Gauge(320, 30, 'blue');
        this.clearGauge.setAnchorPoint(0.5, 0.5);
        this.clearGauge.setPosition(640  / 2 + 20, 110);
        this.header.addChild(this.clearGauge);
        this.clearGaugeLabel = cc.LabelTTF.create("012234", "Arial", 22);
        this.clearGaugeLabel.setFontFillColor(new cc.Color(250, 250, 250, 255));
        this.clearGaugeLabel.setPosition(640  / 2 + 20, 110);
        this.header.addChild(this.clearGaugeLabel);
        this.failGauge = new Gauge(320, 15, 'red');
        this.failGauge.setAnchorPoint(0.5, 0.5);
        this.failGauge.setPosition(640  / 2 + 20, 80);
        this.header.addChild(this.failGauge);
        this.windowEffect001 = new WindowEffect(1);
        this.addChild(this.windowEffect001);
        this.windowEffect001.setVisible(false);
        this.windowEffect001Cnt = 0;
        this.windowEffect002 = new WindowEffect(2);
        this.addChild(this.windowEffect002);
        this.windowEffect002.setVisible(false);
        this.windowEffect002Cnt = 0;
        this.headerCover = cc.Sprite.create( res.Header_Cover_png );
        this.headerCover.setPosition(135,64);
        this.headerCover.setAnchorPoint(0,0);
        this.header.addChild(this.headerCover);
        //フェンスの設置
        this.fencePosX = 0;
        this.fence001 = cc.Sprite.create(res.Fence_001_png);
        this.baseNode.addChild(this.fence001);
        this.fence001.setAnchorPoint(0,0);
        this.fence001.setPosition(this.fencePosX,800-50);

        this.comboCnt = 0;
        this.comboTime = 0;
        this.comboLabel = cc.LabelTTF.create("5", "Arial", 37);
        this.comboLabel.setFontFillColor(new cc.Color(250, 250, 250, 255));
        this.comboLabel.enableStroke(new cc.Color(192, 192, 192, 255), 4, false);
        this.comboPng = cc.Sprite.create( res.Combo_png );
        this.comboPng.setPosition(10,-4);
        this.comboLabel.addChild(this.comboPng);
        this.addChild(this.comboLabel);
        this.comboLabel.setPosition(320,500)

        this.scheduleUpdate();
    },
    getReastAnimalCnt : function () 
    {
        if (Math.floor(this.clearCount - this.player.successCount) < 0) {
            return 0;
        }
        return Math.floor(this.clearCount - this.player.successCount);
    },
    addGoalEffect : function (posX, posY) 
    {
        this._magic = new PowerUpEffect(1);
        this._magic.setPosition(posX, posY);
        this.baseNode.addChild(this._magic);
        this.effects.push(this._magic);
    },
    addKillEffect : function (posX, posY) 
    {
        this._magic = new PowerUpEffect(2);
        this._magic.setPosition(posX, posY);
        this.baseNode.addChild(this._magic);
        this.effects.push(this._magic);
    },
    addItem : function (posX, posY, itemID) 
    {
        this.item = new Item(this,itemID)
        this.baseNode.addChild(this.item);
        this.item.setPosition(posX, posY);
        this.items.push(this.item);
    },
    addScore : function (score) 
    {
        this.score += score;
    },
    manageResult : function () 
    {
        this.storage.score = this.score;
        this.storage.starCount = this.itemCnt;
        if (this.player.update() == false) 
        {
            this.resultCnt++;
            if (this.resultCnt == 30 * 1) {
                this.setMessage(CONFIG.MESSAGE_GAME_OVER);
            }
            if (this.resultCnt == 30 * 2) {
                this.resultWindow = new ResultLost(this);
                this.addChild(this.resultWindow, 9999999);
            }
            if (this.resultCnt > 30 * 2) {
                this.resultWindow.update();
            }
            if (this.resultWindow) {
                this.resultWindow.update();
            }
            return true;
        };
        //Success
        //残り時間に寄らず成功にするように変更
        if (this.getReastAnimalCnt() == 0) 
        {
            this.resultCnt++;

            //ここでマップ上のヤギはすべて昇天させる.
            for (var i = 0; i < this.animals.length; i++)
            {
                this.animals[i].gameFinished();
                this.animals[i].update();
                this.baseNode.removeChild(this.animals[i]);
                this.animals.splice(i, 1);
            }

            //エフェクトのupdate
            for (var i = 0; i < this.effects.length; i++) 
            {
                this.effects[i].setPosition( this.effects[i].getPosition().x, this.effects[i].getPosition().y + 2 );
                if (this.effects[i].update() == false) {
                    this.baseNode.removeChild(this.effects[i]);
                    this.effects.splice(i, 1);
                }
            }

            if (this.resultCnt == 30 * 1) {
                this.setMessage(CONFIG.MESSAGE_STAGE_CLEAR);
            }
            if (this.resultCnt == 30 * 2) {
                this.resultWindow = new ResultWin(this);
                this.addChild(this.resultWindow, 9999999);
            }
            if (this.resultCnt > 30 * 2) {
                this.resultWindow.update();
            }
            if (this.resultWindow) {
                this.resultWindow.update();
            }
            return true;
        };
        //TimeUp
        if (this.remainingTime <= 0 && this.getReastAnimalCnt() != 0) 
        {
            this.resultCnt++;
            if (this.resultCnt == 30 * 1) {
                this.setMessage(CONFIG.MESSAGE_TIME_UP);
            }
            if (this.resultCnt == 30 * 2) {
                this.resultWindow = new ResultLost(this);
                this.addChild(this.resultWindow, 9999999);
            }
            if (this.resultCnt > 30 * 2) {
                this.resultWindow.update();
            }
            if (this.resultWindow) {
                this.resultWindow.update();
            }
            return true;
        };
        return false;
    },

    setCombo:function(posX,posY)
    {
        this.comboTime = 30 * 2;
        this.comboCnt += 1;
        this.comboLabel.setString(this.comboCnt + "");
        this.comboLabel.setPosition(posX,posY);
        //comboが5以上の場合は表示する
    },

    update : function (dt) 
    {

        this.comboTime-=1;
        if(this.comboTime <= 0)
        {
            this.comboTime = 0;
            this.comboCnt = 0;
        }
        if(this.comboCnt >= 2)
        {
            this.comboLabel.setVisible(true);

        }else{
            this.comboLabel.setVisible(false);
        }

        this.countDownTime+=1;
        if(1 <= this.countDownTime && this.countDownTime <= 60)
        {
            this.countDownLabel.setString("READY...");
            return;
        }
        if(61 <= this.countDownTime && this.countDownTime <= 90)
        {
            this.countDownLabel.setString("GO!!");
            return;
        }
        if(this.countDownTime >= 91)
        {
            this.countDownLayer.setVisible(false);
        }

        if(this.setting.isVisible() == true)
        {
            return;
        }

        //結果画面の制御
        if (this.manageResult() == true) {
            return;
        };
        this.setting.update();

        //残り時間の計測
        this.gameTime += 1;
        this.remainingTime = this.maxGameTime - this.gameTime;
        if (this.remainingTime < 0) {
            this.remainingTime = 0;
        }
        this.timeLabel.setString(Math.floor(this.remainingTime / 30));

        //window effect
        this.windowEffect001.update();
        this.windowEffect002.update();
        if (this.windowEffect001Cnt >= 1) 
        {
            this.windowEffect001Cnt += 1;
            this.windowEffect001.setVisible(true);
            if (this.windowEffect001Cnt >= 30) {
                this.windowEffect001Cnt = 0;
            }
        }
        else {
            this.windowEffect001.setVisible(false);
        }
        if (this.windowEffect002Cnt >= 1) 
        {
            this.windowEffect002Cnt += 1;
            this.windowEffect002.setVisible(true);
            if (this.windowEffect002Cnt >= 30) {
                this.windowEffect002Cnt = 0;
            }
        }
        else {
            this.windowEffect002.setVisible(false);
        }
        this.cutIn.update();
        for (var i = 0; i < this.effects.length; i++) 
        {
            this.effects[i].setPosition( this.effects[i].getPosition().x, this.effects[i].getPosition().y + 2 );
            if (this.effects[i].update() == false) {
                this.baseNode.removeChild(this.effects[i]);
                this.effects.splice(i, 1);
            }
        }
        //rate
        var _gaugeRate = this.player.successCount  / this.clearCount;
        if (_gaugeRate > 1) {
            _gaugeRate = 1;
        }
        this.clearGauge.update( _gaugeRate );
        this.clearGaugeLabel.setString(this.score);
        //fail rate
        var _failGaugeRate = this.player.failCount  / this.failCount;
        if (_failGaugeRate > 1) {
            _failGaugeRate = 1;
        }
        this.failGauge.update(_failGaugeRate);
        this.player.moveToPosition();
        //animals 死亡時の処理、Zソート
        for (var i = 0; i < this.animals.length; i++)
        {
            if (this.animals[i].update() == false) {
                this.baseNode.removeChild(this.animals[i]);
                this.animals.splice(i, 1);
            }
            else
            {
                this.baseNode.reorderChild( this.animals[i], Math.floor(10000 - this.animals[i].getPosition().y) );
            }
        }
        //enemies 死亡時の処理、Zソート
        for (var i = 0; i < this.enemies.length; i++)
        {
            if (this.enemies[i].update() == false) {
                this.baseNode.removeChild(this.enemies[i]);
                this.enemies.splice(i, 1);
            }
            else
            {
                this.baseNode.reorderChild( this.enemies[i], Math.floor(10000 - this.enemies[i].getPosition().y) );
            }
        }
        //Anima-Enemy
        for (var m = 0; m < this.animals.length; m++)
        {
            for (var n = 0; n < this.enemies.length; n++)
            {
                var dX = this.animals[m].getPosition().x - this.enemies[n].getPosition().x;
                var dY = this.animals[m].getPosition().y - this.enemies[n].getPosition().y;
                var dist = Math.sqrt(dX * dX + dY * dY);

                //ジャンプ時は無視する
                if(this.animals[m].walkingDirection == "jump") break;
                //アイテム有効時は無視する
                if(this.item003IsOn == 1) break;

                if (dist <= 40) 
                {
                    this.addKillEffect(this.animals[m].getPosition().x, this.animals[m].getPosition().y);
                    this.animals[m].hp = 0;
                    this.player.failCount += 1;
                    this.setMessage(CONFIG.MESSAGE_KILLED + " " + this.player.failCount + "匹Lost...");
                    this.windowEffect002Cnt = 1;
                    playSE_Fail(this.storage);
                    //return;
                }
            }
        }
        //Animal-Animal
        for (var m = 0; m < this.animals.length; m++)
        {
            for (var n = 0; n < this.animals.length; n++)
            {
                if (this.animals[m] != this.animals[n]) 
                {
                    var dX = this.animals[m].getPosition().x - this.animals[n].getPosition().x;
                    var dY = this.animals[m].getPosition().y - this.animals[n].getPosition().y;
                    var dist = Math.sqrt(dX * dX + dY * dY);
                    if (dist <= 30) 
                    {
                        this.animals[m].setPosition( this.animals[m].getPosition().x + dX / 5, this.animals[m].getPosition().y + dY / 5 );
                        this.animals[n].setPosition( this.animals[n].getPosition().x - dX / 5, this.animals[n].getPosition().y - dY / 5 );
                    }
                }
            }
        }

        //Animal-traps
        for (var m = 0; m < this.animals.length; m++)
        {
            for (var n = 0; n < this.traps.length; n++)
            {
                if (this.animals[m] != this.traps[n]) 
                {
                    var dX = this.animals[m].getPosition().x - this.traps[n].getPosition().x;
                    var dY = this.animals[m].getPosition().y - this.traps[n].getPosition().y;
                    var dist = Math.sqrt(dX * dX + dY * dY);

                    //ジャンプ時は無視する
                    if(this.animals[m].walkingDirection == "jump") return;

                    if (dist <= 106 / 2) 
                    {
                        this.animals[m].hp = 0;
                        this.player.failCount += 1;
                        this.setMessage(CONFIG.MESSAGE_FALLED + " " + this.player.failCount + "匹Lost...");
                        this.windowEffect002Cnt = 1;
                        playSE_Fail(this.storage);
                        //return;
                    }
                }
            }
        }

        //BuildingにAnimalが何個乗っているか
        for (var n = 0; n < this.buildings.length; n++)
        {
            this.buildings[n].pushAnimalCnt = 0;
            for (var m = 0; m < this.animals.length; m++)
            {
                var dX = this.animals[m].getPosition().x - this.buildings[n].getPosition().x;
                var dY = this.animals[m].getPosition().y - this.buildings[n].getPosition().y;
                var dist = Math.sqrt(dX * dX + dY * dY);
                if (dist <= 106 / 2) 
                {
                    this.buildings[n].pushAnimalCnt+=1;
                }
            }
        }

        //itemEffects
        this.item001IsOn = 0;
        this.item002IsOn = 0;
        this.item003IsOn = 0;
        this.item004IsOn = 0;
        this.item005IsOn = 0;
        for (var m = 0; m < this.itemEffects.length; m++)
        {
            if(this.itemEffects[m].update() == false)
            {
                this.baseNode.removeChild(this.itemEffects[m]);
                this.itemEffects.splice(m, 1);
            }else{
                //並べる
                this.itemEffects[m].setPosition(80 + 60*m,150);
            }   
        }

        //Animal-Item
        for (var m = 0; m < this.animals.length; m++)
        {
            for (var n = 0; n < this.items.length; n++)
            {
                if (this.animals[m] != this.items[n]) 
                {
                    var dX = this.animals[m].getPosition().x - this.items[n].getPosition().x;
                    var dY = this.animals[m].getPosition().y - this.items[n].getPosition().y;
                    var dist = Math.sqrt(dX * dX + dY * dY);
                    if (dist <= 106 / 2) 
                    {
                        this.setMessage(this.items[n].getMessage());
                        var _itemEffect = new ItemEffect(this,this.items[n].itemID);
                        this.itemEffects.push(_itemEffect);
                        this.baseNode.addChild(_itemEffect);
                        //this.item.setPosition(posX, posY);
                        
                        //削除
                        this.baseNode.removeChild(this.items[n]);
                        this.items.splice(n, 1);
                        this.itemCnt += 1;
                        playSE_Item(this.storage);
                        //return;
                    }
                }
            }
        }

        //Animal-Fence
        for (var m = 0; m < this.animals.length; m++)
        {
            if((this.fence001.getPosition().y < this.animals[m].getPosition().y)
                && (this.fence001.getPosition().x < this.animals[m].getPosition().x))
            {
                this.animals[m].setPosition( 
                    this.animals[m].getPosition().x, 
                    this.animals[m].getPosition().y - 10
                );
            }
        }

        //フェンス解放の処理
        var _gatePushAnimalCnt = 0;
        for (var n = 0; n < this.buildings.length; n++)
        {
            _gatePushAnimalCnt += this.buildings[n].pushAnimalCnt;
        }
        if(_gatePushAnimalCnt>=1){this.fencePosX = 640 * 1/4}
        if(_gatePushAnimalCnt>=3){this.fencePosX = 640 * 2/4}
        if(_gatePushAnimalCnt>=5){this.fencePosX = 640 * 3/4}
        if(_gatePushAnimalCnt>=8){this.fencePosX = 640 * 4/4}
        if(this.fencePosX > this.fence001.getPosition().x)
        {
            this.fence001.setPosition(this.fence001.getPosition().x + 10,800-50);
        }
        if(this.fencePosX < this.fence001.getPosition().x)
        {
            this.fence001.setPosition(this.fence001.getPosition().x - 10,800-50);
        }
        //フェンス無効化
        if(this.isFence == 0)
        {
            this.fencePosX = 640;
        }

        //1秒に1匹ずつ増やす
        this.cycleTime += 1;
        if (this.cycleTime >= 30 * 1.5) 
        {
            if(this.item002IsOn == 1)
            {
                if (this.animals.length < this.maxAnimalCnt * 1.5) {
                    this.cycleTime = 0;
                    this.addAnimal(getRandNumberFromRange(100, 580), 50);
                    this.addAnimal(getRandNumberFromRange(100, 580), 50);
                }
            }else{
                if (this.animals.length < this.maxAnimalCnt) {
                    this.cycleTime = 0;
                    this.addAnimal(getRandNumberFromRange(100, 580), 50);
                }   
            }
        }
    },
    getMarkerPositionByMarkerId : function (markerId) 
    {
        var row = Math.floor((markerId - 1)  / 5);
        var col = markerId - ( row * 5 );
        return this.getMarkerPosition(col, row);
    },
    getMarkerPosition : function (columnNum, orderNum) 
    {
        this.posX = columnNum * 106;
        this.posY = orderNum * 106 * - 1 + 580 + 100;
        return [this.posX, this.posY];
    },
    addAnimal : function (posX, posY)
    {
        this.animal = new Animal(this);
        this.baseNode.addChild(this.animal, 999);
        this.animal.setPosition(posX, posY);
        this.animals.push(this.animal);
    },
    addEnemy : function (posX, posY, route)
    {
        this.enemy = new Enemy(this, route);
        this.baseNode.addChild(this.enemy, 999);
        this.enemy.setPosition(posX, posY);
        this.enemies.push(this.enemy);
    },
    addTrap : function (posX, posY)
    {
        this.trap = new Building(this);
        this.baseNode.addChild(this.trap);
        this.trap.setPosition(posX, posY);
        this.traps.push(this.trap);
    },
    addSwitch : function (posX, posY)
    {
        this.swich = new Switch(this);
        this.baseNode.addChild(this.swich);
        this.swich.setPosition(posX, posY);
        this.buildings.push(this.swich);
    },
    setMessage : function (msg) 
    {
        this.cutIn.setCutInText(msg);
    },
    touchStart : function (location) 
    {
        playSE_Rotate(this.storage);
        this.tmpTouchStartX = location.x;
        this.tmpTouchStartY = location.y;
        this.tmpMovedFlg = 0;
        this.markerWidth = 106;
        this.tmpTouchedMarker = "";
        this.tmpTouchedMarker2 = "";
        for (var i = 0; i < this.player.markerCol01.length; i++) 
        {
            if (this.player.markerCol01[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol01[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol01[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol01[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker = this.player.markerCol01[i];
            }
        }
        for (var i = 0; i < this.player.markerCol02.length; i++) 
        {
            if (this.player.markerCol02[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol02[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol02[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol02[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker = this.player.markerCol02[i];
            }
        }
        for (var i = 0; i < this.player.markerCol03.length; i++) 
        {
            if (this.player.markerCol03[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol03[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol03[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol03[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker = this.player.markerCol03[i];
            }
        }
        for (var i = 0; i < this.player.markerCol04.length; i++) 
        {
            if (this.player.markerCol04[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol04[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol04[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol04[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker = this.player.markerCol04[i];
            }
        }
        for (var i = 0; i < this.player.markerCol05.length; i++) 
        {
            if (this.player.markerCol05[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol05[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol05[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol05[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker = this.player.markerCol05[i];
            }
        }
        if (this.tmpTouchedMarker) 
        {
            this.touchedMarker001.setPosition( this.tmpTouchedMarker.getPosition().x, this.tmpTouchedMarker.getPosition().y );
        }
    },
    touchMove : function (location) 
    {
        this.tmpTouchedMarker2 = "";
        for (var i = 0; i < this.player.markerCol01.length; i++) 
        {
            if (this.player.markerCol01[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol01[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol01[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol01[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol01[i];
            }
        }
        for (var i = 0; i < this.player.markerCol02.length; i++) 
        {
            if (this.player.markerCol02[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol02[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol02[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol02[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol02[i];
            }
        }
        for (var i = 0; i < this.player.markerCol03.length; i++) 
        {
            if (this.player.markerCol03[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol03[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol03[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol03[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol03[i];
            }
        }
        for (var i = 0; i < this.player.markerCol04.length; i++) 
        {
            if (this.player.markerCol04[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol04[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol04[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol04[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol04[i];
            }
        }
        for (var i = 0; i < this.player.markerCol05.length; i++) 
        {
            if (this.player.markerCol05[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol05[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol05[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol05[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol05[i];
            }
        }
        if (this.tmpTouchedMarker2) 
        {
            this.touchedMarker002.setPosition( this.tmpTouchedMarker2.getPosition().x, this.tmpTouchedMarker2.getPosition().y );
        }
    },
    touchFinish : function (location) 
    {
        if (this.tmpTouchedMarker == "") {
            return;
        }
        playSE_Rotate(this.storage);
        for (var i = 0; i < this.player.markerCol01.length; i++) 
        {
            if (this.player.markerCol01[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol01[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol01[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol01[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol01[i];
            }
        }
        for (var i = 0; i < this.player.markerCol02.length; i++) 
        {
            if (this.player.markerCol02[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol02[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol02[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol02[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol02[i];
            }
        }
        for (var i = 0; i < this.player.markerCol03.length; i++) 
        {
            if (this.player.markerCol03[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol03[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol03[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol03[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol03[i];
            }
        }
        for (var i = 0; i < this.player.markerCol04.length; i++) 
        {
            if (this.player.markerCol04[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol04[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol04[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol04[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol04[i];
            }
        }
        for (var i = 0; i < this.player.markerCol05.length; i++) 
        {
            if (this.player.markerCol05[i].getPosition().x - this.markerWidth / 2 <= location.x && location.x <= this.player.markerCol05[i].getPosition().x + this.markerWidth / 2 && this.player.markerCol05[i].getPosition().y - this.markerWidth / 2 <= location.y && location.y <= this.player.markerCol05[i].getPosition().y + this.markerWidth / 2 ) {
                this.tmpTouchedMarker2 = this.player.markerCol05[i];
            }
        }
        if (this.tmpTouchedMarker) 
        {
            if (this.tmpTouchedMarker2)
            {
                this.tmpTouchedMarker.isEffect = true;
                this.tmpTouchedMarker2.isEffect = true;
                eval("this._tmp001 = this.player.markerCol0" + this.tmpTouchedMarker.columnNum + "[" + this.tmpTouchedMarker.orderNum + "]");
                eval("this._tmp002 = this.player.markerCol0" + this.tmpTouchedMarker2.columnNum + "[" + this.tmpTouchedMarker2.orderNum + "]");
                eval("this.player.markerCol0" + this.tmpTouchedMarker.columnNum + "[" + this.tmpTouchedMarker.orderNum + "] = this._tmp002");
                eval("this.player.markerCol0" + this.tmpTouchedMarker2.columnNum + "[" + this.tmpTouchedMarker2.orderNum + "] = this._tmp001");
            }
        }
        this.touchedMarker001.setPosition(-500, - 500);
        this.touchedMarker002.setPosition(-500, - 500);
        //this.touchedMarker003.setPosition(-500,-500);
    },
    shuffle : function () 
    {
        return Math.random() - .5 ;
    },
    isMarkerContinue : function (marker1, marker2) 
    {
        if ((Math.abs(marker1.orderNum - marker2.orderNum) <= 1) && (Math.abs(marker1.columnNum - marker2.columnNum) <= 1)) {
            return 1;
        }
        return 0;
    },
    //シーンの切り替え----->
    goToTopLayer : function (pSender) 
    {
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(StageLayer.create(this.storage));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },
    //シーンの切り替え----->
    retryGameLayer : function (pSender) 
    {
        //this.stageNum = 1;
        var scene = cc.Scene.create();
        //次のステージへいくためにstorageは必ず受けた渡す
        scene.addChild(GameLayer.create(this.storage, this.stageNum));
        cc.director.runScene(cc.TransitionFade.create(1.5, scene));
    },

    /*
    stopGame : function () 
    {
        if (this.isStopGame == true) {
            this.isStopGame = false;
        }
        else {
            this.isStopGame = true;
        }
    },*/
});
var getRandNumberFromRange = function (min, max) 
{
    var rand = min + Math.floor( Math.random() * (max - min));
    return rand;
};
GameLayer.create = function (storage, stageNum) 
{
    return new GameLayer(storage, stageNum);
};
var GameLayerScene = cc.Scene.extend({
    onEnter : function () 
    {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});