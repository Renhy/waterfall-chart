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
	this.scaleAutoCount = -1;

	this.render = function(ctx){

		renderLine(ctx, this.lineWidth, this.lineColor, this.startPoint, this.endPoint);

		//begin render scales
		var distance = getDistance(this.startPoint, this.endPoint);
		var scaleCount = 5;
		if(this.scaleAutoCount == -1){
			scaleCount = distance / 200;
			scaleCount = Math.floor(scaleCount);
		}



	}

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
		return Math.sqrt(Math.pow(pt1.x - pt2.x) + Math.pow(pt1.y - pt2.y));
	}


}


return vectorAxis;

});