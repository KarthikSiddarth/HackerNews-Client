const appOptions = {
  el: '#app',
  data: {
    stories: {},
    segregatedList: {},
    activeStoryType: 'top',
    activePageNumber: 1,
    toBeRendered: [],
    interval: ''
  },
  methods: {
    checkIfLoaded: checkIfLoaded,
    populate: populateStories
  },
  mounted: function () {
    this.interval = setInterval(this.checkIfLoaded, 1000)
  },
  watch: {
    activePageNumber: function () {
      fetchItems(this.activeStoryType, this.activePageNumber - 1)
      this.interval = setInterval(this.checkIfLoaded, 1000)
    },
    activeStoryType: function () {
      this.activePageNumber = 1
      fetchItems(this.activeStoryType, this.activePageNumber - 1)
      this.interval = setInterval(this.checkIfLoaded, 1000)
    }
  }
}

function checkIfLoaded () {
  let st = this.activeStoryType
  let i = this.activePageNumber - 1
  if (this.stories[st][i]) {
    clearInterval(this.interval)
    this.stories[st][i].forEach((item) => { this.populate(st, i, item) })
  }
}

function populateStories (st, i, item) {
  app.segregatedList[st][i] ? this.toBeRendered.length = app.segregatedList[st][i].length : this.toBeRendered.length = 15
  this.toBeRendered.fill('loading...')
  item.then(story => { this.toBeRendered.splice(this.stories[st][i].indexOf(item), 1, story) })
}

const app = new Vue(appOptions)
