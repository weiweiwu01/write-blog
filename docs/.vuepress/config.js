module.exports = {
  title: 'wuweiwei\'s blog',
  description: 'my blog',
  port: '3000',
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
      { text: '面试', link: '/interview/' },
      { text: '关于', link: '/about/' },
      { text: 'Github', link: 'https://github.com' },
    ],
    lastUpdated: 'Last Updated', // string | boolean
    sidebar:'auto'
  } 
}