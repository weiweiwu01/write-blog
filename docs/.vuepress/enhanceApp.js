function integrateGitalk(router) {
    const linkGitalk = document.createElement('link');
    linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';
    linkGitalk.rel = 'stylesheet';
    document.body.appendChild(linkGitalk);
    const scriptGitalk = document.createElement('script');
    scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
    document.body.appendChild(scriptGitalk);
  
    router.afterEach((to) => {
      if (scriptGitalk.onload) {
        loadGitalk(to);
      } else {
        scriptGitalk.onload = () => {
          loadGitalk(to);
        }
      }
    });
  
    function loadGitalk(to) {
      let commentsContainer = document.getElementById('gitalk-container');
      if (!commentsContainer) {
        commentsContainer = document.createElement('div');
        commentsContainer.id = 'gitalk-container';
        commentsContainer.classList.add('content');
      }
      commentsContainer.style.padding = '0 20px'
      const $page = document.querySelector('.page');
      const $sidebar = document.querySelector('.sidebar');
      if($sidebar){
        $sidebar.style.zIndex = '15'
      }
      if ($page) {
        $page.appendChild(commentsContainer);
        if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
          renderGitalk(to.fullPath);
        }
      }
    }
    function renderGitalk(fullPath) {
      const gitalk = new Gitalk({
        clientID: '1a4495ab05eb7f641183', // 在github上生成的
        clientSecret: 'b9b1e2659e0dc000af76c44a4f218a5018bb054c', // 在github上生成的 come from github development
        repo: 'write-blog', // 你的博客的仓库名称
        owner: 'weiweiwu01', // 你在githug上的用户名称
        admin: ['weiweiwu01'], // 管理成员
        id: 'comment',
        distractionFreeMode: false,
        language: 'zh-CN',
      });
      gitalk.render('gitalk-container');
    }
  }
  
  export default ({Vue, options, router}) => {
    try {
      document && integrateGitalk(router)
    } catch (e) {
      console.error(e.message)
    }
  }