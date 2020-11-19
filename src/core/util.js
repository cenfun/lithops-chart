const Util = {
    //strings
    //to string type
    toStr: function(str) {
        if (typeof (str) === "function") {
            return Util.toStr(str.call());
        }
        return `${str}`;
    },
    //zero fixed
    zero: function(s, l) {
        s = Util.toStr(s);
        l = l || 2;
        if (s.length < l) {
            const n = l - s.length;
            s = Math.pow(10, n).toString().substr(1) + s;
        }
        return s;
    },
    //get a token string
    token: function(len) {
        len = Util.isNum(len) ? len : 8;
        let str = "";
        while (str.length < len) {
            str += Math.random().toString().substr(2);
        }
        str = str.substr(0, len);
        return str;
    },
    //auto add pre strings
    prefix: function(pre, data) {
        const obj = {};
        if (data && typeof (pre) === "string") {
            if (data instanceof Array) {
                for (let i = 0, l = data.length; i < l; i++) {
                    const k = Util.toStr(data[i]);
                    if (k) {
                        obj[k] = pre + k;
                    }
                }
            } else {
                for (const k in data) {
                    obj[k] = pre + k;
                }
            }
        }
        return obj;
    },
    //string replace {name}
    replace: function(str, obj) {
        str = Util.toStr(str);
        if (!obj) {
            return str;
        }
        str = str.replace(/\{(\S+)\}/g, function(match, name) {
            if (obj.hasOwnProperty(name)) {
                return obj[name];
            }
            return match;
        });
        return str;
    },
    //=================================================================================
    //number
    //if is valid number
    isNum: function(num) {
        return !((typeof (num) !== "number" || isNaN(num) || num === Number.MAX_VALUE || num === Number.MIN_VALUE || num === Number.NEGATIVE_INFINITY || num === Number.POSITIVE_INFINITY));
    },
    // format to a valid number
    toNum: function(num, toInt) {
        if (typeof (num) !== "number") {
            num = parseFloat(num);
        }
        if (isNaN(num)) {
            num = 0;
        }
        if (toInt) {
            num = Math.round(num);
        }
        return num;
    },

    numFix: function(num, fix) {
        const n = Util.toNum;
        return n(n(num).toFixed(n(fix, true)));
    },

    log10: function(x) {
        //Math.log(x) / Math.log(10)
        return Math.log(x) / Math.LN10;
    },

    clamp: function(num, min, max) {
        return Math.max(Math.min(num, max), min);
    },

    per: function(num) {
        num = Util.toNum(num);
        num = Util.clamp(num, 0, 1);
        return num;
    },

    sum: function(arr) {
        if (arr instanceof Array) {
            let n = 0;
            const l = arr.length;
            for (let i = 0; i < l; i++) {
                n += Util.toNum(arr[i]);
            }
            return n;
        }
        return 0;
    },

    average: function(arr) {
        if (arr instanceof Array) {
            const len = arr.length;
            if (len) {
                return Util.sum(arr) / len;
            }
        }
        return 0;
    },

    stdev: function(arr) {
        if (arr instanceof Array) {
            const avg = Util.average(arr);
            let n = 0;
            const l = arr.length;
            for (let i = 0; i < l; i++) {
                n += Math.pow(Util.toNum(arr[i]) - avg, 2);
            }
            if (l > 1) {
                return Math.sqrt(n / (l - 1));
            }
        }
        return 0;
    },

    //distance between point a and b
    distance: function(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /*
     * float number fixing, Floating-Point Arithmetic
     * http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
     */
    // return float part length
    flen: function(n) {
        const s = Util.toStr(n);
        const a = s.split(".");
        if (a.length > 1) {
            return a[1].length;
        }
        return 0;
    },
    // return float as int
    fint: function(n) {
        const s = Util.toStr(n);
        return parseInt(s.replace(".", ""));
    },
    // +
    add: function(n1, n2) {
        const r1 = Util.flen(n1);
        const r2 = Util.flen(n2);
        if (r1 + r2 === 0) {
            return n1 + n2;
        }
        const m = Math.pow(10, Math.max(r1, r2));
        return (Math.round(n1 * m) + Math.round(n2 * m)) / m;
      
    },
    // -
    sub: function(n1, n2) {
        return Util.add(n1, -n2);

        /*
      var r1 = Util.flen(n1);
      var r2 = Util.flen(n2);
      if (r1 + r2 == 0) {
        return n1 - n2;
      } else {
        var m = Math.pow(10, Math.max(r1, r2));
        var n = (r1 >= r2) ? r1 : r2;
        return ((n1 * m - n2 * m) / m).toFixed(n);
      }
      */
    },
    // *
    mul: function(n1, n2) {
        const r1 = Util.flen(n1);
        const r2 = Util.flen(n2);
        if (r1 + r2 === 0) {
            return n1 * n2;
        }
        const m1 = Util.fint(n1);
        const m2 = Util.fint(n2);
        return (m1 * m2) / Math.pow(10, r1 + r2);
      
    },
    // /
    div: function(n1, n2) {
        const r1 = Util.flen(n1);
        const r2 = Util.flen(n2);
        if (r1 + r2 === 0) {
            return n1 / n2;
        }
        const m1 = Util.fint(n1);
        const m2 = Util.fint(n2);
        return (m1 / m2) * Math.pow(10, r2 - r1);
      
    },
    //=================================================================================
    //array
    array: function(data) {
        if (!data) {
            return [];
        }
        if (data instanceof Array) {
            return data;
        }
        return [data];
    },
    //whether data is array with length
    isList: function(data) {
        if (data && data instanceof Array && data.length > 0) {
            return true;
        }
        return false;
    },
    //whether item in list
    inList: function(item, list) {
        if (Util.isList(list)) {
            for (let i = 0, l = list.length; i < l; i++) {
                if (list[i] === item) {
                    return true;
                }
            }
        }
        return false;
    },
    //get range value in list
    range: function(list, name, from, till) {
        let min = -Number.MAX_VALUE;
        let max = Number.MAX_VALUE;
        if (Util.isList(list)) {
            const len = list.length;
            if (Util.isNum(from) && Util.isNum(till)) {
                from = Math.round(from);
                till = Math.round(till);
                from = Util.clamp(from, 0, till);
                till = Util.clamp(till, from, len - 1);
            } else {
                from = 0;
                till = len - 1;
            }
            const numList = [];
            for (let i = from; i <= till; i++) {
                const item = list[i];
                if ((name === undefined || name === null) && Util.isNum(item)) {
                    numList.push(item);
                } else if (item) {
                    const num = item[name];
                    if (Util.isNum(num)) {
                        numList.push(num);
                    }
                }
            }
            min = Math.min.apply(null, numList);
            max = Math.max.apply(null, numList);
        }
        return {
            min: min,
            max: max
        };
    },

    //=================================================================================
    //object
    //if is plain object or array
    isObj: function(obj) {
        if (!obj || typeof (obj) !== "object" || typeof (obj.constructor) !== "function") {
            return false;
        }
        //does not need toString in Array
        if (obj.constructor === Array) {
            return true;
        }
        if (obj.constructor === Object) {
        //remove like Math Window ...
            if (typeof (obj.toString) === "function" && obj.toString() === "[object Object]") {
                return true;
            }
        }
        return false;
    },

    //if have same attributes with a target
    same: function(o, t) {
        if (typeof (o) !== typeof (t)) {
            return false;
        }
        if (o === t || (o instanceof Date && o.getTime() === t.getTime())) {
            return true;
        }
        if (!Util.isObj(o) || !Util.isObj(t)) {
            return false;
        }
        //array
        if (o instanceof Array) {
        //same length
            if (o.length !== t.length) {
                return false;
            }
            for (let i = 0, l = o.length; i < l; i++) {
                const oi = o[i];
                const ti = t[i];
                if (!Util.same(oi, ti)) {
                    return false;
                }
            }
        } else {
        //object
        //only if t have same attributes with o, maybe t more than o
            for (const k in o) {
                const ok = o[k];
                const tk = t[k];
                if (!Util.same(ok, tk)) {
                    return false;
                }
            }
        }
        return true;
    },

    //merge JSON
    merge: function() {
        const len = arguments.length;
        //no parameters
        if (!len) {
            return {};
        }
        //deep merge depend on last parameter 
        let deep = true;
        if (arguments[len - 1] === false) {
            deep = false;
        }
        //===================================
        const isObj = Util.isObj;
        const merge = Util.merge;
        //===================================
        //base merge result
        let base = null;
        //for each arguments
        let item = {};
        for (let i = 0; i < len; i++) {
            item = arguments[i];
            //only for valid object or array
            if (!isObj(item)) {
                continue;
            }
            //base type depend on first parameter
            if (base === null) {
                base = (item instanceof Array) ? [] : {};
            }
            //merge to base
            if (item instanceof Array) {
                //merge array to base
                const size = item.length;
                for (let k = 0; k < size; k++) {
                    const vk = item[k];
                    if (deep && isObj(vk)) {
                        base[k] = merge(base[k], vk);
                    } else {
                        base[k] = vk;
                    }
                }
                //length fixing for array
                if (base instanceof Array) {
                    base.length = size;
                }
            } else {
                //merge object to base
                for (const n in item) {
                    const vn = item[n];
                    if (deep && isObj(vn)) {
                        base[n] = merge(base[n], vn);
                    } else {
                        base[n] = vn;
                    }
                }
            }
        }
        return base || item;
    },

    //copy a JSON object
    copy: function(obj) {
        if (Util.isObj(obj)) {
            return Util.merge(obj);
        }
        return obj;
    },

    //=================================================================================
    //date
    isDate: function(date) {
        if (date && date instanceof Date) {
        //is Date Object but Date {Invalid Date}
            if (!isNaN(date.getTime())) {
                return true;
            }
        }
        return false;
    },

    toDate: function(date) {
        let d = date;
        if (!Util.isDate(d)) {
            d = new Date(date);
            if (!Util.isDate(d)) {
                d = new Date(Util.toNum(date));
            }
        }
        return d;
    },

    //time division
    timeDiv: function(dateFrom, dateTill) {
        dateFrom = Util.toDate(dateFrom);
        dateTill = Util.toDate(dateTill);
        let from = dateFrom;
        let till = dateTill;
        if (dateTill - dateFrom < 0) {
            from = dateTill;
            till = dateFrom;
        }
        if (till.getFullYear() !== from.getFullYear()) {
            if (till.getFullYear() - from.getFullYear() < 2 && till.getMonth() <= from.getMonth()) {
                return "monthly";
            }
            return "yearly";
        } else if (till.getMonth() !== from.getMonth()) {
            if (till.getMonth() - from.getMonth() < 2 && till.getDate() <= from.getDate()) {
                return "daily";
            }
            return "monthly";
        } else if (till.getDate() !== from.getDate()) {
            if (till.getDate() - from.getDate() < 2 && till.getHours() <= from.getHours()) {
                return "hourly";
            }
            return "daily";
        } else if (till.getHours() !== from.getHours()) {
            if (till.getHours() - from.getHours() < 2 && till.getMinutes() <= from.getMinutes()) {
                return "minutely";
            }
            return "hourly";
        }
        return "minutely";
      
    },

    //=================================================================================
    //common
    //pixel fixing for line
    pxFix: function(linePos, lineWidth, lineAlign) {
        //always to int
        linePos = Util.toNum(linePos, true);
        lineWidth = Math.max(Util.toNum(lineWidth, true), 1);
        lineAlign = Util.toNum(lineAlign);
        if (lineAlign === 0) {
        //mid align, always + offset, for example pos 0 draw in 0.5
            return linePos + (lineWidth % 2) * 0.5;
        } else if (lineAlign > 0) {
        //left align, start
            return linePos + lineWidth * 0.5;
        }
        //right align, end
        return linePos - lineWidth * 0.5;
    },

    /*
     * fit with scalemode
     */
    //0: no scale
    //1: scale with keep width/height (default)
    //2: scale without keep width/height
    //3: scale with keep width/height and cut outside
    fit: function(pw, ph, tw, th, scalemode) {
        scalemode = parseInt(scalemode);
        const rect = {
            x: 0,
            y: 0,
            width: tw,
            height: th,
            sx: 1,
            sy: 1,
            pw: pw,
            ph: ph
        };
        if (scalemode < 0 || scalemode > 3) {
            return rect;
        }
        //no sacle=========================
        //0: no scale
        if (scalemode === 0) {
            return rect;
        }
        //scale============================
        //2: scale without keep width/height
        rect.sx = pw / tw;
        rect.sy = ph / th;
        if (scalemode === 1) {
        //1: scale with keep width/height
            if (rect.sx > rect.sy) {
                rect.sx = rect.sy;
            } else if (rect.sx < rect.sy) {
                rect.sy = rect.sx;
            }
            rect.x = (pw - tw * rect.sx) * 0.5;
            rect.y = (ph - th * rect.sy) * 0.5;
        } else if (scalemode === 3) {
        //3: scale with keep width/height and cut outside
            if (rect.sx > rect.sy) {
                rect.sy = rect.sx;
            } else if (rect.sx < rect.sy) {
                rect.sx = rect.sy;
            }
            rect.x = (pw - tw * rect.sx) * 0.5;
            rect.y = (ph - th * rect.sy) * 0.5;
        }
        return rect;
    },

    //collide Brownian Motion
    collide: function(data, min, max) {
        min = isNaN(min) ? -Number.MAX_VALUE : min;
        max = isNaN(max) ? Number.MAX_VALUE : max;
        //sort list =======================================================
        const sortList = function(list) {
            list.sort(function(a, b) {
                const av = Util.isNum(a.order) ? a.order : a.value;
                const bv = Util.isNum(b.order) ? b.order : b.value;
                return av - bv;
            });
            return list;
        };
        //update all children value ==========================================
        const updateChildren = function(item) {
            const children = item.children;
            if (!children) {
                return;
            }
            sortList(children);
            let start = item.value - item.range * 0.5;
            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];
                child.value = start + child.range * 0.5;
                updateChildren(child);
                start += child.range;
            }
        };
        //range fixing by min/max ===========================================
        const clampValue = function(ls) {
            const list = Util.array(ls);
            for (let i = 0, l = list.length; i < l; i++) {
                const item = list[i];
                const r = item.range * 0.5;
                const v = Util.clamp(item.value, min + r, max - r);
                //keep value for sort
                item.order = item.value;
                //clamp value
                item.value = v;
                //update group value include all children
                updateChildren(item);
            }
            sortList(list);
        };
        //parse list =======================================================
        const parseList = function(list) {
            if (list instanceof Array) {
                const size = list.length;
                if (size > 0) {
                    let value = 0;
                    let range = 0;
                    for (let i = 0; i < size; i++) {
                        const item = list[i];
                        value += item.value;
                        range += item.range;
                    }
                    return {
                        range: range,
                        value: value / size
                    };
                }
            }
            return null;
        };
        //group items if overlap ===========================================
        const groupOverlap = function(data) {
        //fixing all by min/max first
            clampValue(data);
            //
            const dataSize = data.length;
            if (dataSize < 2) {
                return data;
            }
            //must be 2 more can overlap
            const list = [];
            let last = null;
            let team = {
                children: []
            };
            //try to group if overlap
            for (let i = 0; i < dataSize; i++) {
                const item = data[i];
                if (last) {
                    if (last.value + last.range * 0.5 > item.value - item.range * 0.5) {
                        //overlap
                        team.children.push(item);
                    } else {
                        team = {
                            children: []
                        };
                        list.push(team);
                        team.children.push(item);
                    }
                } else {
                    //first time
                    list.push(team);
                    team.children.push(item);
                }
                //keep last item at last
                last = item || last;
            }
            const listSize = list.length;
            //if any group
            if (listSize < dataSize) {
                //update average value and total range for a team list
                for (let i = 0; i < listSize; i++) {
                    const item = list[i];
                    const info = parseList(item.children);
                    if (info) {
                        item.value = info.value;
                        item.range = info.range;
                    }
                }
                //group fixing by min and max
                clampValue(list);
                //group team list
                return groupOverlap(list);
            }
            //no overlap
            return data;
        };
        //unGroup list ======================================================
        const unGroupList = function(data) {
            const list = [];
            for (let i = 0, l = data.length; i < l; i++) {
                const item = data[i];
                if (item.children) {
                    const team = unGroupList(item.children);
                    for (let j = 0, s = team.length; j < s; j++) {
                        list.push(team[j]);
                    }
                } else {
                    list.push(item);
                }
            }
            return list;
        };
        //==================================================================
        //fix all range before sort
        clampValue(data);
        //(data);
        const info = parseList(data);
        if (info) {
            if (info.range > max - min) {
                let start = min + (max - min) * 0.5 - info.range * 0.5;
                for (let i = 0, l = data.length; i < l; i++) {
                    const item = data[i];
                    item.value = start + item.range * 0.5;
                    start += item.range;
                }
                return data;
            }
        }
        //group overlap to list
        let list = groupOverlap(data);
        //(list);
        //unGroup list
        list = unGroupList(list);
        //(list);
        return list;
    }
};

export default Util;