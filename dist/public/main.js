(async function () {
  // ★ 关键修复：检测是否在后台管理页面，如果是则直接返回，不做任何修改
  if (window.location.pathname.includes('/~/admin') || 
      window.location.pathname.includes('/~/admin/')) {
    return;
  }

  const cfg = HFS.getPluginConfig('banner-footer-plugin')
  if (!cfg) return

  if (cfg.enableBanner) {
    document.body.classList.add('hfs-with-banner')
    document.documentElement.style.setProperty(
      '--banner-footer-plugin-bannerHeight',
      cfg.bannerHeight || 22
    )

    insertBannerHTML()
    scrollToTopOnceListIsReady()

    const placeholder = document.getElementById('loadingPlaceholder')
    const img = document.getElementById('bannerImage')

    if (cfg.bannerMode === 'file' && cfg.bannerFile) {
      const temp = new Image()
      temp.onload = () => {
        img.src = cfg.bannerFile
        img.style.opacity = 1
        placeholder.style.display = 'none'
      }
      temp.onerror = () => {
        placeholder.style.display = 'none'
      }
      temp.src = cfg.bannerFile
    }

    if (cfg.bannerMode === 'folder' && cfg.bannerFolder) {
      const API_ENDPOINT = `${cfg.bannerFolder}/?get=list`
      const listText = await fetch(API_ENDPOINT).then(r => r.text()).catch(() => '')
      const allImages = listText.split(/\s+/).filter(x => /\.(jpe?g|png|gif|webp)$/i.test(x))

      // 清理文件名，移除可能的绝对路径前缀
      const cleanImages = allImages.map(filename => {
        // 如果包含完整 URL（如 http://192.168.1.224/...），提取文件名部分
        if (filename.startsWith('http://') || filename.startsWith('https://')) {
          const url = new URL(filename)
          return url.pathname.split('/').pop()
        }
        // 如果包含绝对路径，只取文件名
        if (filename.includes('/')) {
          return filename.split('/').pop()
        }
        return filename
      })

      let images = cleanImages

      if (images.length && img) {
        const STORAGE_KEY = 'banner-footer-plugin-index'
        let currentIndex = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
        
        if (currentIndex >= images.length) {
          currentIndex = 0
        }
        
        const selected = images[currentIndex]
        
        let nextIndex = currentIndex + 1
        if (nextIndex >= images.length) {
          nextIndex = 0
        }
        localStorage.setItem(STORAGE_KEY, nextIndex)
        
        // 使用相对路径拼接，确保與當前域名一致
        const imageUrl = `${cfg.bannerFolder}/${selected}`
        
        const temp = new Image()
        temp.onload = () => {
          img.src = imageUrl
          img.style.opacity = 1
          placeholder.style.display = 'none'
        }
        temp.onerror = () => {
          placeholder.style.display = 'none'
        }
        temp.src = imageUrl
      } else {
        placeholder.style.display = 'none'
      }
    }
  }

  document.documentElement.style.setProperty(
    '--banner-footer-plugin-footerSize',
    cfg.footerSize || 0.5
  )

  if (cfg.enableFooter && cfg.footerText) {
    const footer = document.createElement('div')
    footer.className = 'footer-w3l'
    footer.innerHTML = cfg.footerText
      .split('\n')
      .map(line => `<p>${line.trim()}</p>`)
      .join('')
    document.body.appendChild(footer)
  }

  function insertBannerHTML() {
    const target = document.querySelector('#root > div') || document.body
    const banner = document.createElement('div')
    banner.id = 'banner'
    
    const placeholder = document.createElement('div')
    placeholder.id = 'loadingPlaceholder'
    placeholder.className = 'loading-placeholder'
    
    const img = document.createElement('img')
    img.id = 'bannerImage'
    img.alt = 'Sequential Banner Image'
    
    banner.appendChild(placeholder)
    banner.appendChild(img)
    target.insertBefore(banner, target.firstChild)
  }

  function scrollToTopOnceListIsReady() {
    const attemptScroll = () => {
      const listReady = document.querySelector('.list-wrapper')
      if (listReady) {
        requestAnimationFrame(() => window.scrollTo(0, 0))
      } else {
        setTimeout(attemptScroll, 100)
      }
    }
    attemptScroll()
  }
})()