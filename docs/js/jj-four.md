# js进阶-4 斐波那契数列
>斐波那契数列（Fibonacci sequence），又称黄金分割数列，因数学家莱昂纳多·斐波那契（Leonardo Fibonacci）以兔子繁殖为例子而引入，故又称“兔子数列”，其数值为：1、1、2、3、5、8、13、21、34……在数学上，这一数列以如下递推的方法定义：F(0)=1，F(1)=1, F(n)=F(n - 1)+F(n - 2)（n ≥ 2，n ∈ N*）。
### 下面用不同的方式实现一个函数，用来返回斐波那契数列的第N项

#### 1、递归
```js
    function fb1(n) {
        if( n ===1 || n === 2 ) return 1
        return fb1(n-1)+fb1(n-2)
    }
```
#### 2、迭代 递推
```js
    function fb2(n) {
        let cur = 1
        let next = 1
        if( n ===1 || n === 2 ) return next
        for(let i = 3;i<=n;i++) {
            [cur,next] = [next,cur+next] 
        }
        return next
    }
```
#### 3、数组 动态规划
```js
    function fb3(n){
        if( n ===1 || n === 2 ) return 1
        const num = [1,1]
        for(let i = 2; i < n; i++){
            num[i] =  num[i-1] + num[i-2]
        }
        return num.pop()
    }
```
#### 4、尾递归（尾调用）
```js
    function fb4(n,cur=1,next=1) {
        if( n ===1 || n === 2 ) return next
        return fb4(n-1,next,cur+next)
    }
```
### 通过代码执行时长，来看每种实现方式的性能
```js
    console.time('fb1')
    console.log('*********1', fb1(40))
    console.timeEnd('fb1')
    console.time('fb2')
    console.log('*********2', fb2(40))
    console.timeEnd('fb2')
    console.time('fb3')
    console.log('*********3', fb3(40))
    console.timeEnd('fb3')
    console.time('fb4')
    console.log('*********4', fb4(40))
    console.timeEnd('fb4')
    控制台打印结果：
    *********1 102334155
    fb1: 1020.323974609375 ms
    *********2 102334155
    fb2: 0.13720703125 ms
    *********3 102334155
    fb3: 0.06201171875 ms
    *********4 102334155
    fb4: 0.15478515625 ms
```
### 由以上结果可以得出如下结论：
#### 1、递归调用非常的消耗性能，并且当n非常大的时候，递归深度过大导致栈内存溢出，即“爆栈”
#### 2、有相当多的重复计算
    fb(7)
    = fb(6) + fb(5) // 这里计算了f(5)，下面又计算了一次f(5)
    = (fb(5) + fb(4)) + (fb(4) + fb(3)) // 这里计算了两次f(5)
    ...
#### 3、解决上面两个问题，采用尾递归。
尾调用：一个函数里的最后一个动作是返回一个函数的调用结果，即最后一步新调用的返回值被当前函数返回。<br />
尾递归: 如果函数在尾调用位置调用自身。<br />
尾递归是一种特殊的尾调用，即在尾部直接调用自身的递归函数。由于尾调用消除，使得尾递归只存在一个栈帧，所以永远不会“爆栈”。