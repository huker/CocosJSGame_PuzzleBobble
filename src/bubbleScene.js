/**
 * Created by hu on 2015/11/18.
 */
game.Shoot_Pos={x:180,y:80};
game.Ready_Pos={x:100,y:40};

var BubbleLayer = cc.Layer.extend({
    fireBubble:null,
    waitBubble:null,
    ctor:function () {
        this._super();
        var bubbleBg=new cc.Sprite(res.gameBg_jpg);
        bubbleBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bubbleBg);
        this.createShootBubble();
        this.createReadyBubble();
        return true;
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


