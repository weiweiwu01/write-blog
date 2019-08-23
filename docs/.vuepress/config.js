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
          { text: 'HTML', link: '/html/' },
          { text: 'CSS', link: '/css/' },
          { text: 'javaScript', link: '/js/jc-one' }
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/vue/vue-base' },
          { text: 'React', link: '/react/' },
          { text: 'Angular', link: '/angular/' },
          { text: 'Flutter', link: '/flutter/' },
        ]
      },
      { text: '工作笔记', link: '/workNotes/' },
      { text: '前端可视化', link: '/web/' },
      { text: '面试', link: '/interview/' },
      { text: '关于', link: '/about/' },
      { text: 'Github', link: 'https://github.com' },
    ],
    sidebarDepth:4, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: 'Last Updated', // string | boolean
    sidebar: {
      '/js/': [
        {
          title: 'js基础', // 侧边栏名称
          collapsable: true, // 可折叠
          children: [
            'jc-one', // 你的md文件地址
            'jc-two', 
            'jc-three', 
            'jc-four', 
          ]
        },
        {
          title: 'js进阶', // 侧边栏名称
          collapsable: true, // 可折叠
          children: [
            'jj-one', // 你的md文件地址
            'jj-two', 
            'jj-three', 
            'jj-four', 
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
          ]
        },
        {
          title:"vue 项目性能优化",
          collapsable: true, // 可折叠
          children: [
            'vue-optimization'
          ]
        },
      ]
    }
  }
}