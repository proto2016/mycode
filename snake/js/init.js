window.onload = function() {
		
	var width = document.documentElement.clientWidth,
		height = document.documentElement.clientHeight,
		canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		borderColor = "#0c1",
		roadNumRow= 30, // 行
		roadNumCol = 30, // 列
		foodAllPos = [], // 食物的所有位置
		snakes = [373, 372, 371, 370,369],
		direction = null,  // 方向
		postion = {
			"38": -roadNumRow,// 上
			"40": roadNumRow,// 下
			"37": -1,// 左
			"39": 1// 右
		},
		foodStatus = false,
		foodPos = null,
		borderWall = {
			"top":[],
			"bottom":[],
			"left":[],
			"right":[]
		}; 
	canvas.width = width*0.95;
	canvas.height = height*0.95;	
	var menuWidth = canvas.width*0.2,
		gameWidth = canvas.width*0.8,
		menuHeight = canvas.height,
		gameHeight = canvas.height,
		row = gameHeight / roadNumRow,
		col = gameWidth / roadNumCol;

	function createMenuPanel() {
		ctx.beginPath();
		ctx.strokeStyle = borderColor;
		ctx.moveTo(menuWidth, 0);
		ctx.lineTo(menuWidth, menuHeight);
		ctx.stroke();
		ctx.closePath();
	}

	function drawText() {
		ctx.save();
		ctx.beginPath();
		ctx.font = "40px Verdana";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.shadowColor = borderColor;
		ctx.shadowOffsetX = "3";
		ctx.shadowOffsetY = "3";
		ctx.shadowBlur = "10";
		ctx.fillStyle = borderColor;
		ctx.fillText("贪吃蛇", menuWidth/2, 20);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	function createRoad() {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#ccc";
		var totalX = menuWidth;
		
		// 行		
		for (var i = 1; i < roadNumRow; i++) {
			ctx.moveTo(totalX, row*i);
			ctx.lineTo(width, row*i);
		}
		
		// 列
		for (var i = 1; i < roadNumCol; i++) {
			var x = totalX+col*i;
			ctx.moveTo(x, 0);
			ctx.lineTo(x, gameHeight);
			ctx.stroke();
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	function savePos() {
		var pos = [],
			len = 0;
		for (var i = 0; i < roadNumRow; i++) {
			for(var j = 0; j < roadNumCol; j++) {
				var x = j * col + menuWidth,
					y = i * row;
				saveBorder(len);
				len++;
				foodAllPos.push([x, y]);
			}
		}
		log(borderWall)
	}

	function saveBorder(len) {
		var total = roadNumCol*roadNumRow;
		if (len >= 0 && len < roadNumCol) {
			borderWall['top'].push(len);
		}
		if (len <= total && len >= total-roadNumCol) {
			borderWall['bottom'].push(len);
		} 
		if (len % roadNumRow == 0) {
			borderWall['left'].push(len);
		} 
		if ((len+1) % roadNumRow == 0){
			borderWall['right'].push(len);
		}
	}

	function randomFood() {
		var t = [];
		for (var i = 0; i < foodAllPos.length; i++) {
			if (snakes.indexOf(i) == -1) t.push(i);
		}

		return t[random(0, t.length-1)];
	}
	randomFood();
	function createFood() {
		var pos = {
			startX: menuWidth,
			startY: 0,
			endX: width,
			endY: gameHeight
		}
		if (!foodStatus) {
			foodPos = randomFood();
		}
		var pos = foodAllPos[foodPos];
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.fillRect(pos[0], pos[1], col, row);
		ctx.closePath();
		foodStatus = true;
	}

	function checkFoodEat() {
		if (foodStatus) {
			return false;
		} else {
			return true;
		}
	}

	function createSnake(item, i) {
		var pos, color;
		if (i == 0) {
			color = "red";
		} else {
			color = "#ccc";
		}
		pos = foodAllPos[item];
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.fillRect(pos[0], pos[1], col, row);
		ctx.closePath();
	}

	function snakeMove() {
		if (direction) { // 移动了
			for (var i = snakes.length-1; i >= 0; i--) {
				var pos, color;
				if (i == 0) {
					color = "red";
					if (foodAllPos[snakes[0]+postion[direction]] === undefined) {
						alert("撞墙了");
						return false;
					}
					snakes[i] += postion[direction];
					
					pos = foodAllPos[snakes[i]];
				} else {
					color = "#ccc";
					snakes[i] = snakes[i-1];
					pos = foodAllPos[snakes[i]];
				}
				ctx.beginPath();
				ctx.fillStyle = color;
				ctx.fillRect(pos[0], pos[1], col, row);
				ctx.closePath();
			}

			// 蛇头吃到食物了
			if (snakes[0] == foodPos) {
				snakes.length++;
				foodStatus = false;
			}	
		}
	}


	function handleEvent() {
		document.addEventListener('keydown', function(e) { move(e.keyCode); }, false);	
		// window.onresize = function() {
		// 	width = document.documentElement.clientWidth,
		// 	height = document.documentElement.clientHeight,
		// 	canvas.width = width*0.95;
		// 	canvas.height = height*0.95;	
		// 	menuWidth = canvas.width*0.2,
		// 		gameWidth = canvas.width*0.8,
		// 		menuHeight = canvas.height,
		// 		gameHeight = canvas.height,
		// 		row = gameHeight / roadNumRow,
		// 		col = gameWidth / roadNumCol;
		// 	createMenuPanel();
		// 	drawText();
		// 	handleEvent();
		// 	savePos();
		// 	initGamePanel();
		// 	snakes.forEach(createSnake);
		// }		
	}

	function move(keyCode) {
		direction = keyCode;
		var head = snakes[0];
		log(head);
		switch (keyCode) {
			case 38: // 上
				if (borderWall['top'].indexOf(head) !== -1) {
					alert("撞墙了");
					return false;
				}
				initGamePanel();
				break;
			case 40: // 下
				if (borderWall['bottom'].indexOf(head) !== -1) {
					alert("撞墙了");
					return false;
				}
				initGamePanel();
				break;
			case 37: // 左
				if (borderWall['left'].indexOf(head) !== -1) {
					alert("撞墙了");
					return false;
				}
				initGamePanel();
				break;
			case 39: // 右
				log(borderWall['right'][head])
				if (borderWall['right'].indexOf(head) !== -1) {
					alert("撞墙了");
					return false;
				}
				initGamePanel();
				break;
		}
	}

	function initGamePanel() {
		ctx.clearRect(menuWidth, 0, canvas.width, gameHeight);
		createRoad();
		createFood();
		snakeMove();
	}

	createMenuPanel();
	drawText();
	handleEvent();
	savePos();
	initGamePanel();
	snakes.forEach(createSnake);
	
	
	// setInterval(function() {
	// 	testNum++;
	// 	createSnake(testNum);
	// }, 1000);
	
}