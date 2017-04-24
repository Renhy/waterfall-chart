define([
	'point',
	'vectorAxis'
	], function(){

var point = require('point');
var vectorAxis = require('vectorAxis');

function waterfallChart(){
	
	var canvas = document.createElement('canvas');

	var crossPoint = new point(0, 0);
	var axisX = new vectorAxis();
	var axisY = new vectorAxis();
	var axisZ = new vectorAxis();
	var angle_x = 0;

	var mouseleftdown = false;
	var mousecatch = true;
	var mousecatch_pt = new point(0, 0);
	var pre_pt = new point(0, 0);

	var freqStart;
	var freqStep;
	var freqCount;
	var freqIndex = new Array();

	var freqData = new Array();
	var freqDataTime = new Array();
	var cacheCount = 20;


	function axis_init(){
		axisAlgorithm(angle_x);

		axisX.minimum = 0;
		axisX.maximum = 3000;
		axisX.title = "(hz)";

		axisY.minimum = 0;
		axisY.maximum = 1200;
		axisY.title = "(mg)";

		axisZ.minimum = 0;
		axisZ.maximum = freqData.length - 1;

		render();
	}

	function axisAlgorithm(alpha){
		angle_x = alpha;
		var angle_z = Math.PI * 2 / 3 - Math.abs(angle_x - Math.PI / 4) * 4 / 15;
		angle_z += angle_x;

		var width = canvas.width;
		var height = canvas.height;
		var org_x = width * 0.05 + width * 0.9 * Math.abs(Math.cos(angle_z)) / (Math.abs(Math.cos(angle_z)) + Math.cos(angle_x) * 2)
		var org_y = height * 0.9;

		crossPoint.x = org_x;
		crossPoint.y = org_y;

		axisX.startPoint.x = org_x;
		axisX.startPoint.y = org_y;
		axisX.endPoint.x = width * 0.95;
		axisX.endPoint.y = height * 0.9 - (width * 0.95 - org_x) * Math.tan(angle_x);

		axisZ.startPoint.x = org_x;
		axisZ.startPoint.y = org_y;
		axisZ.endPoint.x = width * 0.05;
		axisZ.endPoint.y = height * 0.9 - (org_x - width * 0.05) * Math.tan(angle_z) * -1;

		axisY.startPoint.x = width * 0.05;
		axisY.startPoint.y = height * 0.9 - (org_x - width * 0.05) * Math.tan(angle_z) * -1;
		axisY.endPoint.x = width * 0.05;
		axisY.endPoint.y = height * 0.9 - (org_x - width * 0.05) * Math.tan(angle_z) * -1 - width * 0.1;
	}

	function viewMove(dx){
		var delta = dx / 2000;
		angle_x += delta;

		if(angle_x < 0){
			angle_x = 0;
		}

		if(angle_x > Math.PI / 36 * 7){
			angle_x = Math.PI / 36 * 7;
		}

		axisAlgorithm(angle_x);
	}

	function axisYScaleAdapt(){
		var max = 0;
		for(var i = 0; i < freqData.length; i++){
			var _max = arrMax(freqData[i]);
			if(_max > max){
				max = _max;
			}
		}

		if(max > axisY.maximum){
			axisY.maximum = (Math.floor(max / 10) + 1) * 10;
		}
		if(max < axisY.maximum / 2){
			axisY.maximum = (Math.floor(max / 10) + 1) * 10;
		}
	}

	function axisZScaleAdapt(){
		axisZ.minimum = arrMin(freqDataTime);
		axisZ.maximum = arrMax(freqDataTime);
	}

	canvas.onmousedown = function(e){
		e.preventDefault();
		if(e.button == 0){
			mouseleftdown = true;

			var box = canvas.getBoundingClientRect();
			pre_pt.x = e.clientX - box.left;
			pre_pt.y = e.clientY - box.top;
			console.log(pre_pt);
		}
	}

	canvas.onmouseup = function(e){
		e.preventDefault();
		if(e.button == 0){
			mouseleftdown = false;
		}
	}

	canvas.onmousemove = function(e){
		e.preventDefault();
		var box = canvas.getBoundingClientRect();
		var x = e.clientX - box.left;
		var y = e.clientY - box.top;

		if(mousecatch){
			var x0 = axisX.startPoint.x;
			var y0 = axisX.startPoint.y;
			var x1 = x;
			var y1 = y;
			var kx = (axisX.endPoint.y - axisX.startPoint.y) / (axisX.endPoint.x - axisX.startPoint.x);
			var kz = (axisZ.endPoint.y - axisZ.startPoint.y) / (axisZ.endPoint.x - axisZ.startPoint.x);
		
			var y_in_x = kx * x + y0 - kx * x0;
			var delta_y = y - y_in_x;

			if(y_in_x - y > axisY.startPoint.y - axisY.endPoint.y){
				y1 -= axisY.endPoint.y - axisY.startPoint.y;
			}

			if(delta_y >= axisY.endPoint.y - axisY.startPoint.y && delta_y <= 0){
				mousecatch_pt.x = x1;
				mousecatch_pt.y = kx * mousecatch_pt.x + y0 - kx * x0;
			}else{
				mousecatch_pt.x = (y1 - y0 + kx * x0 - kz * x1) / (kx - kz);
				mousecatch_pt.y = kx * mousecatch_pt.x + y0 - kx * x0;
			}

			if(mousecatch_pt.x < x0){
				mousecatch_pt.x = axisX.startPoint.x;
				mousecatch_pt.y = axisX.startPoint.y;
			}else if(mousecatch_pt.x > axisX.endPoint.x){
				mousecatch_pt.x = axisX.endPoint.x;
				mousecatch_pt.y = axisX.endPoint.y;
			}
		}

		if(mouseleftdown){
			viewMove(x - pre_pt.x);
		}

		pre_pt.x = x;
		pre_pt.y = y;

		render();
	}


	render = function(){
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		renderAxis(ctx);
		renderLines(ctx);
		

	}

	function renderAxis(ctx){
		var x_dx = axisX.endPoint.x - axisX.startPoint.x;
		var x_dy = axisX.endPoint.y - axisX.startPoint.y;
		var y_dx = axisY.endPoint.x - axisY.startPoint.x;
		var y_dy = axisY.endPoint.y - axisY.startPoint.y;
		var z_dx = axisZ.endPoint.x - axisZ.startPoint.x;
		var z_dy = axisZ.endPoint.y - axisZ.startPoint.y;

		var right_pts = new Array(4);
		right_pts[0] = new point(axisX.endPoint.x, axisX.endPoint.y);
		right_pts[1] = new point(axisX.endPoint.x + y_dx, axisX.endPoint.y + y_dy);
		right_pts[2] = new point(axisX.endPoint.x + y_dx + z_dx, axisX.endPoint.y + y_dy + z_dy);
		right_pts[3] = new point(axisX.endPoint.x + z_dx, axisX.endPoint.y + z_dy);

		var top_pts = new Array(4);
		top_pts[0] = new point(axisY.startPoint.x, axisY.startPoint.y);
		top_pts[1] = new point(axisY.startPoint.x + y_dx, axisY.startPoint.y + y_dy);
		top_pts[2] = new point(axisY.startPoint.x + y_dx + x_dx, axisY.startPoint.y + y_dy + x_dy);
		top_pts[3] = new point(axisY.startPoint.x + x_dx, axisY.startPoint.y + x_dy);

		var line = "rgba(0, 90, 255, 0.8)";
		var fill = "rgba(200, 220, 255, 0.2)";
		drawPolygon(ctx, 1, line, fill, right_pts);
		drawPolygon(ctx, 1, line, fill, top_pts)

		axisX.render(ctx);
		axisY.render(ctx);
		axisZ.render(ctx);
	}

	function renderLines(ctx){
		var x_pt = axisX.getPoints(freqIndex);

		for(var i = 0; i < freqData.length; i++){
			var z = freqDataTime[i];
			var z_pt = axisZ.getPoint(z);

			var y_pt = axisY.getPoints(freqData[i]);

			var pts = new Array(freqIndex.length + 2);
			pts[0] = new point(crossPoint.x + z_pt.x, crossPoint.y + z_pt.y);
			for(var j = 0; j < x_pt.length; j++){
				var x = crossPoint.x + x_pt[j].x + y_pt[j].x + z_pt.x;
				var y = crossPoint.y + x_pt[j].y + y_pt[j].y + z_pt.y;
				pts[j + 1] = new point(x, y);
			}
			pts[pts.length - 1] = new point(crossPoint.x + x_pt[x_pt.length - 1].x + z_pt.x, crossPoint.y + x_pt[x_pt.length - 1].y + z_pt.y);

			var c = 230 - (230 - 130) / freqData.length * i;
			var fill = "rgba(" + c.toString() + ", " + c.toString() + ", " + c.toString() + ", 1)";
			var line = "rgba(0, 13, 255, 1)";

			drawPolygon(ctx, 1, line, fill, pts);
		}
	}


	this.init = function(dom){

		canvas.width = 1000;
		canvas.height = 800;

		dom.appendChild(canvas);

		axis_init();
	}

	this.setFreqInfo = function(start, step, count){
		freqStart = start;
		freqStep = step;
		freqCount = count;

		axisX.minimum = start;

		for(var i = 0; i < count; i++){
			freqIndex[i] = start;
			start += step;
		}

		axisX.maximum = freqStart + freqStep * freqCount;
	}

	this.pushData = function(time, data){
		if(freqDataTime.length > 0){
			if(time > freqDataTime[freqDataTime.length - 1]){
				freqData.push(data);
				freqDataTime.push(time);
			}else{
				for(var i = freqDataTime.length - 1; i >= 0; i--){
					if(time <= freqDataTime[i]){
						freqData.splice(i, 0, data);
						freqDataTime.splice(i, 0, time);
					}
				}
			}
		}else{
			freqData.push(data);
			freqDataTime.push(time);
		}

		if(freqData.length > cacheCount){
			freqData.shift();
			freqDataTime.shift();
		}

		axisYScaleAdapt();
		axisZScaleAdapt();

		render();
	}

	function arrMax(arr){
		if(arr.length == 0){
			return 0;
		}

		var max = arr[0];
		for(var i = 1; i < arr.length; i++){
			if(arr[i] > max){
				max = arr[i];
			}
		}

		return max;
	}

	function arrMin(arr){
		if(arr.length == 0){
			return 0;
		}

		var min = arr[0];
		for(var i = 1; i < arr.length; i++){
			if(arr[i] < min){
				min = arr[i];
			}
		}

		return min;
	}

	function drawPolygon(ctx, width, strokColor, fillColor, pts){
		if(pts.length){
			if(pts.length == 0){
				return;
			}

			ctx.lineWidth = width;
			ctx.strokeStyle = fillColor;
			ctx.fillStyle = fillColor;

			ctx.beginPath();
			ctx.moveTo(pts[0].x, pts[0].y);
			for(var i = 0; i < pts.length; i++){
				ctx.lineTo(pts[i].x, pts[i].y);
			}
			ctx.closePath();

			ctx.fill();
			ctx.stroke();
		}
	}

}

return waterfallChart;

});	