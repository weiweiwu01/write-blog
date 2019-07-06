## js进阶-1 JavaScript高阶函数初探

### Highter-order function 高阶函数定义
在JavaScript中，函数是一种特殊类型的对象--Function objects,是指至少满足下列条件之一的函数:
+ 函数可以作为参数被传递
+ 函数可以作为返回值输出  
简单来说，高阶函数是一个接受函数作为参数传递或者函数作为返回值输出的函数。  
举个栗子，一个简单的高阶函数：  
```
function add(x,y,f){
    return f(x)+f(y)
}
```
当我们调用add(-5,6,Math,abs)时，参数x,y和f分别接受-5,6和函数Math.abs，根据函数定义，我们可以推导计算过程为：
```
x = -5;
y = 6;
f = Math.abs;
f(x) + f(y) ==> Math.abs(-5)  +Math.abs(6) ==> 11;
return 11;
```
 ### 函数作为参数传递
 JavaScript语言中内置了一些高阶函数，比如<font color='#ffa200'>Array.prototype.map,Array.prototype.filter和Array.prototype.reduce</font>，它们接受一个函数作为参数，并应用这个函数到列表的每一个元素。
 #### Array.prototype.map  
 map()方法会创建一个**新数组**，其结果是该数组中的每个元素都调用一个**提供的函数**后返回的结果，**原始数组不会改变**。传递给map的回调函数（callback）接受三个参数，分别是currentValue、index(可选)、array（可选），除了callback之外还可以接受this值（可选），用于执行callback函数时使用的this值。  
举个栗子：现在有一个数组<font color='#ffa200'>[1,2,3,4]</font>,我们想要生成一个新数组，要求新数组的每个元素都是之前数组元素的平方，下面分别用高阶和不使用高阶函数的方式实现。  
**不使用高阶函数**
```
const arr1 = [1,2,3,4];
const arr2 = [];
for(let i = 0;i < arr1.length; i++){
    arr2.push(arr1[i]*arr1[i]);
}
console.log(arr2);
//[1,4,9,16]
console.log(arr1);
//[1,2,3,4]
```
**使用高阶函数**
```
const arr1 = [1,2,3,4];
const arr2 = arr1.map(item => item * item);
console.log(arr2);
//[1,4,9,16]
console.log(arr1);
//[1,2,3,4]
```
事实上，我们可以声明一个函数<font color='#ffa200'>f(x)=x<sup>2</sup></font>来求平方，如下：
```
function pow(x){
    return x * x;
}
const arr1 = [1,2,3,4];
const arr2 = arr1.map(item => pow;
```
我们调用Array的<font color='#ffa200'>map()</font>方法，传入我们自己的函数，就得到了一个新的Array作为结果。
::: warning
<font color='#ffa200'>map()</font>传入的参数是<font color='#ffa200'>pow</font>，即函数对象的本身。
:::
所以，<font color='#ffa200'>map()</font>作为高阶函数，事实上它把运算规则抽象了，因此我们不但可以计算简单的f(x)=x<sup>2</sup>,还可以计算任意复杂的函数。  
比如，把Array的所有数字转为字符串：
```
const arr = [1,2,3,4,5,6,7,8];
arr.map(String);//['1','2','3','4','5','6','7','8']
```
比如，把Array的所有数字负数转为正数：
```
const arr = [1,-2,3,4,-5,6,-7,-8];
arr.map(Math.abs);//[1,2,3,4,5,6,7,8]
```
都只需一行代码。
 #### Array.prototype.filter 
 <font color='#ffa200'>filter()</font>方法创建一个新数组，其包含通过提供函数实现的条件筛选的所有元素，**原始数组不会改变**。接受的参数和map是一样的，其返回值是一个新数组、由通过条件筛选的所有元素组成，如果没有任何数组元素通过测试，则返回空数组。
 举个栗子：现在有一个数组<font color='#ffa200'>[1,1,1,2,3,3,3,4,4,5,6,7,7,8,8,9]</font>,我们想要生成一个新数组，要求新数组的每个元素都不重复，即数组去重，下面分别用高阶和不使用高阶函数的方式实现。  
