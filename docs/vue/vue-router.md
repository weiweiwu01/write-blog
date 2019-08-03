### VueRouter 对象
#### **首先，我们整体看一下vue-router的使用方式，分为以下几步**  
```js
import Vue from 'vue'
import Router from 'vue-router'
//注册插件  如果是在浏览器环境运行的，可以不写该方法
Vue.use(Router)

//1、定义（路由）组件 
//可以从其他文件import进来
const User = { template: '<div>用户</div>' }
const Role = { template: '<div>角色</div>' }

//2、定义路由
//Array，每个路由应该映射一个组件
const routes = [
  { path: '/user', component: User },
  { path: '/home', component: Home }
]

//3、创建router实例，并传routes配置
const createRouter = new Router({
    routes
})

//4、创建和挂载根实例。
//通过router对象以参数注入vue，从而让整个应用都有路由功能
//使用router-link组件来导航
//路由出口
//路由匹配到的组件将渲染在这里  
const app = new Vue({
    router,
    template:`
     <div id="app">
       <h1>Basic</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/user">用户</router-link></li>
        <li><router-link to="/role">角色</router-link></li>
        <router-link tag="li" to="/user">/用户</router-link>
      </ul>
      <router-view class="view"></router-view>
     </div>
    `
}).$mount('#app')
```
#### **接下来，看一下vue-router的源码结构**

![avatar](/vueImg/vue-router.png)  

>components 下是两个组件 `<router-view>` 和 `<router-link>`  
history 是路由方式的封装，提供三种方式  
util 下主要是各种功能类和功能函数  
create-matcher 和 create-route-map 是生成匹配表  
index 是 VueRouter 类，也是整个插件的入口  
install 提供安装方法    

#### **分析开始**
**第一步**  
>Vue是使用.use(plugins)方法将插件注册到Vue中。  
use方法会检测注入插件router内的install方法，如果有，则执行install方法。  
注意：如果是在浏览器环境，在index.js内会自动调用.use方法。如果基于node环境，需要手动调用。
```js
if(inBrowser && window.Vue){
    window.Vue.use(Router)
}
```
>**install解析**(对应目录结构的install.js)   
该方法主要做了一下三件事：  
1、对Vue实例混入beforeCreate钩子操作（在Vue的生命周期阶段会被调用）   
2、通过Vue.prototype定义router、route属性（方便所有组件可以获取这两个属性）   
3、Vue上注册router-link和router-view两个组件    

```js
import View from './components/view'
import Link from './components/link'
//声明一个私有的_Vue用来接收外部的Vue类
export let _Vue
//install方法接收一个参数，也就是Vue类,Vue.use注册时会调用install，并把vue实例作为第一个参数传入
export function install(Vue){
    //如果已经被注册了，直接return
    if(install.installed && _Vue === vue) return

    install.installed = true
    //把Vue类赋值给私有_Vue
    _Vue = vue
    //声明一个方法，用来判断值是否为undefined
    const isDef = v => v !== undefined
    //注册实例方法
    const registerInstance = (vm,callval) => {
        //vm 就是vue component
        let i = vm.$options._parentVnode
        if(isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)){
            i(vm, callval)
        }
        //这是一个类似链式调用的方式
        //目的是确保能确定 this.$options._parentVnode.data.registerRouteInstance存在
        //如果找到，就把值赋给这个方法  然后执行它
    }
}

Vue.mixin({
    //对Vue实例混入beforeCreate钩子操作
    beforeCreate () {
        //只有根节点的 $options的属性中有 router
        if(isDef(this.$options.router)){
            this._routerRoot = this
            this._router = this.$options.router
            this._router.init(this)
            Vue.util.defineReactive(this,'_route',this._router.history.current)
        }else{
            this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
        }
        registerInstance(this, this)
    },
    destroyed () {
        registerInstance(this)
    }
})
//通过Vue.prototpye定义$router、$route属性（方便所有组件可以获取这两个属性）
Object.defineProperty(Vue.prototype,'$router',{
    get(){ return this._routerRoot._router }
})

Object.defineProperty(Vue.prototype,'$route',{
    get(){ return this._routerRoot._route }
})
//Vue上注册router-link和router-view两个组件
Vue.component('RouterView',View)
Vue.component('RouterLink'.Link)

const strats = Vue.config.optionMergeStrategies
// use the same hook merging strategy for route hooks
strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
```



