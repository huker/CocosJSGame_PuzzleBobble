/**
 * Created by hu on 2015/11/18.
 */

//һЩ��Ϸ��ֵ
game.Shoot_Pos={x:180,y:80};
game.Ready_Pos={x:100,y:40};

//���ñ�Ե
game.Bound={
    LEFT:40,
    RIGHT:340,
    TOP:540,
    DOWN:80
};
game.BubbleD=32; //ֱ��
game.MaxRow=15;  //�������
game.MaxCol=10;  //�������
game.FlySpeed=10;  //�����˶��ٶ�

var BubbleLayer = cc.Layer.extend({
    fireBubble:null,
    waitBubble:null,
    shooter:null,
    bubblesArr:[],
    flyCold:false, //������ȴ

    ctor:function () {
        this._super();
        var bubbleBg=new cc.Sprite(res.gameBg_jpg);
        bubbleBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bubbleBg);
        this.createShooter(); //��̨
        this.createShootBubble(); //�������
        this.createReadyBubble(); //Ԥ������
        this.addBubble();
        this.addEventListener();
        this.scheduleUpdate();  //��ʱ�� Ĭ�Ϻ�����update
        return true;
    },
    onExit:function(){
        this.unscheduleUpdate(); //���
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
            }
        }
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
    addBubble:function(){
        //��ǰ������������ ���������ʱ��û�пռ�
        for(var i=0;i<game.MaxRow;++i){
            this.bubblesArr[i]=[];
        }

        //�Զ������ɳ�ʼ�ĵ�ͼ
        //for(var i=0;i<4;++i){
        //    var offset=i%2 ? game.BubbleD/2 : 0;
        //    for(var j=0;j<game.MaxCol;++j){
        //        //����һ��ż���е����һ����
        //        if(i%2==1&&j==game.MaxCol-1) continue;
        //
        //        var type=parseInt(Math.random()*8);
        //        var x=game.Bound.LEFT+game.BubbleD*j+offset;
        //        var y=game.Bound.TOP-game.BubbleD*i;
        //        var bubble=this.addOneBubble(type,x,y);
        //        bubble.myCol=j;
        //        bubble.myRow=i;
        //        this.bubblesArr[i][j]=bubble;
        //    }
        //}

        //�ö���õľ�������
        var level1=[
            [1,3,4,2,5,6],
            [2,5,3,4,1,5],
            [0,0,2,3,5,1]
        ];

        for(var i=0; i<level1.length;++i){
            var offset=i%2 ? game.BubbleD/2 : 0;
            for(var j=0;j<level1[i].length;++j){

                var x=game.Bound.LEFT+game.BubbleD*j+offset;
                var y=game.Bound.TOP-game.BubbleD*i;
                var bubble=this.addOneBubble(level1[i][j],x,y);
                bubble.myCol=j;
                bubble.myRow=i;
                this.bubblesArr[i][j]=bubble;
            }
        }
    },
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


