define([
	'point',
	'vectorAxis'
	], function(){

var point = require('point');
var vectorAxis = require('vectorAxis');

function waterfallChart(){
	
	this.canvas = document.createElement('canvas');


	this.crossPoint = new point(0, 0);
	this.axisX = new vectorAxis();
	this.axisY = new vectorAxis();
	this.axisZ = new vectorAxis();
	this.Xangle = 0;

	this.init = function(div){

		this.canvas.width = 1000;
		this.canvas.height = 800;



		div.appendChild(this.canvas);

		var box = this.canvas.getBoundingClientRect();
		console.log(box);

		render();
	}



	function axisAlgorithm(alpha){
		this.Xangle = alpha;
		var Zangle = Math.PI * 2 / 3 - Math.abs(Xangle - Math.PI / 4) * 4 / 15;
		Zangle += Xangle;

		var width = this.canvas.width;
		var height = this.canvas.height;
		var org_x = width * 0.05 + width * 0.9 * Math.abs(Math.cos(Zangle)) / (Math.abs(Math.cos(Zangle)) + Math.cos(Xangle) * 2)
		var org_y = height * 0.9;

		this.crossPoint.x = org_x;
		this.crossPoint.y = org_y;

		this.axisX.startPoint.x = org_x;
		this.axisX.startPoint.y = org_y;
		this.axisX.endPoint.x = width * 0.95;
		this.axisX.endPoint.y = height * 0.9 - (width * 0.05 - org_x) * Math.tan(Xangle);

		this.axisZ.startPoint.x = org_x;
		this.axisZ.startPoint.y = org_y;
		this.axisZ.endPoint.x = width * 0.05;
		this.axisZ.endPoint.y = height * 0.9 - (org_x - width * 0.05) * Math.tan(Zangle) * -1;

		this.axisY.startPoint.x = width * 0.05;
		this.axisY.startPoint.y = height * 0.9 - (org_x - width * 0.05) * Math.tan(Zangle) * -1;
		this.axisY.endPoint.x = width * 0.05;
		this.axisY.endPoint.y = height * 0.9 - (org_x - width * 0.05) * Math.tan(Zangle) * -1 - width * 0.1;

	}



	var mouseleftdown = false;
	var pre_pt = new point(0, 0);

	this.canvas.onmousedown = function(e){
		e.preventDefault();
		if(e.button == 0){
			mouseleftdown = true;

			var box = this.getBoundingClientRect();
			pre_pt.x = e.clientX - box.left;
			pre_pt.y = e.clientY - box.top;
		}
	}

	this.canvas.onmouseup = function(e){
		e.preventDefault();
		if(e.button == 0){
			mouseleftdown = false;
		}
	}

	render = function(){
		var ctx = this.canvas.getContext("2d");
		this.axisX.render(ctx);

	}



}

return waterfallChart;

});