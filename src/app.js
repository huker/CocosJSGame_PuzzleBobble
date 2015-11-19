/**
 * Created by hu on 2015/11/18.
 */
var StartBgLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        //背景
        var startbg=new cc.Sprite(res.startBg_jpg);
        startbg.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:cc.winSize.width/2,
            y:cc.winSize.height/2
        });
        this.addChild(startbg);
        //开始按钮
        var startItem=new cc.MenuItemImage(
            res.button_png,
            res.button_png,
            function(){
                //cc.log('click')
                //转换场景到游戏界面
                cc.director.runScene(new cc.TransitionFade(1.5, new BubbleScene(),cc.Color.BLACK));
            }
        );
        startItem.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:cc.winSize.width/2,
            y:cc.winSize.height/2-100
        });
        var menu=new cc.Menu(startItem);
        menu.x=0;
        menu.y=0;
        this.addChild(menu);
        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartBgLayer();
        this.addChild(layer);
    }
});

