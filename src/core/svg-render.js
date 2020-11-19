import CONST from "./const.js";
import Util from "./util.js";

export default class SVGRender {

    constructor() {
        this.width = 0;
        this.height = 0;
        this.root = null;
        this.desc = null;
        this.defs = null;
    }

    init(width, height, parent, child) {
        // SVG root
        this.root = this.create(CONST.SVG, {
        //fixed for IE9
            overflow: CONST.HIDDEN,
            xmlns: CONST.SVG_NS,
            "xmlns:xlink": CONST.SVG_LINK,
            version: 1.1
        }, parent, child);
        this.setSize(width, height);
        //description
        this.desc = this.createElement(CONST.DESC);
        this.root.appendChild(this.desc);
        //defined
        this.defs = this.createElement(CONST.DEFS);
        this.root.appendChild(this.defs);
        return this.root;
    }


    /**
     * @function
     * @param width
     * @param height
     */
    setSize(width, height) {
        const t = Util;
        width = Math.max(0, t.toNum(width, true));
        height = Math.max(0, t.toNum(height, true));
        if (this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;
            this.root.setAttribute("width", this.width);
            this.root.setAttribute("height", this.height);
        }
    }

    createElement(name) {
        if (document.createElementNS) {
            return document.createElementNS(CONST.SVG_NS, name);
        }
        return document.createElement(name);
        
    }


    /**
     * @function
     * @param name
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    create(name, data, parent, child) {
        name = name || CONST.G;
        const node = this.createElement(name);
        // attrs
        if (data) {
            for (const k in data) {
                const v = data[k];
                if (v === undefined || v === null || typeof (v) === CONST.OBJECT) {
                    continue;
                }
                if (name === CONST.IMAGE && (k === CONST.HREF || k === CONST.XHREF)) {
                    //only for href image
                    node.setAttributeNS(CONST.SVG_LINK, CONST.HREF, v);
                } else {
                    node.setAttribute(k, v);
                }
            }
        }
        // append text or children
        if (name === CONST.TEXT || child) {
            this.drawTspanList(node, child);
        }
        // append to parent
        if (parent) {
            parent.appendChild(node);
        }
        return node;
    }


    /**
     * @function
     * @param node
     * @param child
     * @returns
     */
    drawTspanList(node, child) {
        if (Util.isList(child)) {
            for (let i = 0, l = child.length; i < l; i++) {
                const item = child[i];
                if (typeof (item) === CONST.OBJECT) {
                    const tspan = item.value;
                    delete item.value;
                    this.drawTspan(item, node, tspan);
                } else {
                    node.appendChild(item);
                }
            }
        } else {
            node.appendChild(child);
        }
        return node;
    }


    /**
     * @function
     * @param node
     * @param data
     * @param child
     * @returns
     */
    drawNode(node, data, child) {
        for (const k in data) {
            node.setAttribute(k, data[k]);
        }
        if (arguments.length > 2) {
            node.innerHTML = "";
            this.drawTspanList(node, child);
        }
        return node;
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawCircle(data, parent, child) {
        //cx, cy, r
        return this.create(CONST.CIRCLE, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawEllipse(data, parent, child) {
        //cx, cy, rx, ry
        return this.create(CONST.ELLIPSE, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawRect(data, parent, child) {
        //x, y, width, height
        return this.create(CONST.RECT, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawRoundRect(data, parent, child) {
        //x, y, width, height, rx, ry
        return this.drawRect(data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    // path
    drawLine(data, parent, child) {
        //x1, y1, x2, y2
        return this.create(CONST.LINE, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawPolyline(data, parent, child) {
        //points
        return this.create(CONST.POLYLINE, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawPolygon(data, parent, child) {
        //points
        return this.create(CONST.POLYGON, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawPath(data, parent, child) {
        //d
        return this.create(CONST.PATH, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawText(data, parent, child) {
        //x, y, dx, dy, rotate, textLength, lengthAdjust
        return this.create(CONST.TEXT, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawTspan(data, parent, child) {
        //x, y, dx, dy, rotate, textLength
        return this.create(CONST.TSPAN, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawImage(data, parent, child) {
        //x, y, width, height, xlink:href
        return this.create(CONST.IMAGE, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawGroup(data, parent, child) {
        return this.create(CONST.G, data, parent, child);
    }


    /**
     * @function
     * @returns {String} for svg export
     */
    toXMLString() {
        let str = "";
        if (this.root) {
            str = this.root.outerHTML;
            if (!str) {
                const parent = this.root.parentNode;
                if (parent) {
                    str = parent.innerHTML;
                } else {
                    const temp = document.createElement("div");
                    temp.appendChild(this.root);
                    str = temp.innerHTML;
                }
            }
            if (str) {
                // SVG format sanitize
                str = str.replace(/ href=/g, " xlink:href=");
                // add SVG DTD
                str = CONST.SVG_DTD + str;
            }
        }
        return str;
    }

    toString() {
        return "[object Renderer]";
    }
}