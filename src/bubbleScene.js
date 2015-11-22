/**
 * Created by hu on 2015/11/18.
 */

//一些游戏定值
game.Shoot_Pos={x:180,y:80};
game.Ready_Pos={x:100,y:40};

//设置边缘
game.Bound={
    LEFT:40,
    RIGHT:340,
    TOP:540,
    DOWN:80
};
game.BubbleD=32; //直径
game.MaxRow=15;  //最大行数
game.MaxCol=10;  //最大列数
game.FlySpeed=10;  //泡泡运动速度

var BubbleLayer = cc.Layer.extend({
    fireBubble:null,
    waitBubble:null,
    shooter:null,
    bubblesArr:[],
    flyCold:false, //发射冷却

    ctor:function () {
        this._super();
        var bubbleBg=new cc.Sprite(res.gameBg_jpg);
        bubbleBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bubbleBg);
        this.createShooter(); //炮台
        this.createShootBubble(); //射击的泡
        this.createReadyBubble(); //预备的泡
        this.addBubble();
        this.addEventListener();
        this.scheduleUpdate();  //计时器 默认函数是update
        return true;
    },
    onExit:function(){
        this.unscheduleUpdate(); //清除
    },

    //飞行开始后发射冷却
    flyBegin:function(pos){
        if(!this.flyCold){
            this.flyCold=true;
            this.fireBubble.fly(pos);
        }
    },

    //飞行结束后
    flyEnd:function(){
        this.fireBubble=this.waitBubble;  //泡泡换
        this.waitBubble.setPosition(game.Shoot_Pos.x,game.Shoot_Pos.y);

        this.createReadyBubble();
        //冷却激活一下
        this.flyCold=false;
    },

    //更新判断是否停止了
    update:function(dt){
        if(this.fireBubble&&this.fireBubble.isMoving){
            //this.fireBubble.update();
            var hasStop=this.fireBubble.update();
            if(hasStop){
                this.flyEnd();
            }
        }
    },

    //控制事件
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
        var radius=Math.atan2(pos.y-game.Shoot_Pos.y,pos.x-game.Shoot_Pos.x); //弧度
        this.shooter.rotation=90-radius*180/Math.PI;  //角度
    },
    addBubble:function(){
        //提前生成最大的行数 以免产生的时候没有空间
        for(var i=0;i<game.MaxRow;++i){
            this.bubblesArr[i]=[];
        }

        //自定义生成初始的地图
        //for(var i=0;i<4;++i){
        //    var offset=i%2 ? game.BubbleD/2 : 0;
        //    for(var j=0;j<game.MaxCol;++j){
        //        //限制一下偶数行的最后一个泡
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

        //用定义好的矩阵生成
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
    //炮台
    createShooter:function(){
        this.shooter=new cc.Sprite(res.shooter_png);
        this.shooter.setPosition(game.Shoot_Pos.x,game.Shoot_Pos.y);
        this.shooter.anchorY=0.4;
        this.addChild(this.shooter)
    },
    //射的泡泡
    createShootBubble:function(){
        var type=parseInt(Math.random()*8);
        this.fireBubble=this.addOneBubble(type,game.Shoot_Pos.x,game.Shoot_Pos.y);
    },
    //准备的泡泡
    createReadyBubble:function(){
        var type=parseInt(Math.random()*8);
        this.waitBubble=this.addOneBubble(type,game.Ready_Pos.x,game.Ready_Pos.y);
    },
    //定义一个泡泡
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


