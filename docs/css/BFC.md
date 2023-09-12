# BFC

### BFC 何方神圣？

> BFC（Block Formatting Context）块级格式化上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。与区域外部无关。

### 如何创建BFC

+ 浮动元素，float 除 none 以外的值
+ 定位元素，position（absolute，fixed）
+ display 为以下其中之一的值 inline-block，table-cell，table-caption
+ overflow 除了 visible 以外的值（hidden，auto，scroll）

### BFC有啥特性

+ 内部的Box会在垂直方向上一个接一个的放置。
+ 垂直方向上的距离由margin决定
+ BFC的区域不会与float的元素区域重叠。
+ 计算BFC的高度时，浮动元素也参与计算
+ BFC就是页面上的一个独立容器，容器里面的子元素不会影响外面元素

### BFC的其他作用

+ BFC可以消除margin塌陷
+ BFC可以阻止元素被浮动元素覆盖