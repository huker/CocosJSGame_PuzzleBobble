/**
 * Created by hu on 2015/11/18.
 */
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

var BubbleLayer = cc.Layer.extend({
    fireBubble:null,
    waitBubble:null,
    shooter:null,
    bubblesArr:[],
    ctor:function () {
        this._super();
        var bubbleBg=new cc.Sprite(res.gameBg_jpg);
        bubbleBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bubbleBg);
        this.createShooter(); //��̨
        this.createShootBubble(); //�������
        this.createReadyBubble(); //Ԥ������
        this.addBubble();
        return true;
    },
    addBubble:function(){
        //��ǰ������������ ���������ʱ��û�пռ�
        for(var i=0;i<game.MaxRow;++i){
            this.bubblesArr[i]=[];
        }

        //�Զ������ɳ�ʼ�ĵ�ͼ
        for(var i=0;i<4;++i){
            var offset=i%2 ? game.BubbleD/2 : 0;
            for(var j=0;j<game.MaxCol;++j){
                //����һ��ż���е����һ����
                if(i%2==1&&j==game.MaxCol-1) continue;

                var type=parseInt(Math.random()*8);
                var x=game.Bound.LEFT+game.BubbleD*j+offset;
                var y=game.Bound.TOP-game.BubbleD*i;
                var bubble=this.addOneBubble(type,x,y);
                bubble.myCol=j;
                bubble.myRow=i;
                this.bubblesArr[i][j]=bubble;
            }
        }

    },
    createShooter:function(){
        this.shooter=new cc.Sprite(res.shooter_png);
        this.shooter.setPosition(game.Shoot_Pos.x,game.Shoot_Pos.y);
        this.shooter.anchorY=0.4;
        this.addChild(this.shooter)
    },
    createShootBubble:function(){
        var type=0;
        this.fireBubble=this.addOneBubble(type,game.Shoot_Pos.x,game.Shoot_Pos.y);
    },
    createReadyBubble:function(){
        var type=1;
        this.waitBubble=this.addOneBubble(type,game.Ready_Pos.x,game.Ready_Pos.y);
    },
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


