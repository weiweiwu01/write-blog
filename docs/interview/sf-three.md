# 二分查找

## 定义 

二分查找也称折半查找（Binary Search），它是一种效率较高的查找方法。但是，折半查找要求线性表必须采用顺序存储结构，而且表中元素按关键字有序排列。

## 流程图

![Alt 二分查找流程图](/sfImg/sf.png)

**为什么是 left <= right ?**

因为始终要保证查找的对象内至少含有一个元素，且确保能判断对于left和right指向同一个元素的情况。

**为什么是left=middle +1 || right=middle -1 ？**

因为在第一次判断的时候就已经排除了middle = find 的这个可能，为了提升效率。可以直接将middle值减去不再第二次判断的序列之中

**leetcode地址：**<a href="https://leetcode.cn/problems/search-insert-position/description">35. 搜索插入位置
</a>

```js
**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    var findMid = function(left, right){
        return left + Math.floor((right - left)>>1)
    }
    if(target>nums[nums.length-1]){
        return nums.length
    }
    if(target<nums[0]){
        return 0
    }
    var left = 0, right = nums.length-1,mid = findMid(left, right)
    while(left<right){
        if(nums[mid]>target){
            right = mid
        } else if(nums[mid]<target){
            left = mid + 1
        } else {
            return mid
        }
        mid = findMid(left, right)
    }
    return mid 
};
```

```js
var searchInsert = function (nums, target) {
  let l = 0, r = nums.length - 1, ans = nums.length;
  while (l <= r) {
    const mid = l + Math.floor((r - l) >> 1);
    if (target > nums[mid]) {
      l = mid + 1;
    } else {
      ans = mid;
      r = mid - 1;
    }
  }
  return ans;
};
```
