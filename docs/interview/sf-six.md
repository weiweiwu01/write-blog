# 滑动窗口

## 简介

滑动窗口算法的本质是双指针法中的左右指针法，所谓滑动窗口，就像描述的那样，可以理解成是一个会滑动的窗口，每次记录下窗口的状态，再找出符合条件的适合的窗口。它可以将双层嵌套的循环问题，转换为单层遍历的循环问题。使用两个指针一左一右构成一个窗口，就可以将二维循环的问题转化成一维循环一次遍历，相当于通过旧有的计算结果对搜索空间进行剪枝，使时间复杂度从O（n²）降低至O（n），比如经典字符串查找算法**Rabin-Karp 指纹字符串查找算法**，它本质上也使用了滑动窗口的思想，通过公式推导降低窗口滑动时计算子串哈希值的复杂度。

滑动窗口算法更多的是一种思想或技巧，按照窗口大小是否固定分为固定滑动窗口和变长滑动窗口，可以用来解决一些查找满足一定条件的连续区间的性质（长度等）的问题。往往类似于“请找到满足xx的最x的区间（子串、子数组等）的xx”这类问题都可以使用该方法进行解决。

## 步骤及算法模板

以下思路是比较形象的滑动窗口问题的解题步骤，但有些题目找到窗口限定比较隐晦，需要具体问题具体分析：

+ （1）初始化窗口：
    初始化左右边界 left = right = 0，把索引闭区间 [left, right] 称为一个「窗口」。

+ （2）寻找可行解：
    我们先不断地增加 right 指针扩大窗口 [left, right]，直到窗口中的满足可行解。

+ （3）优化可行解：
    此时，我们停止增加 right，转而不断增加 left 指针缩小窗口 [left, right]，直到窗口中的可行解不再符合要求。同时，每次增加 left，我们都要更新一轮结果。

+ （4）滑动窗口，直至一次遍历结束：
    重复第 2 和第 3 步，直到 right 到达到的尽头。

这个思路其实也不难理解，第 2 步相当于在寻找一个「可行解」，然后第 3 步在优化这个「可行解」，最终找到最优解。左右指针轮流前进，窗口大小增增减减，窗口不断向右滑动。

## 209. 长度最小的子数组

> **leetcode地址：**<a href="https://leetcode.cn/problems/minimum-size-subarray-sum/description/">长度最小的子数组</a>

### 题目

```js
给定一个含有 n 个正整数的数组和一个正整数 target 。

找出该数组中满足其总和大于等于 target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。

示例 1：

输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。
示例 2：

输入：target = 4, nums = [1,4,4]
输出：1
示例 3：

输入：target = 11, nums = [1,1,1,1,1,1,1,1]
输出：0
```

### 思路

本题为变长的滑动窗口，其窗口大小由target决定（窗口总和大于等于target），所以定义一个变量（窗口内总和），小于target右指针右移，大于target左指针右移，等于记录更新窗口大小即可

```js
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(target, nums) {
    let start = 0   // 左指针
    let end = 0 // 右指针
    let sum = 0 // 窗口总和
    let len = Infinity  //取一个不可能到达的值 这里取无穷大
    // len = nums.length +1  也可以这样写 注意后续的判断
    while(end < nums.length){   // 循环结束条件 右指针到nums结尾
        sum += nums[end]    // 滑动窗口内求和
        while(sum >= target){   // 临界条件，窗口内和一旦大于target,循环,这时需要滑动左指针，窗口内和递减至满足条件
            sum -= nums[start]  // 滑动窗口内求和
            len = Math.min(len,end-start+1) // 更新滑动窗口长度
            start++ // 滑动左指针
        }
        end++ // 滑动右指针
    }
    return len === Infinity ? 0 : len // 返回长度 注意Infinity判断，即不满足条件的时 返回0
};
```

## 3. 无重复字符的最长子串

> **leetcode地址：**<a href="https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/">无重复字符的最长子串</a>

### 题目

```js
给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:

输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let left = 0    // 左指针
    let right = 0   // 右指针
    let str = ''    // 滑动窗口子字符串
    let len = 0    // 保存最长子串长度，初始值为0
    while(right < s.length){    // 循环字符串 以右指针移动
        str += s[right] // 滑动窗口子字符串赋值
        while(str.indexOf(s[right]) != str.lastIndexOf(s[right])){    //由子串中某字符首次出现的地址和最后一次出现的地址不同来判断无重复字符，滑动窗口
            str = s.slice(left+1,right+1)   // 有重复字符串 截取
            left++  // 滑动左窗口
        }   // 经过此次循环，得出的都是子串
        len = Math.max(str.length,len)  // 每次循环 保存最大子串长度
        right++ // 滑动右窗口
    }
    return len
};
```
