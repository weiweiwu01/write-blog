# Vue Diff

## diff算法简介

diff算法的目的是为了找到哪些节点发生了变化，哪些节点没有发生变化可以复用。如果用最传统的diff算法，如下图所示，每个节点都要遍历另一棵树上的所有节点做比较，这就是o(n^2)的复杂度，加上更新节点时的o(n)复杂度，那就总共达到了o(n^3)的复杂度，这对于一个结构复杂节点数众多的页面，成本是非常大的。

![Alt diff](/vueImg/diff.png)

实际上vue和react都对虚拟dom的diff算法做了一定的优化，将复杂度降低到了o(n)级别，具体的策略是：

**同层的节点才相互比较**

![Alt diff](/vueImg/diff.webp)

从根节点起遍历整个节点数，只对同层的节点进行相互比较。所以我们在代码开发中，如果节点内容没有发生变化，那不要轻易改变它的层级，否则会导致节点无法复用。

+ 1、节点比较时，如果类型不同，则对该节点及其所有子节点直接销毁新建。
+ 2、类型相同的子节点，使用key帮助查找，并且使用算法优化查找效率。其中react和vue2以及vue3的diff算法都不尽相同。

## Vue2 中的Diff算法

### patch

先判断是否是首次渲染，如果是首次渲染那么我们就直接createElm即可；如果不是就去判断新老两个节点的元素类型否一样；如果两个节点都是一样的，那么就深入检查他们的子节点。如果两个节点不一样那就说明Vnode完全被改变了，就可以直接替换oldVnode。

```js
function patch(oldVnode, vnode, hydrating, removeOnly) {
    // 判断新的vnode是否为空
    if (isUndef(vnode)) {
        // 如果老的vnode不为空 卸载所有的老vnode
        if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
        return
    }
    let isInitialPatch = false
    // 用来存储 insert钩子函数，在插入节点之前调用
    const insertedVnodeQueue = []
    // 如果老节点不存在，直接创建新节点
    if (isUndef(oldVnode)) {
        isInitialPatch = true
        createElm(vnode, insertedVnodeQueue)
    } else {
        // 是不是元素节点
        const isRealElement = isDef(oldVnode.nodeType)
        // 当老节点不是真实的DOM节点，并且新老节点的type和key相同，进行patchVnode更新工作
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
        } else {
        // 如果不是同一元素节点的话
        // 当老节点是真实DOM节点的时候
        if (isRealElement) {
            // 如果是元素节点 并且在SSR环境的时候 修改SSR_ATTR属性
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            // 就是服务端渲染的，删掉这个属性
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
            }
            // 这个判断里是服务端渲染的处理逻辑
            if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true)
                return oldVnode
            }
            }
            // 如果不是服务端渲染的，或者混合失败，就创建一个空的注释节点替换 oldVnode
            oldVnode = emptyNodeAt(oldVnode)
        }

        // 拿到 oldVnode 的父节点
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // 根据新的 vnode 创建一个 DOM 节点，挂载到父节点上
        createElm(
            vnode,
            insertedVnodeQueue,
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
        )
        // 如果新的 vnode 的根节点存在，就是说根节点被修改了，就需要遍历更新父节点
        // 递归 更新父占位符元素
        // 就是执行一遍 父节点的 destory 和 create 、insert 的 钩子函数
        if (isDef(vnode.parent)) {
            let ancestor = vnode.parent
            const patchable = isPatchable(vnode)
            // 更新父组件的占位元素
            while (ancestor) {
            // 卸载老根节点下的全部组件
            for (let i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor)
            }
            // 替换现有元素
            ancestor.elm = vnode.elm
            if (patchable) {
                for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                const insert = ancestor.data.hook.insert
                if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                    insert.fns[i]()
                }
                }
            } else {
                registerRef(ancestor)
            }
            // 更新父节点
            ancestor = ancestor.parent
            }
        }
        // 如果旧节点还存在，就删掉旧节点
        if (isDef(parentElm)) {
            removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
            // 否则直接卸载 oldVnode
            invokeDestroyHook(oldVnode)
        }
        }
    }
    // 执行 虚拟 dom 的 insert 钩子函数
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    // 返回最新 vnode 的 elm ，也就是真实的 dom节点
    return vnode.elm
}
```

### patchVnode

