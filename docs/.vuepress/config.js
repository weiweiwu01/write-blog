module.exports = {
  title: 'weiwei',
  description: 'my blog',
  port: '3000',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      {
        text: '基础',
        items: [
          { text: 'HTML', link: '/vue/aa.html' },
          { text: 'CSS', link: '/vue/aa.md' },
          { text: 'javaScript', link: '/vue/index.md' }
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/vue/' },
          { text: 'React', link: '/bar/three' },
          { text: 'Angular', link: '/vue/index.md' },
          { text: 'Flutter', link: '/vue/index.md' },
        ]
      },
      { text: '工作笔记', link: '/vue/index.md' },
      { text: '前端可视化', link: '/bar/three' },
      { text: 'Github', link: 'https://google.com' },
    ],
    sidebar: {
      '/': [
        "/", //指的是根目录的md文件 也就是 README.md 里面的内容
        "apiword",
        "api",
        "error"
      ]
    },
  }
}