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

		this.render();
	}



	function axisAlgorithm(alpha){
		this.Xangle = alpha;
		var Zangle = Math.pi


	}




	this.canvas.onmousedown = function(e){
		e.preventDefault();

		var box = this.getBoundingClientRect();
		var x = e.clientX - box.left;
		var y = e.clientY - box.top;

		console.log(x, y);

		

	}

	this.canvas.onmouseup = function(e){

	}

	this.render = function(){
		var ctx = this.canvas.getContext("2d");
		this.axisX.render(ctx);

	}



}

return waterfallChart;

});