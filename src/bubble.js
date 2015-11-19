/**
 * Created by hu on 2015/11/19.
 */

var Bubble=cc.Sprite.extend({
    type:0,
    myCol:0,
    myRow:0,
    ctor:function(type) {

        this.type = type;

        var pic = res['bubble' + type];

        this._super(pic);

    }
});