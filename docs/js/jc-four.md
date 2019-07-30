### js中节流与防抖 

**一、函数防抖（debounce）**
>函数防抖，就是指触发事件后在n秒内函数只执行一次，如果在n秒内又触发了事件，则会重新计算函数执行时间。  

简单的说,当一个动作连续触发，则只执行最后一次。   
实现方式：每次触发事件时设置一个延迟调用方法，并且取消之前的延时调用方法   
缺点：如果事件在规定时间间隔内被不断的触发，则调用方法会被不断的延迟   

```js
function debounce(fn,delay){
    let timeout = null ;//创建一个标记用来存放定时器的返回值
    return function(){
        //清除上一个 setTimeout
        clearTimeout(timeout)
        //然后新建一个timeout 
        timeout = setTimeout(()=>{
            fn.apply(this,arguments)
        },delay)
    }
}
```

**二、函数节流（throttle）**
>函数节流，高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率   
 
实现方式：每次触发事件时，如果当前有等待执行的函数，则直接return

```js
function throttle(fn,delay){
    let flag = true;//通过闭包保存一个标记
    return function(){
        //在函数开头判断标记是否为true，不为true则return
        if(!flag) return
        //立即设置为false
        flag = false;
        //将外部传入的函数的执行放在setTimeout中
        setTimeout(()=>{
            //最后在setTimeout执行完毕后再把标记设置为true，表示可以执行下一次循环了
            //当定时器没有执行的时候，标记永远是false，在开头就被return
            fn.apply(fn,arguments)
            flag = true
        },delay)
    }
}
```
另一种节流实现方式  

```js
function throttle(fn,delay){
    //利用闭包保存时间
    let prev = Date.now()
    return function(){
        let now = Date.now()
        if(now - prev >= delay){
            fn.apply(this,arguments)
            prev = Date.now()
        }
    }
}
```