+ 如果Vnode和oldVnode指向同一个对象，则直接return即可；
+ 将旧节点的真实 DOM 赋值到新节点（真实 dom 连线到新子节点）称为elm，然后遍历调用 update 更新 oldVnode 上的所有属性，比如 class,style,attrs,domProps,events...；
+ 如果新老节点都有文本节点，并且文本不相同，那么就用vnode.text更新文本内容。
+ 如果oldVnode有子节点而Vnode没有，则直接删除老节点即可；
+ 如果oldVnode没有子节点而Vnode有，则将Vnode的子节点真实化之后添加到DOM中即可。
+ 如果两者都有子节点，则执行updateChildren函数比较子节点。

```js
function patchVnode(
    oldVnode, // 老的虚拟 DOM 节点
    vnode, // 新节点
    insertedVnodeQueue, // 插入节点队列
    ownerArray, // 节点数组
    index, // 当前节点的下标
    removeOnly
  ) {
    // 新老节点对比地址一样，直接跳过
    if (oldVnode === vnode) {
      return
    }
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }
    const elm = vnode.elm = oldVnode.elm
    // 如果当前节点是注释或 v-if 的，或者是异步函数，就跳过检查异步组件
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }
    // 当前节点是静态节点的时候，key 也一样，或者有 v-once 的时候，就直接赋值返回
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }
    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }
    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      // 遍历调用 update 更新 oldVnode 所有属性，比如 class,style,attrs,domProps,events...
      // 这里的 update 钩子函数是 vnode 本身的钩子函数
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      // 这里的 update 钩子函数是我们传过来的函数
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    // 如果新节点不是文本节点，也就是说有子节点
    if (isUndef(vnode.text)) {
      // 如果新老节点都有子节点
      if (isDef(oldCh) && isDef(ch)) {
        // 如果新老节点的子节点不一样，就执行 updateChildren 函数，对比子节点
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        // 如果新节点有子节点的话，就是说老节点没有子节点

        // 如果老节点是文本节点，就是说没有子节点，就清空
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // 添加新节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 如果新节点没有子节点，老节点有子节点，就删除
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        // 如果老节点是文本节点，就清空
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // 如果老节点的文本和新节点的文本不同，就更新文本
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
 }
```

### updateChildren

这里是diff算法的具体实现细节，流程包括：

+ 条件一：用newChildren和oldChildren的头部节点对比。看两个节点的type和key是否都相同。如果相同，就进行节点的更新工作（patchVnode）；然后两个头指针向后移动（即oldStartIdx++ && newStartIdx++），两个头部oldStartVnode和newStartVnode重新取值；当前循环结束，进入下一次循环，接着新老头部的对比，一直到两个节点type和key不相同的时候，进入条件二的判断。
+ 条件二：尾节点对比。如果两个节点相同，就进行patchVnode工作。然后两个尾部指针前移（即oldEndIdx-- && newEndIdx--），两个尾部oldEndVnode和newEndVnode重新取值；当前循环结束，进入下一次循环。接着条件一判断，条件一不成立；判断条件二；如果条件二尾节点对比依旧不成立，则进入条件三的判断。
+ 条件三：newChildren未处理的最后一个子节点和oldChildren未处理的第一个子节点对比。节点相同，就进行patchVnode工作，然后oldStartVnode的真实DOM移动到对应的新newEndVnode的对应的位置上；然后旧头指针后移，新尾指针前移（即 oldStartIdx++ && newEndIdx--），oldStartVnode 和 newEndVnode 重新取值；当前循环结束，进入下一次循环。继续比对，新旧头指针不同，尾指针不同，两个头尾也不同，进入条件四的判断。
+ 条件四：newChildren未处理的第一个子节点和oldChildren未处理的最后一个子节点对比。节点相同，就进行patchVnode工作，然后oldEndVnode的真实DOM移动到旧的oldStartVnode.elm的前面；旧尾指针前移，新头指针后移（即 oldEndIdx--&& newStartIdx++），oldEndVnode和newStartVnode重新取值。进入下一次循环，如果以上条件一到条件四都不成立，进入条件五的判断。
+ 条件五：以上四个条件均不满足的情况。主要分为两种情况，首先如果新旧子节点都存在key，那么会根据未处理的oldChildren的key生成一张hash表，用newStartVnode的key与hash表做匹配，匹配成功就判断newStartVnode和匹配节点是否为sameVnode，如果是，就把两个相同的节点做一个更新，被匹配oldCh中的节点置为null，再将真实dom中相应的节点移到最前面，否则，将newStartVnode生成对应的节点插入到dom中对应的位置。如果没有key，则直接将newStartVnode生成新的节点插入到真实DOM中。newStartVnode和newStartIdx指针后移，进行下一次循环，直到oldStartIdx大于oldEndIdx，或者newStartIdx大于newEndIdx的时候，循环结束。

