/**
 * Created by hxy on 2015/9/24.
 */

/*
 * options.current
 * options.dom
 *
 * */
var Slider = function (options) {
    this.el = options.dom;
    this.speed = options.speed || 300;
    this.autoTime =options.autoTime|| 2000;
    this.wrapWidth = this.el.querySelector('img').offsetWidth;
    this.wrapHeight = options.height || 250;
    this.index = 0;
};
Slider.prototype.init = function () {
    this.preListFormat();
    this.autoPlay();
};
Slider.prototype.preListFormat = function () {
    this.lists = this.el.getElementsByTagName('li');
    this.listLength = this.lists.length;
    var _this = this;
    var before = this.lists[this.listLength - 1].cloneNode(true);
    var after = this.lists[0].cloneNode(true);
    var ul = _this.el.getElementsByTagName('ul')[0];
    ul.insertBefore(before, _this.lists[0]);
    ul.appendChild(after);
    this.lists = this.el.getElementsByTagName('li');//优化
    this.listLength = this.lists.length;

    for (var i = 0; i < this.listLength; i++) {
        this.lists[i].style.width = this.wrapWidth + 'px';
        this.lists[i].style.height = this.wrapHeight + 'px';
        this.lists[i].style.webkitTransform = 'translate3d(' + (i - 1) * this.wrapWidth + 'px,0,0)';
    }
};
Slider.prototype.event = function () {

};
Slider.prototype.move = function (m) {
    var mindex;
    if (typeof m == 'number') {
        mindex = this.index;
    } else if (typeof m == 'string') {
        mindex = this.index + m * 1;
    }
    if (mindex > this.listLength - 1) {
        mindex = this.listLength - 1;
    } else if (mindex < 0) {
        mindex = 0;
    }

    this.index = mindex;
    this.lists[mindex] && (this.Transform3d(this.lists[mindex], 0, true));
    this.lists[mindex + 1] && (this.Transform3d(this.lists[mindex + 1], this.wrapWidth, true));
    this.lists[mindex - 1] && (this.Transform3d(this.lists[mindex - 1], -this.wrapWidth, true));
    this.loopSetting(mindex);

};
Slider.prototype.Transform3d = function (elm, x, m) { //核心程序  右移元素x px
    if (!elm) {
        throw new Error('未指定动画元素！');
    } else {
        elm.style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
    }
    if (m) {
        elm.style.webkitTransition = this.speed + 'ms ease-out';
    } else {
        elm.style.webkitTransition = 'none';
    }
};

Slider.prototype.autoPlay = function () {
    var _this = this;
    clearInterval(_this.timer);
    _this.timer = setInterval(function () {
        _this.move('+1');
    }, _this.autoTime);
};
Slider.prototype.loopSetting = function (n) {
    var _this = this;
    switch (n) {
        case 0:
            setTimeout(function () {
                mindex = _this.listLength - 2;
                _this.index = mindex;
                _this.Transform3d(_this.lists[0], -_this.wrapWidth, false);
                _this.Transform3d(_this.lists[mindex], 0, false);
                _this.Transform3d(_this.lists[mindex + 1], _this.wrapWidth, false);
                _this.Transform3d(_this.lists[mindex - 1], -_this.wrapWidth, false);
                for (var i = mindex - 1; i > 0; i--) {
                    _this.Transform3d(_this.lists[i], -_this.wrapWidth, false);
                }
            }, _this.speed);
            break;
        case _this.listLength - 1:
            setTimeout(function () {
                mindex = 1;
                _this.index = mindex;
                _this.Transform3d(_this.lists[mindex], 0, false);
                _this.Transform3d(_this.lists[mindex + 1], _this.wrapWidth, false);
                _this.Transform3d(_this.lists[mindex - 1], -_this.wrapWidth, false);
                _this.Transform3d(_this.lists[_this.listLength - 1], _this.wrapWidth, false);
                for (var i = mindex + 1; i < _this.listLength - 1; i++) {
                    _this.Transform3d(_this.lists[i], _this.wrapWidth, false);
                }
            }, _this.speed);
            break;
    }
};

