const path = require('path')
const fs = require('fs-extra')

class Config {
  constructor() {
    this.setDefaults()
  }

  setDefaults() {
    this.root = process.env.PWD
    this.configFileName = 'horseman-config.js'
    this.config = this.getConfig()
    this.defaultConfig = {
      typePath: './data/types.json',
      dataPath: './data/data.json',
      mediaPath: './data/media'
    }
  }

  getConfig() {
    const configPath = path.join(this.root, this.configFileName)
    if (fs.existsSync(configPath)) {
      return require(configPath)
    }
    return null
  }

  get typePath() {
    console.log(path.join(this.root, this.config.typePath || this.defaultConfig.typePath))
    return path.join(this.root, this.config.typePath || this.defaultConfig.typePath)
  }

  get dataPath() {
    return path.join(this.root, this.config.dataPath || this.defaultConfig.dataPath)
  }

  get mediaPath() {
    return path.join(this.root, this.config.mediaPath || this.defaultConfig.mediaPath)
  }
}

module.exports = new Config()