最后如果老节点的头部指针大于老节点的尾部指针，说明新节点多，直接创建剩余新节点插入到DOM中；反之如果新节点的头部指针大于新节点的尾部指针，说明老节点数量多，删除剩余老节点即可。

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue) {
    let oldStartIdx = 0 // 老 vnode 遍历的下标
    let newStartIdx = 0 // 新 vnode 遍历的下标
    let oldEndIdx = oldCh.length - 1 // 老 vnode 列表长度
    let oldStartVnode = oldCh[0] // 老 vnode 列表第一个子元素
    let oldEndVnode = oldCh[oldEndIdx] // 老 vnode 列表最后一个子元素
    let newEndIdx = newCh.length - 1 // 新 vnode 列表长度
    let newStartVnode = newCh[0] // 新 vnode 列表第一个子元素
    let newEndVnode = newCh[newEndIdx] // 新 vnode 列表最后一个子元素
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm
    
    // 循环，规则是开始指针向右移动，结束指针向左移动移动
    // 当开始和结束的指针重合的时候就结束循环
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
        
        // 老开始和新开始对比
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 是同一节点 递归调用 继续对比这两个节点的内容和子节点
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        // 然后把指针后移一位，从前往后依次对比
        // 比如第一次对比两个列表的[0]，然后比[1]...，后面同理
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
        
        // 老结束和新结束对比
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        // 然后把指针前移一位，从后往前比
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
        
        // 老开始和新结束对比
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        // 老的列表从前往后取值，新的列表从后往前取值，然后对比
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
        
        // 老结束和新开始对比
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        // 老的列表从后往前取值，新的列表从前往后取值，然后对比
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
        
        // 以上四种情况都没有命中的情况
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        // 拿到新开始的 key，在老的 children 里去找有没有某个节点有这个 key
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
          
        // 新的 children 里有，可是没有在老的 children 里找到对应的元素
        if (isUndef(idxInOld)) {
          /// 就创建新的元素
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          // 在老的 children 里找到了对应的元素
          vnodeToMove = oldCh[idxInOld]
          // 判断标签如果是一样的
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 就把两个相同的节点做一个更新
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
           	nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // 如果标签是不一样的，就创建新的元素
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // oldStartIdx > oldEndIdx 说明老的 vnode 先遍历完
    if (oldStartIdx > oldEndIdx) {
      // 就添加从 newStartIdx 到 newEndIdx 之间的节点
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    
    // 否则就说明新的 vnode 先遍历完
    } else if (newStartIdx > newEndIdx) {
      // 就删除掉老的 vnode 里没有遍历的节点
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
}
  
function isUndef (v) { return v === undefined || v === null }
```

## Vue3的Diff算法

### 没有key的情况下

第一步：比较新老children的length获取最小值，然后对于公共部分，进行重新patch工作；

第二步：判断新老节点的数量。如果老节点的数量大于新节点的数量，则直接‘unmountChildren’从公共部分之后的所有老节点；如果新节点的数量大于老节点的数量，那就直接‘mountChildren’公共部分之后的所有新节点。

```js
const patchUnKeyedChildren = (n1,n2,container,anchor) => {
    const oldLen = n1.length;
    const newLen = n2.length;
    const commonLen = Math.min(oldLen, newLen);
    for(let i = 0;i < commonLen; i++){
        const nextChild = n2[i]
        patch(c1[i], nextChild, container, null)
    }
    if(oldLen > newLen){
        unmountChildren(c1,commonLen)
    }else{
        mountChildren(c2,container,anchor,commonLen)
    }
}
```

### 有key的情况下

c1: a b [ c d e ] f g
c2: a b [ d e c h ] f g
假如有如上的 c1 和 c2 新旧 children，在 diff 的时候，会有一个预处理的过程。
先从前往后比较，当节点不同时，不再往后进行比较。接着又从后往前进行比较，当节点不同时，不再往前进行比较。
经过预处理之后，c1 和 c2 真正需要进行 diff 的部分如下所示：
c1: c d e
c2: d e c h
最后利用“最长递增子序列”，完成上述差异部分的比较，提高diff效率

### 从头部开始对比

先定义三个变量 i = 0（代表比对从下表为0的节点开始）；e1 = c1.length -1（代表旧节点序列的最后一个节点下表）；e12= c2.length -1（代表新节点序列的最后一个节点下表）。

在while循环中，通过新老节点序列的头部节点开始比对，节点相同就进行patch工作；遇到不同的节点就退出当前的循环。

![Alt diff](/vueImg/diff1.webp)

```js
const isSameVNodeType = (n1:VNode, n2:VNode) => n1.type === n2.type && n1.key === n2.key;
// 1. sync from start
while(i<=e1 && i<=e2){
    let n1 = c1[i];
    let n2 = c2[i];
    if(isSameVNodeType(n1, n2)){
        patch(n1,n2,container);
    }else{
        break;
    }
  i++
}
```

### 从尾部开始对比

同上，我们在while循环中，从新老节点序列的尾部节点开始对比，一样就进行patch工作；遇到不同的节点就退出当前的循环。

![Alt diff](/vueImg/diff2.webp)

```js
// 2. sync from end
while(i<=e1 && i<=e2){
    let n1 = c1[el];
    let n2 = c2[e2];
    if(isSameVNodeType(n1, n2)){
        patch(n1,n2,container);
    }else{
        break;
    }
    e1--;
    e2--;
}
```

### 同序列+挂载

通过以上两个循环后，发现新的节点序列比老的节点序列多；遇到这种情况，我们就直接循环把多余的新增节点全部挂载到相应的位置即可。需要注意是向前挂载，还是向后挂在。这里我们是用当前e2的值加1去判断，如果e2+1>e2，那么就向后插入，反之则向前插入

![Alt diff](/vueImg/diff3.webp)

```js
// 3. common sequence + mount
if(i>e1){
    if(i<= e2){
    const nextPos = e2 + 1;
    const anchor = nextPos < l2 ? c2[nextPos].el : null;
    while(i<=e2){
        patch(null,c2[i],container,anchor);
        i++;
    }
    }
}
```

### 同序列+卸载

同上，当两个循环结束/终止后，发现老的节点序列比新的节点序列多；那么我们直接循环卸载多余的旧序列节点即可

![Alt diff](/vueImg/diff4.webp)

```js
// 4. common sequence + unmount
if(i>e2){
    while(i <= e1){
        unmount(c1[i]);
        i++;
    }
}
```

### 未知序列对比

有时候，情况可能没有上述那么地简单，即 i、e1、e2 并不满足上述几种情形时，我们就要寻找其中需要被移除、新增的节点，又或是判断哪些节点需要进行移动。

为此，我们需要去遍历 c1 中未进行处理的节点，然后查看在 c2 中是否有对应的节点（key 相同）。没有，则说明该节点已经被移除，那就执行 unmount 操作。

首先，为了快速确认 c1 的节点在 c2 中是否有对应的节点及所在的位置，对 c2 中的节点建立一个映射表（key: index）；

然后，基于 c2 中待处理的节点数目（toBePatched）创建一个变量newIndexToOldIndexMap（Map<newIndex, oldIndex>），用于存储新老节点序列未处理节点的索引对应关系；

然后，遍历 c1 中待处理的节点；先判断patched 是否大于c2 中待处理的节点数目toBePatched，当patched>toBePatched时，可以认为剩余c1 中的节点都是多余的了，直接移除就好。然后判断剩余c1、c2 中是否有相同 key 的节点存在；

+ 没有，直接unmount当前c1中的该节点
+ 有，进行patch工作；更新newIndexToOldIndexMap中相应位置的值为该节点在 c1 中的索引；然后判断元素是否需要移动； 最后，更新patched；

最后根据最长递增子序列算法求得最长递增子序列后，遍历 c2 中的待处理节点，判断节点是否属于新增，是否需要进行移动。

![Alt diff](/vueImg/diff5.webp)

```js
// 5. unknown sequence
const s1 = i // prev starting index
const s2 = i // next starting index
// 5.1 build key:index map for newChildren
const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
for (i = s2; i <= e2; i++) {
    const nextChild = c2
    if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i)
    }
}
// 5.2 loop through old children left to be patched and try to patch
// matching nodes & remove nodes that are no longer present
let j
let patched = 0
const toBePatched = e2 - s2 + 1 // c2 中待处理的节点数目
let moved = false
// used to track whether any node has moved
let maxNewIndexSoFar = 0 // 已遍历的待处理的 c1 节点在 c2 中对应的索引最大值

