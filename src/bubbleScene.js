/**
 * Created by hu on 2015/11/18.
 */

var BubbleLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var bubblebg=new cc.Sprite(res.gameBg_jpg);
        bubblebg.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:cc.winSize.width/2,
            y:cc.winSize.height/2
        });
        this.addChild(bubblebg);

        return true;
    }
});

var BubbleScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new BubbleLayer();
        this.addChild(layer);
    }
});