**不使用高阶函数**
```
const arr1 = [1,1,1,2,3,3,3,4,4,5,6,7,7,8,8,9];
const arr2 = [];
for (let i = 0; i < arr1.length; i++) {
  if (arr1.indexOf( arr1[i] ) === i) {
    arr2.push( arr1[i] );
  }
}
console.log( arr2 );
// [1, 2, 3, 4,5,6,7,8,9]
console.log( arr1 );
// [1,1,1,2,3,3,3,4,4,5,6,7,7,8,8,9]
```
**使用高阶函数**
```
const arr1 = [1,1,1,2,3,3,3,4,4,5,6,7,7,8,8,9];
const arr2 = arr1.filter((item,index,self) => {
    return self.indexOf( item ) === index;
});
console.log( arr2 );
// [1, 2, 3, 4,5,6,7,8,9]
console.log( arr1 );
// [1,1,1,2,3,3,3,4,4,5,6,7,7,8,8,9]
```
 #### Array.prototype.reduce
 <font color='#ffa200'>reduce()</font>方法对数组中的每个元素执行一个提供的**reducer**函数(升序执行)，将其结果汇总为单个返回值。传递给reduce的回调函数（<font color='#ffa200'>callback</font>）接受四个参数，分别是累加器accumulator、currentValue、currentIndex（可选）、array（可选），除了<font color='#ffa200'>callback</font>之外还可以接受初始值 initialValue 值（可选）。
 + 如果没有提供 initialValue，那么第一次调用 <font color='#ffa200'>callback</font> 函数时，accumulator 使用原数组中的第一个元素，currentValue 即是数组中的第二个元素。 在没有初始值的空数组上调用 reduce 将报错。
 + 如果提供了 initialValue，那么将作为第一次调用 <font color='#ffa200'>callback</font> 函数时的第一个参数的值，即 accumulator，currentValue 使用原数组中的第一个元素。
 举个栗子：现在有一个数组<font color='#ffa200'>[0,1,2,3,4,5]</font>,需要计算数组元素的和，下面分别用高阶和不使用高阶函数的方式实现。 
 **不使用高阶函数**
 ```
const arr = [0,1,2,3,4,5];
let sum = 0;
for (let i = 0; i < arr.length; i++) {
sum += arr[i];
}

console.log( sum );
// 15
console.log( arr );
// [0,1,2,3,4,5]

 ```
 **使用高阶函数**
 **无 initialValue 值**
 ```
const arr = [0,1,2,3,4,5];
let sum = arr.reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue;
});

console.log( sum );
// 15
console.log( arr );
// [0,1,2,3,4,5]

 ```
上面是没有 initialValue 的情况，代码的执行过程如下，callback 总共调用五次。  
callback|accumulator|currentValue|currentIndex|array|return value
:--|:--:|:--:|:--:|:--:|:--:
first call|0|1|1|[0,1,2,3,4,5]|1
second call|1|2|2|[0,1,2,3,4,5]|3
third call|3|3|3|[0,1,2,3,4,5]|6
fourth call|6|4|4|[0,1,2,3,4,5]|10
fifth call|10|5|5|[0,1,2,3,4,5]|15
 **有 initialValue 值**
 我们再来看下有 initialValue 的情况，假设 initialValue 值为 10，我们看下代码。
 ```
const arr = [0,1,2,3,4,5];
let sum = arr.reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue;
}, 10);

console.log( sum );
// 25
console.log( arr );
// [0,1,2,3,4,5]

 ```
 代码的执行过程如下所示，callback 总共调用六次。
 callback|accumulator|currentValue|currentIndex|array|return value
:--|:--:|:--:|:--:|:--:|:--:
first call|10|0|0|[0,1,2,3,4,5]|10
second call|10|1|1|[0,1,2,3,4,5]|11
third call|11|2|2|[0,1,2,3,4,5]|13
fourth call|13|3|3|[0,1,2,3,4,5]|16
fifth call|16|4|4|[0,1,2,3,4,5]|20
sixth call|20|5|5|[0,1,2,3,4,5]|25
### 函数作为返回值输出  
其实，就是返回一个函数  
直接举栗子吧：
**isType函数**
我们知道在判断类型的时候可以通过 <font color='#ffa200'>Object.prototype.toString.call</font> 来获取对应对象返回的字符串，比如：  
```
let isString = obj => Object.prototype.toString.call( obj ) === '[object String]';

let isArray = obj => Object.prototype.toString.call( obj ) === '[object Array]';

let isNumber = obj => Object.prototype.toString.call( obj ) === '[object Number]';

```
可以发现上面三行代码有很多重复代码，只需要把具体的类型抽离出来就可以封装成一个判断类型的方法了，代码如下
```
let isType = type => obj => {
  return Object.prototype.toString.call( obj ) === '[object ' + type + ']';
}

isType('String')('123');		// true
isType('Array')([1, 2, 3]);	// true
isType('Number')(123);			// true

```
这里就是一个高阶函数，因为 isType 函数将<font color='#ffa200'>obj => { ... }</font>这一函数作为返回值输出。
**add函数**
我们看一个常见的面试题，用 JS 实现一个无限累加的函数 add，示例如下：
```
add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10 

// 以此类推

```
我们可以看到结构和上面代码有些类似，都是**将函数作为返回值输出**，然后接收新的参数并进行计算。  
我们知道打印函数时会自动调用 <font color='#ffa200'>toString()</font> 方法，函数 <font color='#ffa200'>add(a)</font> 返回一个闭包 <font color='#ffa200'> sum(b)</font> ，函数 <font color='#ffa200'>sum()</font> 中累加计算 <font color='#ffa200'>a = a + b</font> ，只需要重写 <font color='#ffa200'>sum.toString()</font> 方法返回变量 <font color='#ffa200'>a</font> 就可以了。  
```
function add(a) {
    function sum(b) { // 使用闭包
    	a = a + b; // 累加
    	return sum;
    }
    sum.toString = function() { // 重写toString()方法
        return a;
    }
    return sum; // 返回一个函数
}

add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10 

```