// works as Map<newIndex, oldIndex>
// Note that oldIndex is offset by +1
// and oldIndex = 0 is a special value indicating the new node has
// no corresponding old node.
// used for determining longest stable subsequence
const newIndexToOldIndexMap = new Array(toBePatched) // 用于后面求最长递增子序列
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

for (i = s1; i <= e1; i++) {
    const prevChild = c1[i]
    if (patched >= toBePatched) {
        // all new children have been patched so this can only be a removal
        unmount(prevChild, parentComponent, parentSuspense, true)
        continue
    }
    let newIndex
    if (prevChild.key != null) {
        newIndex = keyToNewIndexMap.get(prevChild.key)
    } else {
        // key-less node, try to locate a key-less node of the same type
        for (j = s2; j <= e2; j++) {
            if (
                newIndexToOldIndexMap[j - s2] === 0 &&
                isSameVNodeType(prevChild, c2[j])
            ) {
                newIndex = j
                break
            }
        }
    }
    if (newIndex === undefined) {
        unmount(prevChild, parentComponent, parentSuspense, true)
    } else {
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
        } else {
            moved = true
        }
        patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
        patched++
    }
}

// 5.3 move and mount
// generate longest stable subsequence only when nodes have moved
const increasingNewIndexSequence = moved
    ? getSequence(newIndexToOldIndexMap)
    : EMPTY_ARR
