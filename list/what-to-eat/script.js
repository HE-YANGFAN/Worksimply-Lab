//初始化地图
window.$ = function (selector) {
    return document.querySelector(selector)
}

const Map = new BMap.Map("map")
let Point = new BMap.Point(112.923100, 27.910014)
Map.enableScrollWheelZoom()
Map.centerAndZoom(Point, 18)
Map.addOverlay(new BMap.Marker(Point))
//最近搜索参数及结果
let lastSearch = {
    point: Point,
    type: '',
    radius: 0,
    list: [],
    index: 0,
    init: function (p, t, r, l) {
        this.point = p
        this.type = t
        this.radius = r
        this.list = l
        this.index = 0
    },
    getNext: function () {
        if (this.index === this.list.length)
            this.index = 0
        return this.list[this.index++]
    }
}

Map.addEventListener("click", function (e) {
    Map.clearOverlays()
    let newPoint = e.point
    Point = newPoint
    Map.addOverlay(new BMap.Marker(newPoint))
})

function whatToEat() {
    let btn = $('#wte'), resultPane = $('#result'), t = $('#type').value, r = parseInt($('#radius').value), list = []
    btn.setAttribute('disabled', 'true')
    resultPane.style.opacity = "0"

    if (Point === lastSearch.point && r === lastSearch.radius && t === lastSearch.type) {
        showPoi(lastSearch.getNext())
        btn.removeAttribute('disabled')
        resultPane.style.opacity = "1"
    } else {
        let options = {
            onSearchComplete: function (results) {
                if (local.getStatus() === BMAP_STATUS_SUCCESS) {
                    for (let i = 0; i < results.getCurrentNumPois(); i++) {
                        let item = results.getPoi(i)
                        list.push({
                            name: item.title,
                            address: item.address,
                            url: item.detailUrl
                        });
                    }
                    if (results.getPageIndex() < results.getNumPages() - 1)
                        local.gotoPage(results.getPageIndex() + 1)
                    else {
                        lastSearch.init(Point, t, r, list.shuffle())
                        showPoi(lastSearch.getNext())
                        btn.removeAttribute('disabled')
                        resultPane.style.opacity = "1"
                    }
                } else {
                    alert('别吧，这个鬼地方毛都没得吃╮(╯▽╰)╭')
                    btn.removeAttribute('disabled')
                }
            }
        }
        let local = new BMap.LocalSearch(Map, options)
        local.searchNearby(t, Point, r)
    }
}

//展示结果
function showPoi(target) {
    $('#result-name').innerText = target.name
    $('#result-address').innerText = target.address
    $('#result-url').setAttribute('href', target.url)
}

//数组乱序函数
Array.prototype.shuffle = function () {
    let array = this
    let m = array.length, t, i
    while (m) {
        i = Math.floor(Math.random() * m--)
        t = array[m]
        array[m] = array[i]
        array[i] = t
    }
    return array
}