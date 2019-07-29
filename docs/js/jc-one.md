### javaScript基础知识
**一、函数的隐式转换**  
JavaScript作为一种弱类型语言，它的隐式转换是非常灵活有趣的。  
例如：简单的 <font color='#ffa200'>4 + true = 5; !!undefined = false </font>    
下面说一下函数的隐式转换，来一个简单的思考题：
```js
function fn(){
    return 20
}
console.log(fn + 10)

//结果为：
//function fn(){
//    return 20
//}10
```
稍微修改一下，再看看输出结果是什么？
```js
function fn(){
    return 20
}

fn.toString = function(){
    return 10
}

console.log(fn + 10)

//结果为  
// 20
```
还可以继续修改一下  
```js
function fn(){
    return 20
}

fn.toString = function(){
    return 10
}

fn.valueOf = function(){
    return 5
}

console.log(fn + 10)

//结果为  
// 15
```  

首先我们要知道，当使用console.log、或者进行运算时，就会发生隐式转换。从上面三个相似的例子中我们可以得出一些结论：
>当我们没有重新定义toString和valueOf时，函数的隐式转换会调用默认的toString方法，它会将函数的定义内容作为字符串返回。而当我们主动定义了toString和valueOf方法时，那么隐式转换的返回结果则由我们自己控制了。其中，valueOf的优先级会比toString高一点。   

等待更新中......