j = increasingNewIndexSequence.length - 1
// looping backwards so that we can use last patched node as anchor
for (i = toBePatched - 1; i >= 0; i--) {
    const nextIndex = s2 + i
    const nextChild = c2[nextIndex] as VNode
    const anchor =
        nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
    if (newIndexToOldIndexMap[i] === 0) {
        // mount new
        patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
        )
    } else if (moved) {
        // move if:
        // There is no stable subsequence (e.g. a reverse)
        // OR current node is not among the stable sequence
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, MoveType.REORDER)
        } else {
            j--
        }
    }
}
```

## Vue3的diff对比Vue2的优化部分

+ Vue2 是全量 Diff（当数据发生变化，它就会新生成一个DOM树，并和之前的DOM树进行比较，找到不同的节点然后更新。）；Vue3 是静态标记 + 非全量 Diff（Vue 3在创建虚拟DOM树的时候，会根据DOM中的内容会不会发生变化，添加一个静态标记。之后在与上次虚拟节点进行对比的时候，就只会对比这些带有静态标记的节点。）
+ 使用最长递增子序列优化对比流程，可以最大程度的减少 DOM 的移动，达到最少的 DOM 操作

### Key attribute的作用

当 Vue 正在更新使用 v-for 渲染的元素列表时，它默认使用“就地更新”的策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。这个类似 Vue 1.x 的 track-by="$index"。虽然这个默认的模式是高效的，但是**只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出**。

为了给 Vue 一个提示，方便它能跟踪每个节点，从而达到重用或重新排序现有元素的目的，我们需要在v-for渲染元素列表的时候为每项提供一个唯一标识 key attribute。

### Key的使用场景以及如何正确使用

使用场景：

+ v-for 渲染的元素列表时
+ 有相同父元素的子元素时
+ 当我们想要强制替换元素/组件而不是重复使用它时，也可以设置key attribute；例如：触发过渡

```js
// 当 text 发生改变时，<span> 总是会被替换而不是被修改，因此会触发过渡。
<transition>
  <span :key="text">{{ text }}</span>
</transitio>
```

+ 当遍历输出的 DOM 内容非常简单或者是我们刻意依赖默认行为以获取性能上的提升的时候，可以不比设置 key attribute。

错误的用法：

+ 1、使用 index 或者 index 拼接其它值作为key
+ 2、使用对象或数组之类的非基本类型值作为 v-for 的 key

正确用法：

+ 1、使用字符串或数值类型的值作为key的值
+ 2、使用唯一值做当作key，例如：id 等

参考资料： 

<a target="_blank" href="https://stackoverflow.com/questions/44238139/why-is-vue-js-using-a-vdom">https://stackoverflow.com/questions/44238139/why-is-vue-js-using-a-vdom</a>

<a target="_blank" href="https://cn.vuejs.org/v2/guide/list.html">https://cn.vuejs.org/v2/guide/list.html</a>

<a target="_blank" href="https://zhuanlan.zhihu.com/p/20814761">https://zhuanlan.zhihu.com/p/20814761</a>

<a target="_blank" href="https://zhuanlan.zhihu.com/p/443971566?utm_id=0">https://zhuanlan.zhihu.com/p/443971566?utm_id=0</a>

<a target="_blank" href="https://github.com/vuejs/core/blob/main/packages/runtime-core/src/renderer.ts">https://github.com/vuejs/core/blob/main/packages/runtime-core/src/renderer.ts</a>
