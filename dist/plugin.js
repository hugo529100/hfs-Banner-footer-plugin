exports.version = 1.8
exports.description = "Displays a customizable banner and footer, with optional network-based GIF filtering."
exports.apiRequired = 12.0
exports.frontend_js = 'main.js'
exports.frontend_css = 'style.css'
exports.repo = "Hug3O/Banner-footer-plugin"
exports.config = {
  enableBanner: { type: 'boolean', label: 'Show banner section', defaultValue: true, frontend: true },

  bannerMode: {
    type: 'select',
    label: 'Banner source mode',
    defaultValue: 'folder',
    frontend: true,
    options: {
      'Random from folder': 'folder',
      'Single fixed image': 'file'
    }
  },

  bannerFolder: {
    type: 'vfs_path',
    label: 'Select image folder',
    folders: true,
    files: false,
    showIf: values => values.bannerMode === 'folder',
    frontend: true
  },

  bannerFile: {
    type: 'vfs_path',
    label: 'Select single image file',
    folders: false,
    files: true,
    showIf: values => values.bannerMode === 'file',
    frontend: true
  },

  bannerHeight: {
    type: 'number',
    label: 'Banner height (vh)',
    defaultValue: 22,
    min: 10,
    max: 100,
    frontend: true
  },

networkFilterEnabled: {
  type: 'boolean',
  label: 'Enable GIF filtering for slow networks (external IPs only)',
  defaultValue: false,
  frontend: true
},


  enableFooter: {
    type: 'boolean',
    label: 'Show footer section',
    defaultValue: true,
    frontend: true
  },

  footerText: {
    type: 'string',
    multiline: true,
    label: 'Footer content',
    defaultValue: '',
    frontend: true,
    inputProps: { rows: 4 }
  },

  footerSize: {
    type: 'number',
    label: 'Footer font size (em)',
    defaultValue: 0.5,
    min: 0.1,
    max: 5,
    frontend: true
  }
}
