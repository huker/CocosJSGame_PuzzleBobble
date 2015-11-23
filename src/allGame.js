/**
 * Created by hu on 2015/11/23.
 */

//圆形碰撞检测
game.circleCollision=function(p1,p2,r1,r2){
    var r=Math.pow((p2.x-p1.x),2)+Math.pow((p2.y-p1.y),2)<=Math.pow((r1+r2),2);
    return r;
};

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
