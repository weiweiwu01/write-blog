# 通俗易懂的设计模式  
### 发布订阅  
```js
//发布订阅模式
const e = {
    arr:[],
    on(fn){
        this.arr.push(fn)
    },
    emit(){
        this.arr.forEach(fn=>fn())
    }
}

let person = {}
let p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        person.name = "Tom"
        resolve()
        e.emit()
    },2000)
})
let p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        person.age = "18"
        resolve()
        e.emit()
    },5000)
})
e.on(()=>{
    if(Object.keys(person).length === 2){
        console.log(person)
    }
})
 //五秒后 打印 { name: 'Tom', age: '18' }
```

### 观察者模式
```js

//观察者模式 基于发布订阅模式

class Subject{
    constructor(){
        this.state = "宝宝开心"
        this.arr = []
    }
    attach(w){
        this.arr.push(w)
    }
    setState(state){
        this.state = state
        this.arr.forEach(o => o.update(this.state))
    }
}

class Watcher{
    constructor(name){
        this.name = name
    }
    update(state){
        console.log(this.name+"知道"+state)
    }
}

const o = new Subject()
const w1 = new Watcher("爸爸")
const w2 = new Watcher("妈妈")
o.attach(w1)
o.attach(w2)
o.setState("宝宝不开心了")

//爸爸知道宝宝不开心了   
//妈妈知道宝宝不开心了
```