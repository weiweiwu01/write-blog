### new的过程与实现

```js
function myNew(obj,...arg) {
    // 1.创建一个新对象
    let _obj = {}
    // 2.新对象原型指向构造函数原型对象
    _obj.__proto__ = obj.prototype
    // 3.将构建函数的this指向新对象
    let result = obj.call(_obj,...arg)
    // let result = obj.apply(_obj, args)
    // 4.根据返回值判断
    return result instanceof Object ? result : _obj
}
```
>new关键字主要做了以下的工作：

1、创建一个新的对象obj

2、将对象与构建函数通过原型链连接起来

3、将构建函数中的this绑定到新建的对象obj上

4、根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理