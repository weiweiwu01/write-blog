### Vue.use  
Vue提供了 <font color='#ffa200'>Vue.use</font>的全局API来注册插件。 
从一个简单的例子入手：   
首先用vue-cli3脚手架，搭建一个vue-demo项目， 具体操作命令如下
```js
npm install -g @vue/cli //全局安装
Vue -V//安装成功后 查看安装版本
vue create vue-demo
cd vue-demo
npm run serve
```
接下来新建两个js文件：
```js
//文件： src/classes/vue-use/plugins.js
const Plugin1 = {
    install(a,b,c){
        console.log('Plugin1 第一个参数:', a);
        console.log('Plugin1 第二个参数:', b);
        console.log('Plugin1 第三个参数:', c);
    }
}

function Plugin2(a, b, c) {
    console.log('Plugin2 第一个参数:', a);
    console.log('Plugin2 第二个参数:', b);
    console.log('Plugin2 第三个参数:', c);
}

export { Plugin1 , Plugin2 }
```
```js
//文件： src/classes/vue-use/index.js
import Vue from 'vue'
import { Plugin1 , Plugin2 } from './plugins'

Vue.use(Plugin1,'1','2')
Vue.use(Plugin2,'3','4')
```
然后我们在入口文件<font color='#ffa200'>main.js</font>引用代码
```js
import Vue from 'vue'
import App from './App.vue'
import '@/classes/vue-use'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```
此时，执行npm run serve启动项目，打开页面控制台，看到如下信息：  

![avatar](/vueImg/vue-plugins.png)  
 
下面我们来分析一下，上面的结果：   
<font color='#ffa200'>plugin1</font>中的<font color='#ffa200'>install</font>方法编写的三个console都打印出来了，第一个打印出来的是Vue对象，第二个和第三个是我们传入的两个参数。   
而<font color='#ffa200'>plugin2</font>没有<font color='#ffa200'>install</font>方法，它本身就是一个方法，也能打印三个参数，第一个是vue对象，第二个和第三个也是我们传入的两个参数。  
那么，我们可以大概猜想一下<font color='#ffa200'>Vue.use</font>的实现。    
现在，直接上源码：  
```js
//定义在vue/src/core/global-api/use.js
export function initUse(Vue: GlobalAPI){
 Vue.use = function(plugin: Function | Object){
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if(installedPlugins.indexOf(plugin) > -1){
        return this
    }
    const args = toArray(arguments,1)
    args.unshift(this)
    if(typeof plugin.install === 'function'){
        plugin.install.apply(plugin,args)
    }else if(typeof plugin === 'function'){
        plugin.apply(null,args)
    }
    installedPlugins.push(plugin)
    return this
 }
}

```

<font color='#ffa200'>Vue.use</font>接受一个<font color='#ffa200'>plugin</font>参数，并且维护了一个<font color='#ffa200'>_installedPlugins</font>数组，它储存了所有注册过的<font color='#ffa200'>plugin</font>，接下来判断该<font color='#ffa200'>plugin</font>是否被注册过，不允许重复注册。然后是把参数转换为数组，并把<font color='#ffa200'>vue</font>对象放到数组的第一位。这里还对接受的<font color='#ffa200'>plugin</font>的参数做了限制，是<font color='#ffa200'>Function | Object</font>两种类型，只能是对象或方法。并对两种类型分别做不同的处理，判断<font color='#ffa200'>plugin</font>有没有<font color='#ffa200'>install</font>方法，如果有的话，则调用该方法，并且该方法执行的第一个参数时<font color='#ffa200'>vue</font>，否则判断该<font color='#ffa200'>plugin</font>是不是一个方法，执行该方法，最后，把<font color='#ffa200'>plugin</font>存储到<font color='#ffa200'>installedPlugilistns</font>中去。   

接下来，看一下<font color='#ffa200'>toArray</font>源码
```js
//定义在vue/src/core/shared/util.js
export function toArray(list: any,start?: number):Array<any>{
    start = start || 0
    let i = list.length - start
    const ret: Array<any> = new Array(i)
    while(i--) {
        ret[i] = list[i + start]
    }
    return ret
}
```

可以看到 <font color='#ffa200'>Vue</font> 提供的插件注册机制很简单，通常情况下，每个插件都需要实现一个静态的 <font color='#ffa200'>install</font> 方法，当我们执行 <font color='#ffa200'>Vue.use</font> 注册插件的时候，就会执行这个 <font color='#ffa200'>install</font> 方法，并且在这个 <font color='#ffa200'>install</font> 方法的第一个参数我们可以拿到 <font color='#ffa200'>Vue</font> 对象，这样的好处就是作为插件的编写方不需要再额外去 <font color='#ffa200'>import Vue</font> 了。
















