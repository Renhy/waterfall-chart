define([
	'js/point.js'
	], function(){

	var point = require('js/point.js');

function vectorAxis(){

	//fields
	this.title = "waterfall-chart";

	this.startPoint = new point(0, 0);
	this.endPoint = new point(0, 0);
	this.minimun = 0;
	this.maximun = 1;

	this.valueType = "num";
	this.lineWidth = 2;
	this.lineColor = "rgba(0,0,0,0.5)";
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
		var y1 = this.startPoint.x;
		var x2 = this.endPoint.x;
		var y2 = this.endPoint.y;

		var min = this.minimun;
		var max = this.maximum;

		if(value <= min){
			return this.startPoint;
		}
		if(value > max){
			return this.endPoint;
		}

		var pt = require('js/point.js');
		pt.x = (x2 - x1) / (max - min) * (value - min);
		pt.y = (y2 - y1) / (max - min) * (value - min);

		return pt;
	}


	function renderLine(ctx, width, color, pt1, pt2){
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.moveTo(pt1.x, pt1.y);
		ctx.lineTo(pt2.x, pt2.y);
		ctx.stroke();
	}

	function getDistance(pt1, pt2){
		return Math.sqrt(Math.pow(pt1.x - pt2.x) + Math.pow(pt1.y - pt2.y));
	}


}


return vectorAxis;

});