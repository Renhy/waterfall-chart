define([
	'point'
	], function(){

	var point = require('point');

function vectorAxis(){

	//fields
	this.title = "waterfall-chart";

	this.startPoint = new point(0, 0);
	this.endPoint = new point(0, 0);
	this.minimum = 0;
	this.maximum = 1;

	this.valueType = "num";
	this.lineWidth = 2;
	this.lineColor = "rgba(0,0,0,1)";
	this.scaleDistance = 50;

	this.render = function(ctx){

		renderLine(ctx, this.lineWidth, this.lineColor, this.startPoint, this.endPoint);

		//begin render scales
		var distance = getDistance(this.startPoint, this.endPoint);
		var scaleCount = Math.floor(distance / this.scaleDistance);
		var delta = 0;
		if(Math.abs(this.maximum - this.minimum) > scaleCount){
			delta = Math.floor(this.maximum - this.minimum) / scaleCount;
		}else{
			delta = (this.maximum - this.minimum) / scaleCount;
		}

		var scaleValues = new Array(scaleCount);
		for(var i = 0; i < scaleCount; i++){
			scaleValues[i] = (this.minimum + delta * (i + 1));
		}

		var length = 10;

		//竖直轴
		if(this.endPoint.x - this.startPoint.x == 0){
			for(var i = 0; i < scaleCount; i++){
				var pt = this.getPoint(scaleValues[i]);
				var pt1 = new point(pt.x + this.startPoint.x, pt.y + this.startPoint.y);
				var pt2 = new point(pt1.x - length, pt1.y);

				renderLine(ctx, 1, this.lineColor, pt1, pt2);
			}
			return;
		}

		//水平轴
		if(this.endPoint.y - this.startPoint.y == 0){
			for(var i = 0; i < scaleCount; i++){
				var pt = this.getPoint(scaleValues[i]);
				var pt1 = new point(pt.x + this.startPoint.x, pt.y + this.startPoint.y);
				var pt2 = new point(pt1.x, pt1.y + length);
				renderLine(ctx, 1, this.lineColor, pt1, pt2);
			}
			return;
		}

		//斜轴
		var angle_axis = Math.atan((this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x));
		var angle_scale;
		if(this.endPoint.x - this.startPoint.x > 0){
			angle_scale = angle_axis - Math.PI / 2;
		}else{
			angle_scale = angle_axis + Math.PI / 2;
		}

		var dx = length * Math.cos(angle_scale);
		var dy = length * Math.sin(angle_scale);
		for(var i = 0; i < scaleCount; i++){
			var pt = this.getPoint(scaleValues[i]);
			var pt1 = new point(pt.x + this.startPoint.x, pt.y + this.startPoint.y);
			var pt2 = new point(pt1.x + dx, pt1.y + dy);
			renderLine(ctx, 1, this.lineColor, pt1, pt2);
		}




	}

	//返回value值在轴上的点相对于startPoint的相对位移向量
	this.getPoint = function(value){
		var x1 = this.startPoint.x;
		var y1 = this.startPoint.y;
		var x2 = this.endPoint.x;
		var y2 = this.endPoint.y;

		var min = this.minimum;
		var max = this.maximum;

		if(value <= min){
			return this.startPoint;
		}
		if(value > max){
			return this.endPoint;
		}

		var x = (x2 - x1) / (max - min) * (value - min);
		var y = (y2 - y1) / (max - min) * (value - min);

		return new point(x, y);
	}

	this.getPoints = function(values){
		var x1 = this.startPoint.x;
		var y1 = this.startPoint.y;
		var x2 = this.endPoint.x;
		var y2 = this.endPoint.y;

		var min = this.minimum;
		var max = this.maximum;

		var dx = (x2 - x1) / (max - min);
		var dy = (y2 - y1) / (max - min);

		var count = values.length;
		var pts = new Array(count);
		for(var i = 0; i < count; i ++){
			if(values[i] <= min){
				pts[i] = this.startPoint;
			}
			if(values[i] >= max){
				pts[i] = this.endPoint;
			}

			pts[i] = new point(dx * (values[i] - min), dy * (values[i] - min));
		}

		return pts;
	}


	function renderLine(ctx, width, color, pt1, pt2){
		ctx.lineWidth = width;
		ctx.strokeStyle = color;

		ctx.beginPath();
		ctx.moveTo(pt1.x, pt1.y);
		ctx.lineTo(pt2.x, pt2.y);
		ctx.closePath();
		
		ctx.stroke();
	}

	function getDistance(pt1, pt2){
		return Math.sqrt(Math.pow((pt1.x - pt2.x), 2) + Math.pow((pt1.y - pt2.y), 2));
	}


}


return vectorAxis;

});