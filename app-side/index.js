AppSideService({
  onInit() {
    console.log('app side service invoke onInit')
    settings.settingsStorage.addListener(
        'change',
        ({ key, newValue, oldValue }) => {
          console.log(key, newValue, oldValue)
        },
    )
  },
  onRun() {
    console.log('app side service invoke onRun')
  },
  onDestroy() {
    console.log('app side service invoke onDestroy')
  }
})