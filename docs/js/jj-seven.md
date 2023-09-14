# JS原型与原型链

### 何为原型

#### 《你不知道的javascript》对原型的描述：
> javascript中的对象有一个特殊的 [[Prototype]] 内置属性，其实就是对其他对象的引用。几乎所有的对象在创建时 [[Prototype]] 都会被赋予一个非空的值。
#### 《javascript高级程序设计》这样描述原型:
> 每个函数都会创建一个prototype属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法都可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型。

#### 通过代码来理解一下
```js
    function Person() { }
    // 在Person的原型对象上挂载属性和方法
    Person.prototype.name = 'xiaoming'
    Person.prototype.age = 18
    Person.prototype.getName = function () {
        return this.name
    }
    const men = new Person()
    console.log('men: ',men)
    console.log('getName: ',men.getName())
```
#### 上面代码在chrome控制台中运行的结果
![Alt prototype](/jsImg/prototype.png)

可以看到，我们先是创建了一个空的构造函数Person，然后创建了一个Person的实例men，men本身是没有挂载任何属性和方法的，但是它有一个[[Prototype]]内置属性，这个属性是个对象，里面有name、age属性和getName函数,仔细观察不难看出，不就是上面写的Person.prototype对象吗


事实上，Person.prototype和men的[[Prototype]]都指向同一个对象，这个对象对于Person构造函数而言叫做原型对象，对于men实例而言叫做原型。下面一张图直观地展示上述代码中构造函数、实例、原型之间的关系：
![Alt prototype](/jsImg/prototype1.png)

因此，构造函数、原型和实例的关系是这样的：每个构造函数都有一个原型对象（实例的原型），原型有一个constructor属性指回构造函数，而实例有一个内部指针指向原型。

在chrome、firefox、safari浏览器环境中这个指针就是__proto__，其他环境下没有访问[[Prototype]]的标准方式。

### 原型链

在上述原型的基础上，如果men的原型是另一个类型的实例呢？于是men的原型本身又有一个内部指针指向另一个原型，相应的另一个原型也有一个指针指向另一个构造函数。这样，实例和原型之间形成了一条长长的链条，这就是原型链。
> 所有普通的[[Prototype]]都会指向内置的Object.prototype，而Object的[[Prototype]]指向null。也就是说所有的普通对象都源于Object.prototype，它包含javascript中许多通用的功能。

在原型链中，如果在对象上找不到需要的属性或者方法，引擎就会继续在[[Prototype]]指向的原型上查找，同理，如果在后者也没有找到需要的东西，引擎就会继续查找它的[[Prototype]]指向的原型。如下图所示：

![Alt prototype](/jsImg/prototype2.png)