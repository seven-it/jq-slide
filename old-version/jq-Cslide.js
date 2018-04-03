/*
 * @Author: seven-it
 * @Date: 2018-04-02 09:11:18
 * @Last Modified time: 2018-04-02 09:23:19
 * @e-mail : 940258489@qq.com
 */
(function ($) {
  var SeamlessRolling = function (el, options) {
    this.$bannerBox = $(el);
    this.$bannerCount = 0;
    this.tabCount = 0;
    this.bOk = true;
    this.defaults = {
      imgBox: this.$bannerBox.children().eq(0),
      tabEl: this.$bannerBox.children().eq(1),
      prev: $('.prev').first(),
      next: $('.next').first(),
      tabShow: false,
      btnRoll: false,
      loopItem: true,
      direction: 'top',
      tabSpeed: 2000,
      animateSpeed: 1000,
      autoPlay: true
    };
    this.settings = $.extend({}, this.defaults, options);
    this.$bannerImgBox = this.settings.imgBox;
    this.$bannerTab = this.settings.tabEl;
    this.$bannerImgItems = this.$bannerImgBox.children();
    this.$bannerTabItems = this.$bannerTab.children();
    this.$bannerImgItemH = this.$bannerImgItems.outerHeight();
    this.$bannerImgItemW = this.$bannerImgItems.outerWidth();
    this.properties = {};


    if (this.settings.tabShow) {
      this.tabShow()
      this.tabRoll()
    }
    if (this.settings.direction === 'left' || this.settings.direction === 'right') {
      this.initCss('left', this.$bannerImgItemW)
      this.$bannerImgBox.css('width', (this.$bannerImgItemW * this.$bannerImgItems.length))
    } else {
      this.initCss('top', this.$bannerImgItemH)
    }
    if (this.settings.btnRoll) {
      this.btnRoll()
    }
    if (this.settings.autoPlay) {
      this.autoPlay()
    }
    if (this.settings.loopItem) {
      this.loopItem()
    }
  }
  SeamlessRolling.prototype = {
    initCss: function (_direction, distance) {
      //开启循环轮播时，初始化css样式
      if (this.settings.loopItem) {
        this.$bannerImgBox.css(_direction, -distance)
        this.$bannerCount = 1;
      }
    },
    tabShow: function () {
      // 添加 tab 按钮
      for (var i = 0; i < this.$bannerImgItems.length; i++) {
        this.$bannerTab.append('<li></li>')
      }
      this.$bannerTabItems = this.$bannerTab.children();
      this.$bannerTabItems.eq(this.tabCount).addClass('active');
    },
    tabRoll: function () {
      // 通过tab按钮切换轮播
      // 注意：事件中this指向当前dom元素，而不是对象
      var _this = this;
      this.$bannerTabItems.mouseover(function () {
        clearInterval(_this.timer)
        if (_this.bOk) {
          _this.bOk = false;
          if (_this.settings.loopItem) {
            //开启无限轮播时 克隆后的最后一张图片被插入到ul最前面，所有要对应tab按钮+1
            _this.$bannerCount = $(this).index() + 1;
          } else {
            _this.$bannerCount = $(this).index();
          }
          //移入时高亮当前tab元素
          _this.tabCount = $(this).index();
          //当轮播方向为水平方向时，要重新调用轮播函数并传入宽度值，与方向值
          if (_this.settings.direction === 'left' || _this.settings.direction === 'right') {
            _this.ItemRoll(-_this.$bannerImgItemW, 'left');
          } else {
            //垂直方向，调用轮播函数
            _this.ItemRoll(-_this.$bannerImgItemH, 'top')
          }
        }
      })
      this.$bannerTabItems.mouseout(function () {
        //移出时判断是否开启轮播
        if (_this.settings.autoPlay) {
          clearInterval(_this.timer)
          _this.autoPlay();
        }
      })
    },
    btnRoll: function () {
      // prev 和 next 按钮切换banner
      var _this = this;
      this.settings.prev.addClass('bannerButton');
      this.settings.next.addClass('bannerButton');
      $('.bannerButton').mouseover(function () {
        clearInterval(_this.timer)
      })
      $('.bannerButton').mouseout(function () {
        if (_this.settings.autoPlay) {
          clearInterval(_this.timer)
          _this.autoPlay();
        }
      })
      this.settings.prev.click(function () {
        //判断轮播滚动方向，由于和autoplay()判断方式相同，封装到一个方法中公用switchDirection（）
        if (_this.bOk) {
          _this.bOk = false;
          _this.switchDirection();
        }

      })
      this.settings.next.click(function () {
        // 该判断为next按钮轮播条件判断，与switchDirection() 方法判断只是方向位置发生了变化，其它逻辑完全一样
        if (_this.bOk) {
          _this.bOk = false;
          switch (_this.settings.direction) {
            case 'bottom':
              _this.$bannerCount++;
              _this.tabCount++
              if (!_this.settings.loopItem && _this.$bannerCount >= _this.$bannerImgItems.length) {
                _this.$bannerCount = 0;
              }
              if (_this.tabCount >= _this.$bannerTabItems.length) {
                _this.tabCount = 0;
              }
              _this.ItemRoll(-_this.$bannerImgItemH, 'top')
              break;
            case 'top':
              _this.$bannerCount--;
              if (_this.tabCount <= 0) {
                _this.tabCount = _this.$bannerTabItems.length;
              }
              _this.tabCount--;
              if (!_this.settings.loopItem && _this.$bannerCount < 0) {
                _this.$bannerCount = _this.$bannerImgItems.length - 1;
              }
              _this.ItemRoll(-_this.$bannerImgItemH, 'top')
              break;
            case 'right':
              _this.$bannerCount++;
              _this.tabCount++
              if (!_this.settings.loopItem && _this.$bannerCount >= _this.$bannerImgItems.length) {
                _this.$bannerCount = 0;
              }
              if (_this.tabCount >= _this.$bannerTabItems.length) {
                _this.tabCount = 0;
              }

              _this.ItemRoll(-_this.$bannerImgItemW, 'left')
              break;
            case 'left':
              _this.$bannerCount--;
              if (_this.tabCount <= 0) {
                _this.tabCount = _this.$bannerTabItems.length;
              }
              _this.tabCount--;
              if (!_this.settings.loopItem && _this.$bannerCount < 0) {
                _this.$bannerCount = _this.$bannerImgItems.length - 1;
              }
              _this.ItemRoll(-_this.$bannerImgItemW, 'left')
              break;
          }
        }
      })
    },
    ItemRoll: function (distance, _direction) {
      // 图片运动效果 使用animate进行
      var _this = this;
      // 下面保存的这个this.properties对象是因为在animate中
      //直接使用_direction这个参数是无效的，所以就这样保存对象来写了
      this.properties[_direction] = distance * this.$bannerCount;
      this.$bannerImgBox.stop(true).animate(
        this.properties,
        _this.settings.animateSpeed,
        function () {
          //由于上下方向都是改变top值，左右方向都是改变left值，所以仅作两个判断即可
          switch (_direction) {
            case 'top':
              if (_this.settings.loopItem && _this.$bannerCount >= _this.$bannerImgItems.length - 1) {
                _this.$bannerCount = 1;
                _this.$bannerImgBox.css('top', distance)
              }
              if (_this.settings.loopItem && _this.$bannerCount <= 0) {
                _this.$bannerCount = _this.$bannerImgItems.length - 2;
                _this.$bannerImgBox.css('top', _this.$bannerCount * distance)
              }
              break;
            case 'left':
              if (_this.settings.loopItem && _this.$bannerCount >= _this.$bannerImgItems.length - 1) {
                _this.$bannerCount = 1;
                _this.$bannerImgBox.css('left', distance)
              }
              if (_this.settings.loopItem && _this.$bannerCount <= 0) {
                _this.$bannerCount = _this.$bannerImgItems.length - 2;
                _this.$bannerImgBox.css('left', _this.$bannerCount * distance)
              }
              break;
          }
          _this.bOk = true;
        }
      )
      this.$bannerTabItems.removeClass('active')
      this.$bannerTabItems.eq(this.tabCount).addClass('active')
    },
    autoPlay: function () {
      // 开启自动轮播
      var _this = this;
      _this.timer = setInterval(function () {
        //判断轮播滚动方向，由于和prev按钮判断方式相同，封装到一个方法中公用switchDirection（）
        _this.switchDirection();
        _this.$bannerTabItems.removeClass('active')
        _this.$bannerTabItems.eq(_this.tabCount).addClass('active')
      }, _this.settings.tabSpeed)
    },
    loopItem: function () {
      var _this = this;
      if (_this.settings.loopItem) {
        //判断是否开启无缝轮播，如果开启，那么克隆第一个和最后一个元素，分别反转插入父级的第一个与最后一个位置
        var cloneFirst = this.$bannerImgItems.first().clone();
        var cloneLast = this.$bannerImgItems.last().clone()
        this.$bannerImgBox.append(cloneFirst);
        this.$bannerImgBox.prepend(cloneLast);
        //重新获取轮播元素节点
        this.$bannerImgItems = this.$bannerImgBox.children()
        //如果是左右轮播时需要重置父级的总宽度
        if (_this.settings.direction === 'left' || _this.settings.direction === 'right') {
          this.$bannerImgBox.css('width', (this.$bannerImgItemW * this.$bannerImgItems.length))
        }
      }
    },
    switchDirection: function () {
      var _this = this;
      //判断传入的方向参数，进行相对应的判断处理
      switch (_this.settings.direction) {
        case 'top':
          _this.$bannerCount++;
          _this.tabCount++
          //判断没有无限轮播时 点击按钮切换逻辑
          if (!_this.settings.loopItem && _this.$bannerCount >= _this.$bannerImgItems.length) {
            _this.$bannerCount = 0;
          }
          if (_this.tabCount >= _this.$bannerTabItems.length) {
            _this.tabCount = 0;
          }
          _this.ItemRoll(-_this.$bannerImgItemH, 'top')
          break;
        case 'bottom':
          _this.$bannerCount--;
          if (_this.tabCount <= 0) {
            _this.tabCount = _this.$bannerTabItems.length;
          }
          //判断没有无限轮播时 点击按钮切换逻辑
          if (!_this.settings.loopItem && _this.$bannerCount < 0) {
            _this.$bannerCount = _this.$bannerImgItems.length - 1;
          }
          _this.tabCount--;
          _this.ItemRoll(-_this.$bannerImgItemH, 'top')
          break;
        case 'left':
          _this.$bannerCount++;
          _this.tabCount++
          //判断没有无限轮播时 点击按钮切换逻辑
          if (!_this.settings.loopItem && _this.$bannerCount >= _this.$bannerImgItems.length) {
            _this.$bannerCount = 0;
          }
          if (_this.tabCount >= _this.$bannerTabItems.length) {
            _this.tabCount = 0;
          }
          _this.ItemRoll(-_this.$bannerImgItemW, 'left')
          break;
        case 'right':
          _this.$bannerCount--;
          if (_this.tabCount <= 0) {
            _this.tabCount = _this.$bannerTabItems.length;
          }
          //判断没有无限轮播时 点击按钮切换逻辑
          if (!_this.settings.loopItem && _this.$bannerCount < 0) {
            _this.$bannerCount = _this.$bannerImgItems.length - 1;
          }
          _this.tabCount--;
          _this.ItemRoll(-_this.$bannerImgItemW, 'left')
          break;
      }
    }
  }
  $.fn.SeamlessRolling = function (options) {
    new SeamlessRolling(this, options)
    return this;
  }
})(jQuery)