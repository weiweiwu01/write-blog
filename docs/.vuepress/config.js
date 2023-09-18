module.exports = {
  title: 'wuweiwei\'s blog',
  description: 'my blog',
  port: '3000',
  serviceWorker: true, // 是否开启 PWA
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `/icons/favicon.ico` }]
 ],
  base: '/',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      {
        text: '基础',
        items: [
          { text: 'JavaScript', link: '/js/jc-one' },
          { text: 'CSS', link: '/css/BFC' },
          { text: 'HTML', link: '/html/' },
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/vue/diff' },
          { text: 'React', link: '/react/react2' },
          { text: 'Angular', link: '/angular/' },
          { text: 'Flutter', link: '/flutter/' },
        ]
      },
      { text: '面试', link: '/interview/sf-zero' },
      { text: '工作笔记', link: '/workNotes/' },
      { text: '前端可视化', link: '/web/' },
      { text: '关于', link: '/about/' },
      { text: 'Github', link: 'https://github.com' },
    ],
    sidebarDepth:4, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: 'Last Updated', // string | boolean
    sidebar: {
      '/js/': [
        {
          // title: 'js基础', // 侧边栏名称
          collapsable: false, // 可折叠
          children: [
            'jc-one', // 你的md文件地址
            'jc-two', 
            'jc-three', 
            'jc-four', 
            'jc-five', 
            'jj-one', // 你的md文件地址
            'jj-two', 
            'jj-three', 
            'jj-four', 
            'jj-five', 
            'jj-six', 
            'jj-seven', 
          ]
        }
      ],
      '/vue/':[
        {
          title:"vue基础",
          collapsable: true, // 可折叠
          children: [
            'vue-base',
          ]
        },
        {
          title:"vue源码",
          collapsable: true, // 可折叠
          children: [
            'vue-use',
            'vue-router',
            'diff',
          ]
        },
        {
          title:"vue 项目性能优化",
          collapsable: true, // 可折叠
          children: [
            'vue-optimization'
          ]
        },
      ],
      '/interview/':[
        {
          title: '算法', // 侧边栏名称
          collapsable: true, // 可折叠
          children: [
            'sf-zero', 
            'sf-one', 
            'sf-two',
            'sf-three',
            'sf-four',
            'sf-five',
          ]
        },
        {
          title: '网络', // 侧边栏名称
          collapsable: true, // 可折叠
          children: [
            'wl-one', // 你的md文件地址
            'wl-two',
            'wl-three',
          ]
        },
      ],
      '/css/':[
        {
          title: '基础', // 侧边栏名称
          collapsable: false, // 可折叠
          children: [
            'BFC', // 你的md文件地址
          ]
        },
      ],
      '/react/':[
        {
          collapsable: false, // 可折叠
          children: [
            'react1', // 你的md文件地址
            'react2',
          ]
        },
      ]
    }
  }
}