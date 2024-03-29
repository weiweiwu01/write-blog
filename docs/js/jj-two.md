# JavaScript函数柯里化
### 柯里化定义  
>维基百科上说道：柯里化，英语：Currying(果然是满满的英译中的既视感)，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
  
>函数柯里化又称部分求值。一个柯里化的函数首先会接受一些参数，接受了这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值
用大白话来说就是只传递给函数一部分参数来调用它，让它返回一个新函数去处理剩下的参数。  
举个栗子：我们最常用的 <font color='#ffa200'>add</font> 函数
```js 复制代码
// 普通的add函数
function add(x, y) {
    return x + y
}
// Currying后
function curryingAdd(x) {
    return function (y) {
        return x + y
    }
}
add(1, 2)           // 3
curryingAdd(1)(2)   // 3
//箭头函数柯里化
let c = x => y => x+y;
c(1)(2) //3
```
实际上就是把add函数的x,y两个参数变成了先用一个函数接受x，然后返回一个函数去处理y参数。     

事实上，也可以创建参数收集函数，收集所有参数，统一进行计算
```js
function curry(a) {
    let arg = [];//收集参数的容器 放到数组里面
    arg.push(a)
    function sum(b){//参数收集函数 利用闭包 保持arg在内存中
        arg.push(b);//收集参数
        return sum;//返回该收集参数函数
    }
    sum.toString = function(){//重写函数的toString方法 
        let sum = arg.reduce((pre,cur)=>{//归并求和
            return pre+cur
        },0)
        return sum;//返回求和的值
    }
    return sum;//第一次调用 返回sum函数
}
let sum1 = curry(1)(2)(3);
let sum2 = curry(1)(2)(3)(4);
let sum3 = curry(1)(2)(3)(4)(5)(6);
console.log(sum1);
console.log(sum2);
console.log(sum3);
``` 

### 柯里化的好处
**1.参数复用**
```js
// 正常正则验证字符串 reg.test(txt)
// 函数封装后
function check(reg, txt) {
    return reg.test(txt)
}
check(/\d+/g, 'test')       //false
check(/[a-z]+/g, 'test')    //true
// Currying后
function curryingCheck(reg) {
    return function(txt) {
        return reg.test(txt)
    }
}
let hasNumber = curryingCheck(/\d+/g)
let hasLetter = curryingCheck(/[a-z]+/g)
hasNumber('test1')      // true
hasNumber('testtest')   // false
hasLetter('21212')      // false
```
上面的示例是一个正则的校验，正常来说直接调用check函数就可以了，但是如果我有很多地方都要校验是否有数字，其实就是需要将第一个参数reg进行复用，这样别的地方就能够直接调用hasNumber，hasLetter等函数，让参数能够复用，调用起来也更方便。

**2.延迟运行**
bind方法不是立即执行函数，延迟执行   
>bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )    
由此我们可以首先得出 bind 函数的两个特点：
+ 返回一个函数
+ 可以传入参数

javaScript中bind的实现   
call、apply的实现，[请点击这里](https://weiweiwu01.github.io/js/jc-three.html)
```js
Function.prototype._bind = function(context){
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    let self = this;
    const args = [...arguments].splice(1);
    return function(){
        let bindArgs = [...arguments];
        self.apply(context, args.concat(bindArgs));
    }
}
 let obj = {
     name:"John"
 }
 function test(num,school){
     console.log('我的名字叫'+this.name+",我今年高考考了"+num+"分,被"+school+'录取')
 }
let ts = test._bind(obj,745,'北京大学')
ts()
```
**3.提前返回**  
举个栗子：封装一个元素绑定事件监听器
```js
let addEvent = function(el,type,fn,capture){
    if(window.addEventListener){
        el.addEventListener(type,function(e){
            fn.call(el,e)
        },capture)
    }else if(window.attachEvent){
        el.attachEvent('on'+type,function(e){
            fn.call(el,e)
        })
    }
}
```
以上代码是为了兼容IE浏览器对DOM事件绑定做的函数封装。  
这样写的问题是：每次对DOM元素进行事件绑定时，函数内部都会走一遍if else。  
那么用函数柯里化，就可以实现提前返回：  
```js
let addEvent = (function(){
    if(window.addEventListener){
        return function(el,type,fn,capture){
            el.addEventListener(type,function(e){
                fn.call(el,e)
            },capture)
        }
    }else if(window.attachEvent){
        return function(el,type,fn,capture){
            el.attachEvent('on'+type,function(e){
                fn.call(el,e)
            })
        }
    }
})()
```
这样写，提前确定了会走哪一个方法，避免每次都进行判断。 
### 通用柯里化函数的封装
```js
const curring = (fn,arr=[]) =>{ 
    let len = fn.length;//函数的长度 就是参数的个数
    return (...args) => {
        arr.concat(args) //收集参数 存放数组里
        if(arr.length < len){ //判断收集的数组长度 是否小于参数的长度
            return curring(fn,arr)//如果小于继续执行curring函数  递归 收集参数  当前参数为fn arr
        }
        return fn(...arr) //否则 执行传入的fn函数
    }
}

const add = (a,b,c,d,e) => {
    return a+b+c+d+e
}

let r = curring(add)(1)(2)(3)(4,6)
console.log(r) //16
```

### 利用call/apply封装数组的map方法   
>map():对数组的每一项给定函数，返回每次函数调用的结果组成的数组。  
通俗的来说，就是遍历数组的每一项元素，并且在map的第一个参数（回调函数）中进行运算处理，并返回计算结果，返回一个由所有计算结果组成的新数组。
```js
//回调函数中有三个参数   
//第一个参数表示newArr的每一项，第二个参数表示该项在数组中的索引值  
//第三个表示数组本身    
//除此之外，回调函数中的this，当map不存在第二个参数时，this指向丢失，当存在第二个参数时，指向该参数所设定的对象   
 
const newArr = [1,2,3,4].map(function(item,i,arr){
    console.log(item,i,arr,this)
    return item*2
},{a:1})
console.log(newArr)

//1 0 (4) [1, 2, 3, 4] {a: 1}
//2 1 (4) [1, 2, 3, 4] {a: 1}
//3 2 (4) [1, 2, 3, 4] {a: 1}
// 4 3 (4) [1, 2, 3, 4] {a: 1}
//  [2, 4, 6, 8]
```
下面进行map方法的封装，让函数成为map方法的第一个参数
```js
Array.prototype._map = function(fn,context){
    const temp = []
    if(typeof fn == 'function'){
        for(let i=0;i<this.length;i++){
            temp.push(fn.call(context,this[i],i,this))
        }
    }else{
        console.error('TypeError:'+fn+'is not a function.')
    }
    return temp;
}

const newArr = [1, 2, 3, 4]._map(function(item) {
    return item + 1;
})
 
console.log(newArr)

//[2,3,4,5]
```

