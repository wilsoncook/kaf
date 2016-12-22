# kaf
Kind of another framework.  
NOTE: Under Development

## Installation
```shell
npm install kaf
```

## Usage
```js
//TODO
```

## 构想
采用类似connect方式，kaf本身仅提供最基本的流程化和插件化支持，其他的功能通过加载中间件(子模块)来实现
中间件含有一个处理函数，处理函数返回false表示中断执行（不再继续执行后续的中间件），返回非false时，则会将此结果传递给下一个中间件，并继续执行

### MVC模块(接口化模块)
数据层(M) 仅提供CURD的内部服务接口，供控制器调用
控制层(C) 仅实现数据增删改查等操作性逻辑，输出方式全部为JS对象（最终会转换为JSON字符串给前端）
视图层(V) 仅提供模板布局和数据渲染功能

内部库(Library) 对逻辑操作进行一定的封装和模块化，供控制器调用，目的在于解耦
外部库(node_modules) 及npm安装的库，直接通过require引用即可