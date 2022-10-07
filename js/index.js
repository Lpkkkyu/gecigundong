/**
 * 解析字符串数据变成数组对象[{},{},{},...,{}]
 * 把数据变成{time:'',words:''}
 */
function parseLrc() {
  const result = []
  const lrcData = lrc.split('\n')
  for (let i = 0; i < lrcData.length; i++) {
    const lrc = lrcData[i].split(']')
    const words = lrc[1]
    const time = lrc[0].substring(1)
    const obj = {
      time: parseTime(time),
      words,
    }
    result.push(obj)
  }
  return result
}

/**
 * 解析时间--> eg:180s
 */
function parseTime(time) {
  const str = time.split(':')
  return +str[0] * 60 + +str[1]
}

//储存数据
const lrcData = parseLrc()

//获取dom节点
const doms = {
  audio: document.querySelector('audio'),
  ul: document.querySelector('.container ul'),
  container: document.querySelector('.container'),
}

/**
 * 获取每一段文字的下标
 */
function findIndex() {
  const current = doms.audio.currentTime
  for (let i = 0; i < lrcData.length; i++) {
    if (lrcData[i].time > current) {
      return i - 1
    }
  }
  //如果时间没有找到则播放到了最后一句
  return lrcData.length - 1
}
/**
 * 界面
 */
function createElement() {
  const frag = document.createDocumentFragment() //文档片段
  for (let i = 0; i < lrcData.length; i++) {
    const li = document.createElement('li')
    li.textContent = lrcData[i].words
    frag.appendChild(li)
  }
  doms.ul.appendChild(frag)
}
createElement()

var liHeight = doms.ul.children[0].clientHeight
var containerHeight = doms.container.clientHeight
var maxOffset = doms.ul.clientHeight - containerHeight

/**
 * 计算偏移量
 */
function setoffset() {
  var index = findIndex()
  var offset = liHeight * index + liHeight / 2 - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }
  doms.ul.style.transform = `translateY(-${offset}px)`
  var li = doms.ul.querySelector('.active')
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}

doms.audio.addEventListener('timeupdate', setoffset)
