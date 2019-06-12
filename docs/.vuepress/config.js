module.exports = {
    title:'weiwei',
    description:'my blog',
    port:'3000',
    themeConfig: {
        nav: [
          { text: '主页', link: '/' },
          { text: '基础',
          items: [
              { text: 'HTML', link: '/bar/three'},
              { text: 'CSS', link: '/bar/three'},
              { text: 'javaScript', link: '/bar/three'}
          ]
        },
          { text: '框架',
            items: [
                { text: 'Vue', link: '/bar/three'},
                { text: 'React', link: '/bar/three'},
                { text: 'Angular', link: '/bar/three'},
                { text: 'Flutter', link: '/bar/three'},
            ]
        },
        { text: '工作笔记', link: '/bar/three' },
        { text: '前端可视化', link: '/bar/three' },
        { text: 'Github', link: 'https://google.com' },
        ]
      }
}