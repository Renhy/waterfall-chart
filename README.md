# waterfall-chart
# 瀑布图控件

###介绍
在振动分析的应用场景中，需要将连续时刻的频域信号叠加显示，以观察振动信号的变化趋势。  
常见的图谱都是基于XY轴建立的笛卡尔坐标系，可以绘制(x, y)数据点的应用。  
而在振动分析中，每一组数据都是在某个具体时间点上的一组频域信号：  
  
    
      
常见的瀑布图：  
![cood](https://github.com/Renhy/waterfall-chart/raw/master/pictures/example.jpg)  
这些瀑布图大多是一次性绘制，为了能旋转视角，更好的观察，基于H5 canvas画板开发了这套瀑布图图表控件。

###实现
建立一个XYZ三轴坐标系场景，模拟3D立体效果  
以原点出发，设置三条坐标轴，X、Y、Z  
不同于XY坐标系中X轴和Y轴直接返回数据点对应x,y值  
在该坐标系总数据点控件坐标分别返回对应轴中与原点o的相对向量
![cood](https://github.com/Renhy/waterfall-chart/raw/master/pictures/coordinate.png)  
如上图，空间中有点A(x, y, z).  
三维坐标分别投影到XYZ轴，得到向量OA_x、OA_y、OA_z  
最终计算得出A点在画布中绘制位置为A(a_x, a_y) 其中:  
a_x = OA_x.x + OA_y.x + OA_z.x;  
a_y = OA_x.y + OA_y.y + OA_z.y;  

###效果  
![cood](https://github.com/Renhy/waterfall-chart/raw/master/pictures/waterfall.png)  

