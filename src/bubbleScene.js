/**
 * Created by hu on 2015/11/18.
 */


var BubbleLayer = cc.Layer.extend({
    fireBubble:null,
    waitBubble:null,
    shooter:null,
    bubblesArr:[],

    //����ײ������
    collisionBuArr:[],

    //������ȴ
    flyCold:false,

    ctor:function () {
        this._super();
        var bubbleBg=new cc.Sprite(res.gameBg_jpg);
        bubbleBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bubbleBg);
        this.createShooter(); //��̨
        this.createShootBubble(); //�������
        this.createReadyBubble(); //Ԥ������
        this.addBubble();
        this.checkAllBubbles();
        this.addEventListener();
        this.scheduleUpdate();  //��ʱ�� Ĭ�Ϻ�����update
        return true;
    },
    onExit:function(){
        this.unscheduleUpdate(); //���
    },

    checkAllBubbles:function(){
        //�������
        this.collisionBuArr.splice(0,this.collisionBuArr.length);
        for(var i=0;i<game.MaxRow;++i){
            next:for(var j=0;j<game.MaxCol;++j){
                var bReach=false;
                var bubble=this.bubblesArr[i][j];
                if(bubble){
                    for(var k=0;k<6;++k){
                        var pos=bubble.getRoundPos(k);
                        if(pos){
                            if(!this.bubblesArr[pos[0]][pos[1]]){
                                bReach=true;
                                this.collisionBuArr.push(bubble);
                                continue next;
                            }
                        }
                    }
                }
            }
        }
    },

    //���п�ʼ������ȴ
    flyBegin:function(pos){
        if(!this.flyCold){
            this.flyCold=true;
            this.fireBubble.fly(pos);
        }
    },

    //���н�����
    flyEnd:function(){
        this.fireBubble=this.waitBubble;  //���ݻ�
        this.waitBubble.setPosition(game.Shoot_Pos.x,game.Shoot_Pos.y);

        this.createReadyBubble();
        //��ȴ����һ��
        this.flyCold=false;
    },

    //�����ж��Ƿ�ֹͣ��
    update:function(dt){
        if(this.fireBubble&&this.fireBubble.isMoving){
            //this.fireBubble.update();
            var hasStop=this.fireBubble.update();
            if(hasStop){
                this.flyEnd();
                this.bubblesArr[this.fireBubble.myRow][this.fireBubble.myCol];
            }
            this.checkCollision(this.fireBubble);
        }
    },

    checkCollision:function(flyBubble){
        for(var i=0;i<this.collisionBuArr.length;++i){
            var checkBubble=this.collisionBuArr[i];
            if(checkBubble){
                var r=game.circleCollision({x:flyBubble.x,y:flyBubble.y},{x:checkBubble.x,y:checkBubble.y},game.BubbleD/2,game.BubbleD/2);
                if(r){
                    flyBubble.stopFly();
                    this.flyEnd();
                    this.checkBubNewPos(flyBubble);
                    this.checkAllBubbles();
                    r=true;
                    break;
                }
            }
        }
        return r;
    },
    //��������
    checkBubNewPos:function(bubble){
        //������ȷ������
        var row=parseInt((game.Bound.TOP+game.BubbleD/2-bubble.y)/game.BubbleD);

        var offset=row%2? -game.BubbleD/2 : 0;
        var dx=bubble.x-game.Bound.LEFT+offset;
        var col;
        if(dx<0){
            col=0;
        }else if(dx>game.BubbleD*game.MaxCol){
            col=game.MaxCol;
        }else{
            col=Math.round(dx/game.BubbleD);
        }
        bubble.myRow=row;
        bubble.myCol=col;

        //����������������
        var offset=row%2?game.BubbleD/2:0;
        var x=game.Bound.LEFT+game.BubbleD*col+offset;
        var y=game.Bound.TOP-game.BubbleD*row;

        bubble.x=x;
        bubble.y=y;

        this.bubblesArr[row][col]=bubble;
    },
    //�����¼�
    addEventListener:function(){
        var that=this;
        var eventListener=cc.EventListener.create({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event){
                var pos=event.getLocation();
                //cc.log("onmousedown:",pos.x,pos.y);
                that.onMouseDown(pos);
            },
            onMouseMove:function(event){
                var pos=event.getLocation();
                //cc.log('onmousemove:',pos.x,pos.y);
                that.onMouseMove(pos);
            }
        });
        cc.eventManager.addListener(eventListener,this);
    },
    onMouseDown:function(pos){

        this.flyBegin(pos);
    },
    onMouseMove:function(pos){
        var radius=Math.atan2(pos.y-game.Shoot_Pos.y,pos.x-game.Shoot_Pos.x); //����
        this.shooter.rotation=90-radius*180/Math.PI;  //�Ƕ�
    },
    addBubble:function() {
        //��ǰ������������ ���������ʱ��û�пռ�
        for (var i = 0; i < game.MaxRow; ++i) {
            this.bubblesArr[i] = [];
        }

        //�Զ������ɳ�ʼ�ĵ�ͼ
        for (var i = 0; i < 4; ++i) {
            var offset = i % 2 ? game.BubbleD / 2 : 0;
            for (var j = 0; j < game.MaxCol; ++j) {
                //����һ��ż���е����һ����
                if (i % 2 == 1 && j == game.MaxCol - 1) continue;

                var type = parseInt(Math.random() * 8);
                var x = game.Bound.LEFT + game.BubbleD * j + offset;
                var y = game.Bound.TOP - game.BubbleD * i;
                var bubble = this.addOneBubble(type, x, y);
                bubble.myCol = j;
                bubble.myRow = i;
                this.bubblesArr[i][j] = bubble;
            }
        }
    },

        //�ö���õľ�������
    //    var level1=[
    //        [1,3,4,2,5,6],
    //        [2,5,3,4,1,5],
    //        [0,0,2,3,5,1]
    //    ];
    //
    //    for(var i=0; i<level1.length;++i){
    //        var offset=i%2 ? game.BubbleD/2 : 0;
    //        for(var j=0;j<level1[i].length;++j){
    //
    //            var x=game.Bound.LEFT+game.BubbleD*j+offset;
    //            var y=game.Bound.TOP-game.BubbleD*i;
    //            var bubble=this.addOneBubble(level1[i][j],x,y);
    //            bubble.myCol=j;
    //            bubble.myRow=i;
    //            this.bubblesArr[i][j]=bubble;
    //        }
    //    }
    //},
    //��̨
    createShooter:function(){
        this.shooter=new cc.Sprite(res.shooter_png);
        this.shooter.setPosition(game.Shoot_Pos.x,game.Shoot_Pos.y);
        this.shooter.anchorY=0.4;
        this.addChild(this.shooter)
    },
    //�������
    createShootBubble:function(){
        var type=parseInt(Math.random()*8);
        this.fireBubble=this.addOneBubble(type,game.Shoot_Pos.x,game.Shoot_Pos.y);
    },
    //׼��������
    createReadyBubble:function(){
        var type=parseInt(Math.random()*8);
        this.waitBubble=this.addOneBubble(type,game.Ready_Pos.x,game.Ready_Pos.y);
    },
    //����һ������
    addOneBubble:function(type,x,y){
        var bubble=new Bubble(type);
        bubble.attr({
            x:x,
            y:y
        });
        this.addChild(bubble);
        return bubble;
    }
});

var BubbleScene = cc.Scene.extend({

    onEnter:function () {
        this._super();
        var layer = new BubbleLayer();
        this.addChild(layer);
    }
});


