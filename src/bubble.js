/**
 * Created by hu on 2015/11/19.
 */

var Bubble=cc.Sprite.extend({
    type:0,
    myCol:0,
    myRow:0,
    myFlyRadius:0,
    isMoving:false,
    ctor:function(type) {

        this.type = type;

        var pic = res['bubble' + type];

        this._super(pic);

    },
    fly:function(pos){
        this.myFlyRadius=Math.atan2(pos.y-this.y,pos.x-this.x);
        this.isMoving=true;
    },
    stopFly:function(){
        this.isMoving=false;
    },
    //�õ���������Χĳ����������ݵ�����
    getRoundPos:function(dir){
        var grid=null;
        var r=this.myRow;
        var c=this.myCol;
        switch (dir){
            case 0:
                grid=[r,c-1];
                break;
            case 1:
                grid=[r-1,r%2?c:c-1];
                break;
            case 2:
                grid=[r-1,r%2?c+1:c];
                break;
            case 3:
                grid=[r,c+1];
                break;
            case 4:
                grid=[r+1,r%2?c+1:c];
                break;
            case 5:
                grid=[r+1,r%2?c:c-1];
                break;
        }
        if(grid){
            if(grid[0]<0 || grid[0]>=game.MaxRow || grid[1]<0 || grid[1]>=game.MaxCol){
                grid=0;
            }
        }
        return grid;
    },
    reachBound:function(){
        //�µ�����
        var col=Math.round((this.x-game.Bound.LEFT+game.BubbleD/2)/game.BubbleD);

        this.x=col*game.BubbleD+game.Bound.LEFT;
        this.y=game.Bound.TOP;

        this.myCol=col;
        this.myRow=0;
    },
    update:function(){
        var bStop=false;
        var dx=game.FlySpeed*Math.cos(this.myFlyRadius);
        var dy=game.FlySpeed*Math.sin(this.myFlyRadius);

        //���ұ߽� ����
        if(dx<0&&this.x+dx<game.Bound.LEFT){
            dx=game.Bound.LEFT-this.x;
            this.myFlyRadius=Math.PI-this.myFlyRadius;
        }else if(dx>0&&this.x+dx>game.Bound.RIGHT){
            dy=game.Bound.RIGHT-this.x;
            this.myFlyRadius=Math.PI-this.myFlyRadius;
        }

        //���ɳ��߽�
        if(dy>0&&this.y+dy>game.Bound.TOP){
            dy=game.Bound.TOP-this.y;
            this.stopFly();

            //����λ��
            this.reachBound();
            bStop=true;
            return bStop;
        }

        this.x+=dx;
        this.y+=dy;
        return bStop;
    }
});