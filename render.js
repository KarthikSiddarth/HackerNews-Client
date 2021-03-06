const appOptions = {
  el: '#app',
  data: {
    stories: {},
    segregatedList: {},
    kidsList: {},
    comments: {},
    activeStoryType: 'top',
    activePageNumber: 1,
    activeParentId: 0,
    activeChildId: 0,
    toBeRendered: [],
    interval: '',
    showstories: 'true',
    showcomments: 'false',
    showreplies: 'false',
    storyTypes: ['top', 'new', 'best', 'show', 'ask', 'jobs'],
    prev: 'prev',
    next: 'next',
    text: '',
  },
  methods: {
    checkIfStoriesLoaded: checkIfStoriesLoadedFn,
    populateStories: populateStoriesFn,
    checkIfCommentsLoaded: checkIfCommentsLoadedFn,
    populateComments: populateCommentsFn,
    changeStoryType: changeStoryTypeFn,
    handlePageNav: handlePageNavFn,
    setParentId: setParentIdFn,
    setChildId: setChildIdFn
  },
  mounted: function () {
    this.interval = setInterval(this.checkIfStoriesLoaded, 1000)
  },
  watch: {
    activePageNumber: function () {
      this.showstories = true
      this.showcomments = false
      this.showreplies = false
      this.activeParentId = 0
      fetchItems(this.activeStoryType, this.activePageNumber - 1)
      this.interval = setInterval(this.checkIfStoriesLoaded, 1000)
    },
    activeStoryType: function () {
      this.showstories = true
      this.showcomments = false
      this.showreplies = false
      this.activePageNumber = 1
      this.activeParentId = 0
      fetchItems(this.activeStoryType, this.activePageNumber - 1)
      this.interval = setInterval(this.checkIfStoriesLoaded, 1000)
    },
    activeParentId: function () {
      this.showstories = false
      this.showcomments = true
      //  this.showreplies = false
      getComments(this.activeStoryType, this.activePageNumber - 1, this.activeParentId)
      this.interval = setInterval(this.checkIfCommentsLoaded, 1000)
    },
    activeChildId: function () {
      getReplies(this.activeChildId, this.activeParentId)
      this.activeParentId = this.activeChildId
      this.interval = setInterval(this.checkIfCommentsLoaded, 1000)
    }
  },
  computed: {
    prevDisable: function () {
      if (this.activePageNumber <= 1) {
        return true
      } else if (this.activePageNumber > 1) {
        return false
      }
    },
    nextDisable: function () {
      try {
        if (this.activePageNumber >= this.segregatedList[this.activeStoryType].length) {
          return true
        } else {
          return false
        }
      } catch (err) { console.log('not loaded') }
    }
  }
}

function checkIfStoriesLoadedFn () {
  let st = this.activeStoryType
  let i = this.activePageNumber - 1
  if (this.stories[st][i] && this.segregatedList[st][i]) {
    clearInterval(this.interval)
    this.toBeRendered.length = this.segregatedList[st][i].length
    this.toBeRendered.fill('')
    this.stories[st][i].forEach((item) => { this.populateStories(st, i, item) })
  }
}

function populateStoriesFn (st, i, item) {
  item.then(story => { this.toBeRendered.splice(this.stories[st][i].indexOf(item), 1, story) })
}

function checkIfCommentsLoadedFn () {
  let ci = this.activeParentId
  if (this.comments[ci]) {
    clearInterval(this.interval)
    this.toBeRendered.length = this.comments[ci].length
    this.toBeRendered.fill('')
    this.comments[ci].forEach((item) => { this.populateComments(ci, item) })
  }
}

function populateCommentsFn (ci, item) {
  item.then(comment => { this.toBeRendered.splice(this.comments[ci].indexOf(item), 1, comment) })
}

function changeStoryTypeFn (e) {
  this.activeStoryType = e.target.textContent
  this.activePageNumber = 1
}

function handlePageNavFn (e) {
  let direction = e.target.textContent
  if (direction === 'prev') {
    this.activePageNumber--
  } else if (direction === 'next') {
    this.activePageNumber++
  }
}

function setParentIdFn (story) {
  this.text = story.title
  this.activeParentId = story.id
}

function setChildIdFn (comment) {
  this.text = comment.text
  this.activeChildId = comment.id
}

const app = new Vue(appOptions)
