### js中call、apply的基本实现  

**call**
+ 改变this指向
+ 调用函数
```js
 Function.prototype._call = function(target){
     if(typeof this !== 'function'){//此时this指的是test函数
         throw new TypeError('error')
     }
     let context = target || window;//上下文指向target，target为null或不存在时，指向window
     const args = [...arguments].splice(1);//除了target之外的参数 
     context.fn = this;//给context创建一个fn属性，并将值设置为需要调用的函数  改变this指向
     context.fn(...args);//执行函数 并传参
     delete context.fn //删除添加的属性
 }
 //测试
  let obj = {
     name:"John"
 }
 function test(num,school){
     console.log('我的名字叫'+this.name+",我今年高考考了"+num+"分,被"+school+'录取')
 }
test._call(obj,745,'北京大学')
//我的名字叫John,我今年高考考了745分,被北京大学录取
```

**apply**   
与call类似  传参方式不一样   
```js
Function.prototype._apply = function(target){
    if(typeof this !== 'function'){
        throw new TypeError('error')
    }
    let context = target || window;
    context.fn = this;
    if(arguments[1]){//参数为一个数组
        context.fn(...arguments[1]);
    }else{
        context.fn();
    }
    delete context.fn
}
//同上 测试
test._apply(obj,[745,'北京大学'])
//我的名字叫John,我今年高考考了745分,被北京大学录取
```