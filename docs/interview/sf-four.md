# 动态规划

## 定义

动态规划（Dynamic Programming）是一种将一个问题分解成多个子问题，从而简化问题，提升效率的算法思想。它可以应用于各种算法领域，如最短路径问题、背包问题、字符串匹配问题等。在JavaScript中，动态规划可以用于优化算法性能，提高程序效率。

## 状态转移方程

相同问题在不同规模下的关系

> 斐波那契数列的状态转移方程： <br />
当n>2

```js
dp(n) = dp(n-1) + dp(n-2)
```

> 当n<=2

```js
dp(n) = 1
```

寻找状态转移方程的一般步骤：

+ 1、找到相同问题（重叠子问题），「相同问题」必须能适配不同的规模
+ 2、找到重叠子问题之间的关系
+ 3、找到重叠子问题特殊解

## 举个栗子 

### leetcode 62. 不同路径

一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
问总共有多少条不同的路径？

示例 1：

输入：m = 3, n = 2
输出：3
解释：
从左上角开始，总共有 3 条路径可以到达右下角。

1. 向右 -> 向下 -> 向下
2. 向下 -> 向下 -> 向右
3. 向下 -> 向右 -> 向下

示例 2：

输入：m = 7, n = 3
输出：28

**解题：**

第一步：找到相同问题（重叠子问题），「相同问题」必须能适配不同的规模

```js
dp(i, j) 表示到达第i行、第j列共有多少条路径
加入 m行 n列 则最终解为 dp(m-1, n-1)
普通解也可以表示，比如 dp(1, 2)
```

第二步：找到重叠子问题之间的关系

```js
一般情况下，到达某一点的方式只有两种，要么从上边过来，要么从左边过来。那么到达某一点的路径的方式，
就等于到达其上一点的方式和到达其左一点的方式只和。即：
dp(i, j) = dp(i-1, j) + dp(i, j-1)   // 状态转移方程
```

第三步：找到重叠子问题特殊解

```js
针对这个问题，特殊解在第一行或者第一列的时候，即：
当 i === 0 || j === 0
dp(i, j) = 1
```

**代码实现**

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
// 递归
var uniquePaths = function(m, n) {
    if(m === 1 || n === 1) return 1
    return uniquePaths(m-1, n) + uniquePaths(m, n-1)  // 递归性能消耗大 在leetcode中提交运行 会超出时间限制 需要优化
};

// 上面递归的方法，存在大量的重复计算，可以用如下方面进行优化
// 递归 + 缓存
var uniquePaths = function(m, n) {
    var cache = {}
    var dep = function(m, n) {
        if(m === 1 || n === 1) return 1
        var key = `${m}-${n}`
        if(cache[key]) return cache[key]
        return cache[key] = dep(m-1, n) + dep(m, n-1)
    }
    return dep(m, n)
};
// 循环 数组
var uniquePaths = function(m, n) {
    var dp = new Array(n).fill(1)
    for(var i=1;i<m;i++){
        for(var j=1;j<n;j++){
            dp[j] += dp[j-1]
        }
    }
    return dp[n-1]
};

// 循环 二维数组
var uniquePaths = function(m, n) {
    var dp = []
    for(var i=0;i<m;i++){
        dp.push([])
        for(var j=0;j<n;j++){
            if( i===0 || j === 0) {
                dp[i][j] = 1
            } else {
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
            }
        }
    }
    return dp[m-1][n-1]
};
```
