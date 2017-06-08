/**
 * Class: UniqueThemeLayer
 * 客户端单值专题图。
 *
 * 单值专题图是利用不同的颜色或符号（线型、填充）表示图层中某一属性信息的不同属性值，属性值相同的要素具有相同的渲染风格
 * 比如土壤类型分布图、土地利用图、行政区划图等。单值专题图着重表示现象质的差别，一般不表示数量的特征。
 * Inherits from:
 *  - <GeoFeatureThemeLayer>
 */

var L = require("leaflet");
var SuperMap = require('../../common/SuperMap');
var GeoFeatureThemeLayer = require('./theme/GeoFeatureThemeLayer');

var UniqueThemeLayer = GeoFeatureThemeLayer.extend({


    initialize: function (name, options) {
        GeoFeatureThemeLayer.prototype.initialize.call(this, name, options);
        //{Array(ThemeStyle)} 图层中专题要素的样式
        this.style = [];
        //{String} 用于指定专题要素样式的属性字段名称。
        // 此属性字段是要用户数据（feature） attributes 中包含的字段，且字段对应的值的类型必须是数值型。使用标签分组显示还需要设置 styleGroups 属性。

        this.themeField = null;

        //使用此属性需要设置 themeField 属性。
        //1.没有同时设置 themeField 和 styleGroups，则所有专题要素都使用本图层的 style 进行渲染；
        //2.同时设置 themeField 和 styleGroups，则按照 themeField 指定的字段名称获取用户数据（feature）attributes 中对应的属性值；
        //   a.如果属性值等于 styleGroups 数组里某个元素定义的 value 值，则此专题要素取 styleGroups 数组中该元素定义的 style 进行渲染。
        //   b.如果属性值不等于 styleGroups 数组里任何元素定义的 value 值，则此专题要素按照本图层的 style 进行渲染。
        //此数组每个元素对象必须有两个属性：value : 与字段 themeField 相对应的属性值；style：专题要素 style。
        this.styleGroups = [];
    },


    //根据用户数据（feature）设置专题要素的 Style
    getStyleByData: function (feat) {
        var me = this,
            feature = feat,
            style = SuperMap.Util.copyAttributesWithClip({}, me.style);


        var groups = me.styleGroups,
            isSfInAttributes = false,//指定的 themeField 是否是 feature 的属性字段之一
            attribute = null; //属性值

        var isValidStyleGroup = me.styleGroups && me.styleGroups.length > 0;
        if (me.themeField && isValidStyleGroup && feature.attributes) {
            var tf = me.themeField,
                attributes = feature.attributes;
            for (var property in attributes) {
                if (tf !== property) {
                    continue;
                }
                isSfInAttributes = true;
                attribute = attributes[property];
                break;
            }
        }

        //判断属性值是否属于styleGroups的某一个范围，以便对获取分组 style
        if (isSfInAttributes && isValidStyleGroup) {
            for (var i = 0, len = groups.length; i < len; i++) {
                if ((attribute).toString() === ( groups[i].value).toString()) {
                    var sty1 = groups[i].style;
                    style = SuperMap.Util.copyAttributesWithClip(style, sty1);
                }

            }
        }
        return style;
    }
});

L.supermap.uniqueThemeLayer = function (name, options) {
    return new UniqueThemeLayer(name, options);
};

module.exports = UniqueThemeLayer;