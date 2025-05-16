(async function () {
  const cfg = HFS.getPluginConfig('banner-footer-plugin')
  if (!cfg) return

  insertBannerHTML()
  scrollToTopOnceListIsReady()

  // === Banner logic ===
  if (cfg.enableBanner) {
    const placeholder = document.getElementById('loadingPlaceholder')
    const img = document.getElementById('randomImage')

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

      let images = allImages
if (cfg.networkFilterEnabled) {
  const host = location.hostname
  const isPrivateIP =
    host === '127.0.0.1' ||
    host === 'localhost' ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)

  if (!isPrivateIP) {
    images = allImages.filter(x => !x.toLowerCase().endsWith('.gif'))
  }
}


      if (images.length && img) {
        const selected = images[Math.floor(Math.random() * images.length)]
        const temp = new Image()
        temp.onload = () => {
          img.src = selected
          img.style.opacity = 1
          placeholder.style.display = 'none'
        }
        temp.onerror = () => {
          placeholder.style.display = 'none'
        }
        temp.src = selected
      } else {
        placeholder.style.display = 'none'
      }
    }
  }

  // === Footer logic ===
  if (cfg.enableFooter && cfg.footerText) {
    const footer = document.createElement('div')
    footer.className = 'footer-w3l'
    footer.innerHTML = cfg.footerText
      .split('\n')
      .map(line => `<p>${line.trim()}</p>`)
      .join('')
    document.body.appendChild(footer)
  }

  // === Utils ===
  function insertBannerHTML() {
    const target = document.querySelector('#root > div') || document.body
    const banner = document.createElement('div')
    banner.id = 'banner'
    banner.innerHTML = `
      <div id="loadingPlaceholder" class="loading-placeholder"></div>
      <img id="randomImage" alt="Random Image" loading="lazy">
    `
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
