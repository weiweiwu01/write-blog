module.exports = {
  title: 'wuweiwei\'s blog',
  description: 'my blog',
  port: '3000',
  base: '/',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      {
        text: '基础',
        items: [
          { text: 'HTML', link: '/html/' },
          { text: 'CSS', link: '/css/' },
          { text: 'javaScript', link: '/js/' }
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/vue/' },
          { text: 'React', link: '/react/' },
          { text: 'Angular', link: '/angular/' },
          { text: 'Flutter', link: '/flutter/' },
        ]
      },
      { text: '工作笔记', link: '/workNotes/' },
      { text: '前端可视化', link: '/web/' },
      { text: '关于', link: '/about/' },
      { text: 'Github', link: 'https://github.com' },
    ],
    sidebar: 'auto',
    lastUpdated: 'Last Updated', // string | boolean
    // sidebar: {
    //   '/': [
    //     "/", //指的是根目录的md文件 也就是 README.md 里面的内容
    //     "apiword",
    //     "api",
    //     "error"
    //   ]
    // },
  }
}