# 无重复字符的最长子串

> **leetcode地址：**<a href="https://leetcode.cn/problems/longest-substring-without-repeating-characters/">无重复字符的最长子串</a>

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

### 题解

```js
var lengthOfLongestSubstring = function(s) {
    var str = ''
    var len = s.length == 0 ? 0 : 1
    for( var i =0; i<s.length; i++){
        if(str.includes(s[i])) {
            str = str.slice(str.indexOf(s[i])+1)
        } 
        str += s[i]
        if(str.length > len) {
            len = str.length
        }
    }
    return len
};
```

> 思路： <br />

1、定义一个变量str，用来保存当前没有重复项的字符串，定义另一个变量len用来保存最长字符串str的长度（兼容字符串为空的情况）。<br />
2、循环传入的字符串，如果str里已经存在相同字符，则用slice方法截取str，起始位置就是相同字符存在的位置的+1，并赋值给str。str继续追加循环的字符。这样保证str里没有相同字符。
3、只有str的长度大于len时，才把str.length赋值给len,这样保证len最大，最后返回len