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
	var pre_pt = new point(0, 0);




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
		axisX.endPoint.y = height * 0.9 - (width * 0.05 - org_x) * Math.tan(angle_x);

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
		var delta = dx / 1000;
		angle_x += delta;

		if(angle_x < 0){
			angle_x = 0;
		}

		if(angle_x > Math.PI / 36 * 7){
			angle_x = Math.PI / 36 * 7;
		}

		axisAlgorithm(angle_x);

		render();
	}

	canvas.onmousedown = function(e){
		e.preventDefault();
		if(e.button == 0){
			mouseleftdown = true;

			var box = this.getBoundingClientRect();
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



	render = function(){
		var ctx = canvas.getContext("2d");
		console.log("begin render.");

		axisX.render(ctx);


	}


	this.init = function(dom){

		canvas.width = 1000;
		canvas.height = 800;

		dom.appendChild(canvas);

		axisAlgorithm(0);

		render();
	}

	this.pushData = function(time, data){

	}

}

return waterfallChart;

});