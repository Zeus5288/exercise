// 面向过程
// 面向对象
/*
面向过程：
0、把浮动布局改为定位布局
1、实现拖拽过程
2、在拖拽过程中碰撞检测
3、碰撞后选择最近的li
4、鼠标抬起交换位置
*/

var oWrap = document.getElementById('wrap');
var aLi = document.getElementsByTagName('li'); 

//用js获取每个li距离浏览器窗口的偏移量
var arr = [];
for (var i=0, l=aLi.length; i<l; i++) {
	arr.push([aLi[i].offsetLeft, aLi[i].offsetTop]);
}
// console.log(arr);
//把浮动布局改为定位布局
for (var i=0, l=aLi.length; i<l; i++) {
	aLi[i].style.position = "absolute";
	aLi[i].style.left = arr[i][0] + "px";
	aLi[i].style.top = arr[i][1] + "px";
	aLi[i].style.margin = 0;
}
//1、让每个li实现拖拽功能
for (var i=0,l=aLi.length;i<l;i++) {
	aLi[i].index = i;//添加一个自定义属性
	drag(aLi[i]);
}

var z = 1;   //js中可以处理的最大数为2^23

function drag(obj) {
	obj.ontouchstart = function (e) {
		// console.log(this);//this作用域
		// console.log(arguments[0]);//事件返回的实参列表
		// console.log(e.clientX);

		var e = e || window.event;//浏览器兼容
		//获取鼠标事件的xy坐标点
		var x = e.clientX,
		    y = e.clientY;
		//获取li原来的位置
		var l = this.offsetLeft,
		    t = this.offsetTop;

		//更改鼠标拖拽的li的层级
		this.style.zIndex = z++;

		document.ontouchmove = function (e) {
			var e = e || window.event;
			var _left = e.clientX - x + l,
			    _top = e.clientY - y + t;
			// console.log(this);
			obj.style.left = _left + "px";
			obj.style.top = _top + "px";
			//碰撞检测
			// for (var j=0; j<aLi.length; j++) {
			// 	if(obj!=aLi[j] && impact(obj, aLi[j])){
			// 		aLi[j].style.border = "1px solid red";
			// 	}
			// }
			for (var j=0; j<aLi.length; j++) {
				aLi[j].style.border = 0;
			}
			var oLi = nearLi(obj);
			if (oLi) {
				oLi.style.border = "1px solid red";
			}
			// nearLi(obj).style.border = "1px solid red";//这是错误的写法，会报错
		}
		//鼠标抬起解绑事件
		document.ontouchend = function () {
			document.ontouchmove = null;
			document.ontouchend = null;
			//4、鼠标抬起交换位置
			var oLi = nearLi(obj);
			var tmp = 0;
			if (oLi) {  //碰撞成功
				move(oLi, {left:arr[obj.index][0],top:arr[obj.index][1]});
				move(obj, {left:arr[oLi.index][0],top:arr[oLi.index][1]});
				//交换索引值
				tmp = obj.index;
				obj.index = oLi.index;
				oLi.index = tmp;
				oLi.style.border = 0;
			}else {
				move(obj, {left:arr[obj.index][0],top:arr[obj.index][1]});
			}
		}
		return false;//?这个为啥可以解决默认事件
	}
}

//2、拖拽过程中的碰撞检测
function impact(obj1,obj2) {
	var L1 = obj1.offsetLeft,
	    T1 = obj1.offsetTop,
	    R1 = L1 + obj1.offsetWidth,
	    B1 = T1 + obj1.offsetHeight;

	var L2 = obj2.offsetLeft,
	    T2 = obj2.offsetTop,
	    R2 = L2 + obj2.offsetWidth,
	    B2 = T2 + obj2.offsetHeight;

	if (R1<L2 || B1<T2 || L1>R2 || T1>B2 ) {
		//碰撞不成功
		return false;
	}else {
		//碰撞成功
		return true;
	}
}

//3、从碰撞成功的元素里面选择距离最近的li
//勾股定理计算距离
function distance(obj1, obj2) {
	var a = obj1.offsetLeft - obj2.offsetLeft;
	var b = obj1.offsetTop - obj2.offsetTop;
	return Math.sqrt(a*a + b*b);
}

//判断出距离最近的li
function nearLi(obj) {
	var tmp = 1000000000;  //第三个值做循环比较
	var oLi = "";
	for (var j=0; j<aLi.length; j++) {
		if(obj!=aLi[j] && impact(obj, aLi[j])){
			var c = distance(obj, aLi[j]);
			if(c < tmp) {
				tmp = c;
				oLi = aLi[j]; //把最小的li存储下来
			}
		}
	}
	return oLi;
}