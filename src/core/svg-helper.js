import Util from "./util.js";

const helper = {

    attr(elem, name, value) {
        if (!elem) {
            return;
        }
        const nType = elem.nodeType;
        if (!nType || nType === 3 || nType === 8 || nType === 2) {
            return elem;
        }
        if (typeof (name) === "object") {
            for (const k in name) {
                this.attr(elem, k, name[k]);
            }
            return elem;
        }
        if (arguments.length > 2) {
            if (value === null || value === undefined) {
                elem.removeAttribute(name);
            } else if (typeof (value) !== "object") {
                elem.setAttribute(name, value);
            }
            return elem;
        }
        return elem.getAttribute(name);
      
    },

    point() {
        return `${arguments[0] || 0},${arguments[1] || 0}`;
    },

    matrix() {
        return `matrix(${Array.prototype.slice.call(arguments).join(",")})`;
    },

    //transform
    translate() {
        return `translate(${Array.prototype.slice.call(arguments).join(",")})`;
    },

    scale() {
        const str = `scale(${Array.prototype.slice.call(arguments).join(",")})`;
        return str;
    },

    rotate() {
        const str = `rotate(${Array.prototype.slice.call(arguments).join(",")})`;
        return str;
    },

    skewX() {
        return `skewX(${arguments[0]})`;
    },

    skewY() {
        return `skewY(${arguments[0]})`;
    },

    /**
     * @function
     * @param t
     *          type left, top, bottom, right
     * @param l
     *          arrow length
     * @param s
     *          arrow postion scale
     * @param x
     *          offset x
     * @param y
     *          offset y
     * @param w
     *          width
     * @param h
     *          height
     * @param r
     *          radius for border
     * @returns {String} svg path d
     */

    getTipPath(t, l, s, x, y, w, h, r) {
        //get value from cache first
        //$.d(key);
        //init parameters
        s = Util.per(s);
        if (!w || !h) {
            return "";
        }
        const p = this.point;
        const arr = [];
        //border ==========================================
        //from tl top +r
        const sox = `M${p(x + r, y)}`;
        //from tl left -r
        const soy = `M${p(x, y + r)}`;
        //
        const slt = `q${p(0, -r)} ${p(r, -r)}`;
        const st = `h${w - 2 * r}`;
        const srt = `q${p(r, 0)} ${p(r, r)}`;
        const sr = `v${h - 2 * r}`;
        const srb = `q${p(0, r)} ${p(-r, r)}`;
        const sb = `h${2 * r - w}`;
        const slb = `q${p(-r, 0)} ${p(-r, -r)}`;
        const sl = `v${2 * r - h}`;
        //=================================================
        const pl = w * s;
        const pr = w - pl;
        const pt = h * s;
        const pb = h - pt;
        if (t === "top") {
        //===============================================
            arr.push(soy);
            if (pl < l + r) {
                pl < l ? arr.push(`l${p(0, -r)}l${p(pl, -l)}`) : arr.push(`q${p(0, -r)} ${p(pl - l, -r)}l${p(l, -l)}`);
            } else {
                arr.push(`${slt}h${pl - l - r}l${p(l, -l)}`);
            }
            if (pr < l + r) {
                pr < l ? arr.push(`l${p(pr, l)}l${p(0, r)}`) : arr.push(`l${p(l, l)}q${p(pr - l, 0)} ${p(pr - l, r)}`);
            } else {
                arr.push(`l${p(l, l)}h${pr - l - r}${srt}`);
            }
            arr.push(sr + srb + sb + slb + sl);
        } else if (t === "right") {
        //===============================================
            arr.push(soy + slt + st);
            if (pt < l + r) {
                pt < l ? arr.push(`l${p(r, 0)}l${p(l, pt)}`) : arr.push(`q${p(r, 0)} ${p(r, pt - l)}l${p(l, l)}`);
            } else {
                arr.push(`${srt}v${pt - l - r}l${p(l, l)}`);
            }
            if (pb < l + r) {
                pb < l ? arr.push(`l${p(-l, pb)}l${p(-r, 0)}`) : arr.push(`l${p(-l, l)}q${p(0, pb - l)} ${p(-r, pb - l)}`);
            } else {
                arr.push(`l${p(-l, l)}v${pb - l - r}${srb}`);
            }
            arr.push(sb + slb + sl);
        } else if (t === "bottom") {
        //===============================================
            arr.push(soy + slt + st + srt + sr);
            if (pr < l + r) {
                pr < l ? arr.push(`l${p(0, r)}l${p(-pr, l)}`) : arr.push(`q${p(0, r)} ${p(l - pr, r)}l${p(-l, l)}`);
            } else {
                arr.push(`${srb}h${l + r - pr}l${p(-l, l)}`);
            }
            if (pl < l + r) {
                pl < l ? arr.push(`l${p(-pl, -l)}l${p(0, -r)}`) : arr.push(`l${p(-l, -l)}q${p(l - pl, 0)} ${p(l - pl, -r)}`);
            } else {
                arr.push(`l${p(-l, -l)}h${l + r - pl}${slb}`);
            }
            arr.push(sl);
        } else if (t === "left") {
        //===============================================
            arr.push(sox + st + srt + sr + srb + sb);
            if (pb < l + r) {
                pb < l ? arr.push(`l${p(-r, 0)}l${p(-l, -pb)}`) : arr.push(`q${p(-r, 0)} ${p(-r, l - pb)}l${p(-l, -l)}`);
            } else {
                arr.push(`${slb}v${l + r - pb}l${p(-l, -l)}`);
            }
            if (pt < l + r) {
                pt < l ? arr.push(`l${p(l, -pt)}l${p(r, 0)}`) : arr.push(`l${p(l, -l)}q${p(0, l - pt)} ${p(r, l - pt)}`);
            } else {
                arr.push(`l${p(l, -l)}v${l + r - pt}${slt}`);
            }
        } else {
            arr.push(soy + slt + st + srt + sr + srb + sb + slb + sl);
        }
        //================================================
        const d = arr.join(" ");
        //set value to cache finally
        return d;
    },

    //get ellipse by 2 arc
    getArcPath(x, y, rx, ry, rotation, clockwise) {
        ry = ry || rx;
        rotation = rotation || 0;
        const c = ",";
        const rs = `a${rx}${c}${ry}`;
        const es = `${(rx * 2) + c}0`;
        const arr = [`M${x - rx}${c}${y}`];
        arr.push(rs);
        arr.push(rotation + c);
        if (clockwise) {
            arr.push("1,1");
        } else {
            arr.push("1,0");
        }
        arr.push(es);
        arr.push(rs);
        arr.push(rotation + c);
        if (clockwise) {
            arr.push("0,1");
        } else {
            arr.push("0,0");
        }
        arr.push(`-${es}`);
        arr.push("z");
        return arr.join(" ");
    },

    //center point x,y
    getEllipsePath(x, y, w, h, clockwise) {
        const kappa = 0.5522848;
        const p = this.point;
        const f = Util.numFix;
        const c = ",";
        //
        const rx = f(w * 0.5, 1);
        const ry = f(h * 0.5, 1);
        const ox = f(rx * kappa, 1);
        const oy = f(ry * kappa, 1);
        //
        const arr = [`M${p(f(x - rx, 1), y)}`];
        if (clockwise) {
            arr.push(`c${p(0, -oy)}${c}${p(f(rx - ox, 1), -ry)}${c}${p(rx, -ry)}`);
            arr.push(`s${p(rx, f(ry - oy, 1))}${c}${p(rx, ry)}`);
            arr.push(`s${p(f(ox - rx, 1), ry)}${c}${p(-rx, ry)}`);
            arr.push(`s${p(-rx, f(-ry + oy, 1))}${c}${p(-rx, -ry)}`);
        } else {
            arr.push(`c${p(0, oy)}${c}${p(f(rx - ox, 1), ry)}${c}${p(rx, ry)}`);
            arr.push(`s${p(rx, f(-ry + oy, 1))}${c}${p(rx, -ry)}`);
            arr.push(`s${p(f(ox - rx, 1), -ry)}${c}${p(-rx, -ry)}`);
            arr.push(`s${p(-rx, f(ry - oy, 1))}${c}${p(-rx, ry)}`);
        }
        arr.push("z");
        return arr.join(" ");
    },

    getRectPath(x, y, w, h) {
        const p = this.point;
        const f = Util.numFix;
        const arr = [`M${p(x, y)}`];
        arr.push(`h${f(w, 1)}`);
        arr.push(`v${f(h, 1)}`);
        arr.push(`h${f(-w, 1)}`);
        arr.push(`v${f(-h, 1)}`);
        arr.push("z");
        return arr.join(" ");
    },

    getSettingPath(x, y, r) {
        const arr = [];
        const p = this.point;
        const f = Util.numFix;
        const r1 = r;
        const r2 = r - 1.5;
        for (let i = 0; i <= 16; i++) {
            const cmd = arr.length ? "L" : "M";
            const d = (i - 0.5) / 16 * 2 * Math.PI;
            const x1 = r1 * Math.sin(d) + x + r;
            const y1 = r1 * Math.cos(d) + y + r;
            const x2 = r2 * Math.sin(d) + x + r;
            const y2 = r2 * Math.cos(d) + y + r;
            const p1 = p(f(x1, 1), f(y1, 1));
            const p2 = p(f(x2, 1), f(y2, 1));
            if (i % 2 !== 0) {
                arr.push(`${cmd + p1}L${p2}`);
            } else {
                arr.push(`${cmd + p2}L${p1}`);
            }
        }
        return arr.join(" ");
    },

    //get line data for svg format
    getElementData() {
        const copy = Util.merge.apply(this, arguments);
        //auto change to svg element parameter
        const out = {};
        for (let n in copy) {
            let v = copy[n];
            if (n === "lineWidth") {
                n = "stroke-width";
                v = Util.toNum(v, true);
            } else if (n === "lineColor") {
                n = "stroke";
            } else if (n === "fillColor") {
                n = "fill";
            }
            out[n] = v;
        }
        return out;
    },

    getLineWidth(data) {
        let width = 0;
        if (typeof (data) === "object") {
            const w = data["stroke-width"] || data.lineWidth;
            if (w !== undefined) {
                width = Util.toNum(w, true);
            } else if (data.stroke !== undefined) {
                width = 1;
            }
        }
        return width;
    },

    //get svg rect
    getBound(elem) {
        const result = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0
        };
        //if jquery
        elem = Util.jq2dom(elem);
        if (!elem) {
            return result;
        }
        //ClientRect top, left, right, bottom, width, height (top, left doesn't include scroll distance)
        let bound = null;
        if (elem.getBoundingClientRect) {
            try {
                bound = elem.getBoundingClientRect();
            } catch (e) {
            }
        }
        if (bound) {
            for (const k in bound) {
                result[k] = bound[k];
            }
        }
        return result;
    },

    getRect(elem) {
        const result = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        //if jquery
        elem = Util.jq2dom(elem);
        if (!elem) {
            return result;
        }
        //SVGRect x, y, width, height
        let bbox = null;
        if (elem.getBBox) {
            try {
                bbox = elem.getBBox();
            } catch (e) {
            }
        }
        //copy info
        if (bbox) {
            for (const k in bbox) {
                result[k] = bbox[k];
            }
        } else {
        //try html method
            result.x = elem.offsetLeft;
            result.y = elem.pffsetTop;
            result.width = elem.offsetWidth;
            result.height = elem.offsetHeight;
        }
        return result;
    },

    getPath() {
        const a = [];
        let n = false;
        for (let i = 0; i < arguments.length; i++) {
            const v = arguments[i];
            if (Util.isNum(v)) {
                if (n) {
                    a.push(",");
                }
                a.push(Util.numFix(v, 1));
                n = true;
            } else {
                a.push(v);
                n = false;
            }
        }
        const s = a.join("");
        return s;
    }
};

export default helper;