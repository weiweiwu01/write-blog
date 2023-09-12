# 作用域与作用域链

### 什么是作用域

#### 简单来说，作用域（英文：scope）是据名称来查找变量的一套规则，可以把作用域通俗理解为一个封闭的空间，这个空间是封闭的，不会对外部产生影响，外部空间不能访问内部空间，但是内部空间可以访问将其包裹在内的外部空间。

### [[Scopes]]属性

+ 在javascript中，每个函数都是一个对象，在对象中有些属性我们可以访问，有些我们是不能自由访问的，[[Scopes]]属性就是其中之一，这个属性只能被JavaScript引擎读取。
+ 其实[[scope]]就是我们常说的作用域，其中存储了作用域运行期的上下文集合。
+ 在这里因为fn.prototype.constructor和fn指向同一个函数，所以在这里我们通过访问函数func的原型对象来查看[[Scopes]]属性

```js
    function fn(a) {
        var a = 123
        function b() {
            console.log(a)
            } 
            b()
    }
    fn(1)
```

![Alt text](/jsImg/scope.png)

### 作用域链

[[scope]]中存储的执行期的上下文对象的集合，这个集合呈链式连接，我们把这种链式连接叫做作用域链。JavaScript正是通过作用域链来查找变量的，其查找方式是沿着作用域链的顶端依次向下查询（在哪个函数内部查找对象，就在哪个函数作用域链中查找）

![Alt text](/jsImg/scope1.png)

### 执行过程如下
+ 1、fn函数被创建，保存作用域链到 内部属性[[Scope]]
> fn.[[Scope]] = [ globalContext.VO]

+ 2、执行 fn 函数，创建 fn 函数执行上下文，fn 函数执行上下文被压入执行上下文栈

> ECStack = [   
        fnScopeContext,<br/>
        globalContext <br/>
]