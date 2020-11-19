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
        this.root = this.create(S.SVG, {
        //fixed for IE9
            overflow: S.HIDDEN,
            xmlns: S.SVG_NS,
            "xmlns:xlink": S.SVG_LINK,
            version: 1.1
        }, parent, child);
        this.setSize(width, height);
        //description
        this.desc = this.createElement(S.DESC);
        this.root.appendChild(this.desc);
        //defined
        this.defs = this.createElement(S.DEFS);
        this.root.appendChild(this.defs);
        return this.root;
    }


    /**
     * @function
     * @param width
     * @param height
     */
    setSize(width, height) {
        const t = T;
        width = Math.max(0, t.tonum(width, true));
        height = Math.max(0, t.tonum(height, true));
        if (this.width != width || this.height != height) {
            this.width = width;
            this.height = height;
            NS.SVG.attr(this.root, {
                width: this.width,
                height: this.height
            });
        }
    }

    createElement(name) {
        if (document.createElementNS) {
            return document.createElementNS(S.SVG_NS, name);
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
        name = name || S.G;
        const node = this.createElement(name);
        // attrs
        if (data) {
            for (const k in data) {
                const v = data[k];
                if (v === undefined || v === null || typeof (v) === S.OBJECT) {
                    continue;
                }
                if (name === S.IMAGE && (k === S.HREF || k === S.XHREF)) {
                    //only for href image
                    node.setAttributeNS(S.SVG_LINK, S.HREF, v);
                } else {
                    node.setAttribute(k, v);
                }
            }
        }
        // append text or children
        if (name === S.TEXT || child) {
            this.drawTspanList(node, child);
        }
        // append to parent
        if (parent) {
            $(parent).append(node);
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
        if (T.islist(child)) {
            for (let i = 0, l = child.length; i < l; i++) {
                const item = child[i];
                if (typeof (item) === S.OBJECT) {
                    const tspan = item.value;
                    delete item.value;
                    this.drawTspan(item, node, tspan);
                } else {
                    $(node).append(item);
                }
            }
        } else {
            $(node).append(child);
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
        NS.SVG.attr(node, data);
        if (arguments.length > 2) {
            $(node).empty();
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
        return this.create(S.CIRCLE, data, parent, child);
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
        return this.create(S.ELLIPSE, data, parent, child);
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
        return this.create(S.RECT, data, parent, child);
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
        return this.create(S.LINE, data, parent, child);
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
        return this.create(S.POLYLINE, data, parent, child);
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
        return this.create(S.POLYGON, data, parent, child);
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
        return this.create(S.PATH, data, parent, child);
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
        return this.create(S.TEXT, data, parent, child);
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
        return this.create(S.TSPAN, data, parent, child);
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
        return this.create(S.IMAGE, data, parent, child);
    }


    /**
     * @function
     * @param data
     * @param parent
     * @param child
     * @returns
     */
    drawGroup(data, parent, child) {
        return this.create(S.G, data, parent, child);
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
                str = S.SVG_DTD + str;
            }
        }
        return str;
    }

    toString() {
        return "[object Renderer]";
    }
}