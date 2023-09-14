# React运行机制

### 首先我们需要了解什么是JSX

JSX 是一个基于 JavaScript + XML 的一个扩展语法。可以使用babel.js在浏览器中处理JSX。

JSX本质是React.createElement(component,props,children)函数的语法糖。

#### React17和17之前的差异
> 在 React 17 新增了 JSX-runtime，可以将 JSX 直接编译成 虚拟DOM;<br/>
> 在 React 17 之前，JSX 将会被编译成 React.createElement();

所以，在 17 及之后，如果模块中，只用到了 React 的 JSX ，则不需要引入 React 依赖

#### JSX使用注意事项
> 必须有,且只有一个顶层的包含元素 - React.Fragment，即文档碎片，用于充当包含容器，并不会在DOM解析出来，react17之后也可以使用空标签（<></>）充当包含容器。<br/>
> JSX 不是html，也不是字符串，很多属性在编写时不一样，如：className、style<br/>
> 列表渲染时，必须有 key 值<br/>
> 在 jsx 所有标签必须闭合<br/>
> 组件的首字母一定大写，标签一定要小写<br/>

### 举个栗子
```js
return (
    <div>
        Hello  Word 
    </div>
)

实际上是：

return React.createElement(
  "div",
  null,
  "Hello"
)

JSX本质上就是转换为React.createElement在React内部构建虚拟Dom，最终渲染出页面。
```

### 虚拟Dom
#### react简版的vnode：
```js
function createElement(type, props, ...children) {
  props.children = children;
  return {
    type,
    props,
    children,
  };
}
```
> 这里的vnode很好理解: <br/>
> type表示类型，如div,span，<br/>
> props表示属性，如{id: 1, style:{color:red}},<br/>
> children表示子元素<br/>

### 原理简介

```js
import React from 'react'
import ReactDOM from 'react-dom'
function App(props){
     return <div>你好</div>
}
ReactDOM.render(<App/>,  document.getElementById('root'))
```
React负责逻辑控制，数据 -> VDOM

首先，我们可以看到每一个js文件中，都一定会引入import React from ‘react’。但是我们的代码里边，根本没有用到React。但是你不引入他就报错了。

为什么呢？我们可以这样理解，在上述的js文件中，我们使用了jsx。但是jsx并不能编译，所以报错了。这时候，需要引入react，而react的作用，就是把jsx转换为“虚拟dom”对象。

JSX本质上就是转换为React.createElement在React内部构建虚拟Dom，最终渲染出页面。而引入React，就是为了实现这个过程。

ReactDom渲染实际DOM，VDOM -> DOM

理解好这一步，我们再看ReactDOM。React将jsx转换为“虚拟dom”对象。我们再利用ReactDom的虚拟dom通过render函数，转换成dom。再通过插入到我们的真是页面中。