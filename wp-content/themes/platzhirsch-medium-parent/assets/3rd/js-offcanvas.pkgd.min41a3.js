/*! js-Offcanvas - v1.2.7 - 2018-09-07
jQuery Accesible Offcanvas Panels
 * https://github.com/vmitsaras/js-offcanvas
 * Copyright (c) 2018 Vasileios Mitsaras (@vmitsaras)
 * MIT License */
!function (a) {
    "use strict";
    var b = a.utils || {};
    b.classes = {
        hiddenVisually: "u-hidden-visually",
        modifier: "--",
        isActive: "is-active",
        isClosed: "is-closed",
        isOpen: "is-open",
        isClicked: "is-clicked",
        isAnimating: "is-animating",
        isVisible: "is-visible",
        hidden: "u-hidden"
    },
        b.keyCodes = {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        },
        b.a11yclick = function (a) {
            var c = a.charCode || a.keyCode
                , d = a.type;
            return "click" === d || "keydown" === d && (c === b.keyCodes.SPACE || c === b.keyCodes.ENTER || void 0)
        }
        ,
        b.a11yclickBind = function (a, c, d) {
            a.on("click." + d + " keydown." + d, function (e) {
                b.a11yclick(e) && (e.preventDefault(e),
                c && "function" == typeof c && c.call(),
                    a.trigger("clicked." + d))
            })
        }
        ,
        b.supportTransition = "transition" in document.documentElement.style || "WebkitTransition" in document.documentElement.style,
        b.whichTransitionEvent = function () {
            var a = document.createElement("fakeelement")
                , b = {
                transition: "transitionend",
                WebkitTransition: "webkitTransitionEnd"
            };
            for (var c in b)
                if (void 0 !== a.style[c])
                    return b[c]
        }
        ,
        b.transEndEventName = b.whichTransitionEvent(),
        b.onEndTransition = function (a, c) {
            var d = function (a) {
                if (b.supportTransition) {
                    if (a.target != this)
                        return;
                    this.removeEventListener(b.transEndEventName, d)
                }
                c && "function" == typeof c && c.call()
            };
            b.supportTransition ? a.addEventListener(b.transEndEventName, d) : d()
        }
        ,
        b.createModifierClass = function (a, c) {
            return a + b.classes.modifier + c
        }
        ,
        b.cssModifiers = function (a, c, d) {
            for (var e = a.split(","), f = 0, g = e.length; f < g; f++)
                c.push(b.createModifierClass(d, e[f]))
        }
        ,
        b.getMetaOptions = function (a, b, c) {
            var d = "data-" + b
                , e = d + "-options"
                , f = a.getAttribute(d) || a.getAttribute(e);
            try {
                return f && JSON.parse(f) || {}
            } catch (g) {
                return void (console && console.error("Error parsing " + d + " on " + a.className + ": " + g))
            }
        }
        ,
        a.utils = b
}(this),
    function (a, b) {
        "use strict";
        var c = "trab-tab"
            , d = c + "-component";
        a.componentNamespace = a.componentNamespace || {};
        var e = a.componentNamespace.TrapTabKey = function (a, c) {
                if (!a)
                    throw new Error("Element required to initialize object");
                this.element = a,
                    this.$element = b(a),
                    c = c || {},
                    this.options = b.extend({}, this.defaults, c)
            }
        ;
        e.prototype.init = function () {
            this.$element.data(d) || this.$element.data(d, this)
        }
            ,
            e.prototype.bindTrap = function () {
                var a = this;
                this.$element.on("keydown." + c, function (b) {
                    a._trapTabKey(a.$element, b)
                })
            }
            ,
            e.prototype.unbindTrap = function () {
                this.$element.off("keydown." + c)
            }
            ,
            e.prototype.giveFocus = function () {
                var a = this
                    , b = a.options
                    , c = a.$element.find("*")
                    , d = a.$element.find("[data-focus]");
                d.length ? d.first().focus() : c.filter(b.focusableElementsString).filter(":visible").first().focus()
            }
            ,
            e.prototype._trapTabKey = function (a, b) {
                var c = this
                    , d = c.options;
                if (9 == b.which) {
                    var e, f = a.find("*");
                    e = f.filter(d.focusableElementsString).filter(":visible");
                    var g;
                    g = jQuery(":focus");
                    var h;
                    h = e.length;
                    var i;
                    i = e.index(g),
                        b.shiftKey ? 0 == i && (e.get(h - 1).focus(),
                            b.preventDefault()) : i == h - 1 && (e.get(0).focus(),
                            b.preventDefault())
                }
            }
            ,
            e.prototype.defaults = {
                focusableElementsString: "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"
            },
            e.defaults = e.prototype.defaults
    }(this, jQuery),
    function (a, b) {
        "use strict";
        var c = "button"
            , d = c + "-component"
            , e = a.utils
            , f = {
            iconOnly: "icon-only",
            withIcon: "icon",
            toggleState: "toggle-state",
            showHide: "visible-on-active"
        };
        a.componentNamespace = a.componentNamespace || {};
        var g = a.componentNamespace.Button = function (a, d) {
                if (!a)
                    throw new Error("Element required to initialize object");
                this.element = a,
                    this.$element = b(a),
                    this.options = d = d || {},
                    this.metadata = e.getMetaOptions(this.element, c),
                    this.options = b.extend({}, this.defaults, this.metadata, d)
            }
        ;
        g.prototype.init = function () {
            this.$element.data(d) || (this.$element.data(d, this),
                this.hasTitle = !!this.$element.attr("title"),
                this.$element.trigger("beforecreate." + c),
                this.isPressed = !1,
                this.isExpanded = !1,
                this._create())
        }
            ,
            g.prototype._create = function () {
                var a = this.options
                    , d = [a.baseClass + "__text"];
                this._buttonClasses = [a.baseClass],
                null === a.label && (a.label = this.$element.html()),
                a.wrapText && (this.$buttonText = b("<span></span>").html(a.label).appendTo(this.$element.empty())),
                a.icon && (this.$buttonIcon = b("<span class='" + a.iconFamily + " " + e.createModifierClass(a.iconFamily, a.icon) + "'></span>").prependTo(this.$element),
                    this._buttonClasses.push(e.createModifierClass(a.baseClass, f.withIcon)),
                a.iconActive && (a.toggle = !0,
                    this.$buttonIconActive = b("<span class='" + a.iconFamily + " " + e.createModifierClass(a.iconFamily, a.iconActive) + " " + e.createModifierClass(a.iconFamily, f.showHide) + "'></span>").insertAfter(this.$buttonIcon),
                    this._buttonClasses.push(e.createModifierClass(a.baseClass, f.toggleState))),
                a.hideText && (d.push(e.classes.hiddenVisually),
                    this._buttonClasses.push(e.createModifierClass(a.baseClass, f.iconOnly)))),
                a.modifiers && e.cssModifiers(a.modifiers, this._buttonClasses, a.baseClass),
                a.wrapText && this.$buttonText.addClass(d.join(" ")),
                a.textActive && a.wrapText && (a.toggle = !0,
                    d.push(e.createModifierClass(a.baseClass + "__text", f.showHide)),
                    this._buttonClasses.push(e.createModifierClass(a.baseClass, f.toggleState)),
                    this.$buttonTextActive = b("<span></span>").addClass(d.join(" ")).html(a.textActive).insertAfter(this.$buttonText),
                    this.$element.attr("aria-live", "polite")),
                    this.$element.addClass(this._buttonClasses.join(" ")),
                a.role && this.$element.attr("role", a.role),
                a.controls && this.controls(a.controls),
                a.pressed && this._isPressed(a.pressed),
                a.expanded && (this.isPressed = !0,
                    this._isExpanded(a.expanded)),
                this.hasTitle || !a.hideText || a.hideTitle || this.$element.attr("title", this.$element.text()),
                    this.$element.trigger("create." + c)
            }
            ,
            g.prototype._isPressed = function (a) {
                this.isPressed = a,
                    this.$element.attr("aria-pressed", a)[a ? "addClass" : "removeClass"](e.classes.isActive)
            }
            ,
            g.prototype._isExpanded = function (a) {
                this.isExpanded = a,
                    this.$element.attr("aria-expanded", a)[a ? "addClass" : "removeClass"](e.classes.isActive)
            }
            ,
            g.prototype.controls = function (a) {
                this.$element.attr("aria-controls", a)
            }
            ,
            g.prototype.destroy = function () {
                var a = this.options;
                if (this.$element.removeData(d).removeAttr("role").removeAttr("aria-pressed").removeAttr("aria-expanded").removeAttr("aria-controls").removeClass(this._buttonClasses.join(" ")).removeClass(e.classes.isActive).off("." + c),
                this.options.icon && this.$element.find('[class^="' + this.options.iconFamily + '"]').remove(),
                    a.wrapText) {
                    var b = this.$buttonText.html();
                    this.$element.empty().html(b)
                }
                this.element = null,
                    this.$element = null
            }
            ,
            g.prototype.defaults = {
                baseClass: "c-button",
                role: "button",
                label: null,
                modifiers: null,
                controls: null,
                textActive: null,
                wrapText: !0,
                hideText: !1,
                hideTitle: !1,
                icon: null,
                iconActive: null,
                iconFamily: "o-icon",
                iconPosition: null,
                pressed: !1,
                expanded: !1
            },
            g.defaults = g.prototype.defaults
    }(this, jQuery),
    function (a, b) {
        "use strict";
        var c = "jsButton"
            , d = ".js-button";
        b.fn[c] = function () {
            return this.each(function () {
                new window.componentNamespace.Button(this).init()
            })
        }
            ,
            b(document).bind("enhance", function (a) {
                b(b(a.target).is(d) && a.target).add(d, a.target).filter(d)[c]()
            })
    }(this, jQuery),
    function (a, b) {
        "use strict";
        var c = "offcanvas"
            , d = c + "-component"
            , e = a.utils
            , f = document;
        a.componentNamespace = a.componentNamespace || {};
        var g = a.componentNamespace.Offcanvas = function (a, d) {
                if (!a)
                    throw new Error("Element required to initialize object");
                this.element = a,
                    this.$element = b(a),
                    this.options = d = d || {},
                    this.metadata = e.getMetaOptions(this.element, c),
                    this.options = b.extend({}, this.defaults, this.metadata, d),
                    this.isOpen = !1,
                    this.onOpen = this.options.onOpen,
                    this.onClose = this.options.onClose,
                    this.onInit = this.options.onInit
            }
        ;
        g.prototype.init = function () {
            this.$element.data(d) || (this.$element.data(d, this),
                this.$element.trigger("beforecreate." + c),
                this._addAttributes(),
                this._initTrigger(),
                this._createModal(),
                this._trapTabKey(),
                this._closeButton(),
            this.onInit && "function" == typeof this.onInit && this.onInit.call(this.element),
                this.$element.trigger("create." + c))
        }
            ,
            g.prototype._addAttributes = function () {
                var c = this.options
                    , d = {
                    tabindex: "-1",
                    "aria-hidden": !this.isOpen
                };
                c.role && (d.role = c.role),
                    this._panelClasses = [c.baseClass, e.classes.isClosed],
                a.utils.supportTransition || this._panelClasses.push(e.createModifierClass(c.baseClass, c.supportNoTransitionsClass)),
                    e.cssModifiers(c.modifiers, this._panelClasses, c.baseClass),
                    this.$element.attr(d).addClass(this._panelClasses.join(" ")),
                    this.$content = b("." + c.contentClass),
                    this._contentOpenClasses = [],
                    e.cssModifiers(c.modifiers, this._contentOpenClasses, c.contentClass),
                    this._modalOpenClasses = [c.modalClass, e.classes.isClosed],
                    e.cssModifiers(c.modifiers, this._modalOpenClasses, c.modalClass),
                    this._bodyOpenClasses = [c.bodyModifierClass + "--visible"],
                    e.cssModifiers(c.modifiers, this._bodyOpenClasses, c.bodyModifierClass),
                    c.modifiers.toLowerCase().indexOf("reveal") >= 0 ? this.transitionElement = this.$content[0] : this.transitionElement = this.element
            }
            ,
            g.prototype._createModal = function () {
                var a = this
                    , d = a.$element.parent();
                this.options.modal && (this.$modal = b("<div></div>").on("mousedown." + c, function () {
                    a.close()
                }).appendTo(d),
                    this.$modal.addClass(this._modalOpenClasses.join(" ")))
            }
            ,
            g.prototype._trapTabKey = function () {
                this.trapTabKey = new a.componentNamespace.TrapTabKey(this.element),
                    this.trapTabKey.init()
            }
            ,
            g.prototype._trapTabEscKey = function () {
                var a = this;
                b(f).on("keyup." + c, function (c) {
                    var d = c.keyCode || c.which;
                    if (d === e.keyCodes.ESCAPE && a.isOpen) {
                        if (b("input").is(":focus"))
                            return;
                        a.close()
                    }
                })
            }
            ,
            g.prototype._closeButton = function () {
                function b() {
                    d.close()
                }

                var d = this
                    , f = d.options;
                this.$closeBtn = this.$element.find("." + f.closeButtonClass),
                this.$closeBtn.length && (this.closeBtn = new a.componentNamespace.Button(this.$closeBtn[0]),
                    this.closeBtn.init(),
                    this.closeBtn.controls(this.$element.attr("id")),
                    e.a11yclickBind(this.$closeBtn, b, c))
            }
            ,
            g.prototype.open = function () {
                var a = this
                    , g = a.options;
                this.isOpen || (g.resize && this.resize(),
                this.$trigger || (this.$trigger = this.$element.data(d + "-trigger")),
                f.activeElement && (this.lastFocus = f.activeElement),
                    this.isOpen = !0,
                    b("html, body").addClass(this._bodyOpenClasses.join(" ")),
                    this._addClasses(this.$element, this.isOpen, !0),
                    this._addClasses(this.$content, this.isOpen, !0),
                g.modal && (this._addClasses(this.$modal, this.isOpen, !0),
                    this.$modal.addClass(e.createModifierClass(g.modalClass, "opening"))),
                    this.$element.attr("aria-hidden", "false").addClass(e.createModifierClass(g.baseClass, "opening")).trigger("opening." + c),
                    this.$content.addClass(this._contentOpenClasses.join(" ")),
                    e.onEndTransition(this.transitionElement, function () {
                        a.trapTabKey.giveFocus(),
                            a.trapTabKey.bindTrap(),
                            a._addClasses(a.$element, a.isOpen, !1),
                            a._addClasses(a.$content, a.isOpen, !1),
                        g.modal && (a._addClasses(a.$modal, a.isOpen, !1),
                            a.$modal.removeClass(e.createModifierClass(g.modalClass, "opening"))),
                            a.$element.removeClass(e.createModifierClass(g.baseClass, "opening"))
                    }),
                this.$trigger && this.$trigger.button._isExpanded(!0),
                this.onOpen && "function" == typeof this.onOpen && this.onOpen.call(this.$element),
                    this.$element.trigger("open." + c),
                    this._trapTabEscKey())
            }
            ,
            g.prototype.close = function () {
                var d = this
                    , g = d.options;
                this.isOpen && (this.isOpen = !1,
                    this._addClasses(this.$element, this.isOpen, !0),
                    this._addClasses(this.$content, this.isOpen, !0),
                this.options.modal && (this._addClasses(this.$modal, this.isOpen, !0),
                    this.$modal.addClass(e.createModifierClass(g.modalClass, "closing"))),
                    this.$element.attr("aria-hidden", "true").addClass(e.createModifierClass(g.baseClass, "closing")).trigger("closing." + c),
                    this.trapTabKey.unbindTrap(),
                d.$trigger && d.$trigger.button._isExpanded(!1),
                    e.onEndTransition(this.transitionElement, function () {
                        d._addClasses(d.$element, d.isOpen, !1),
                            d._addClasses(d.$content, d.isOpen, !1),
                        d.options.modal && (d._addClasses(d.$modal, d.isOpen, !1),
                            d.$modal.removeClass(e.createModifierClass(g.modalClass, "closing"))),
                            d.$content.removeClass(d._contentOpenClasses.join(" ")),
                            d.$element.removeClass(e.createModifierClass(g.baseClass, "closing")),
                            b("html, body").removeClass(d._bodyOpenClasses.join(" ")),
                        d.lastFocus && d.lastFocus.focus()
                    }),
                this.onClose && "function" == typeof this.onClose && this.onClose.call(this.element),
                    this.$element.trigger("close." + c),
                    b(f).off("keyup." + c),
                    b(a).off("." + c))
            }
            ,
            g.prototype._addClasses = function (a, b, c) {
                b ? c ? a.removeClass(e.classes.isClosed).addClass(e.classes.isAnimating).addClass(e.classes.isOpen) : a.removeClass(e.classes.isAnimating) : c ? a.removeClass(e.classes.isOpen).addClass(e.classes.isAnimating) : a.addClass(e.classes.isClosed).removeClass(e.classes.isAnimating)
            }
            ,
            g.prototype.toggle = function () {
                this[this.isOpen ? "close" : "open"]()
            }
            ,
            g.prototype.resize = function () {
                function d() {
                    g = !1
                }

                function e() {
                    g || i(d),
                        g = !0
                }

                function f() {
                    e(),
                        h.$element.trigger("resizing." + c),
                    h.options.resize && h.close()
                }

                var g, h = this, i = function () {
                    return a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || function (b) {
                        a.setTimeout(b, 1e3 / 60)
                    }
                }();
                b(a).on("resize." + c + " orientationchange." + c, f)
            }
            ,
            g.prototype._initTrigger = function () {
                var c = this
                    , d = c.options
                    , e = this.$element.attr("id")
                    , f = "data-offcanvas-trigger";
                d.triggerButton ? this.$triggerBtn = b(d.triggerButton) : this.$triggerBtn = b("[" + f + "='" + e + "']"),
                    new a.componentNamespace.OffcanvasTrigger(this.$triggerBtn[0], {
                        offcanvas: e
                    }).init()
            }
            ,
            g.prototype.setButton = function (a) {
                this.$element.data(d + "-trigger", a)
            }
            ,
            g.prototype.destroy = function () {
                this.$element.trigger("destroy." + c),
                this.isOpen && this.close(),
                this.options.modal && this.$modal.remove(),
                    this.$element.removeData().removeClass(this._panelClasses.join(" ")).removeAttr("tabindex").removeAttr("aria-hidden"),
                this.$triggerBtn && this.$triggerBtn.removeData("offcanvas-trigger-component").off(".offcanvas").off(".offcanvas-trigger").data("button-component").destroy(),
                    this.$element.off("." + c),
                    b(f).off("." + c),
                    b(a).off("." + c)
            }
            ,
            g.prototype.defaults = {
                role: "dialog",
                modifiers: "left,overlay",
                baseClass: "c-offcanvas",
                modalClass: "c-offcanvas-bg",
                contentClass: "c-offcanvas-content-wrap",
                closeButtonClass: "js-offcanvas-close",
                bodyModifierClass: "has-offcanvas",
                supportNoTransitionsClass: "support-no-transitions",
                resize: !1,
                triggerButton: null,
                modal: !0,
                onOpen: null,
                onClose: null,
                onInit: null
            },
            g.defaults = g.prototype.defaults
    }(this, jQuery),
    function (a, b) {
        "use strict";
        var c = "offcanvas"
            , d = ".js-" + c;
        b.fn[c] = function (b) {
            return this.each(function () {
                new a.componentNamespace.Offcanvas(this, b).init()
            })
        }
            ,
            b(a.document).on("enhance", function (a) {
                b(b(a.target).is(d) && a.target).add(d, a.target).filter(d)[c]()
            })
    }(this, jQuery),
    function (a, b) {
        "use strict";
        var c = "offcanvas-trigger"
            , d = c + "-component"
            , e = a.utils;
        a.componentNamespace = a.componentNamespace || {};
        var f = a.componentNamespace.OffcanvasTrigger = function (a, c) {
                if (!a)
                    throw new Error("Element required to initialize object");
                this.element = a,
                    this.$element = b(a),
                    this.options = c = c || {},
                    this.options = b.extend({}, this.defaults, c)
            }
        ;
        f.prototype.init = function () {
            this.$element.data(d) || (this.$element.data(d, this),
                this._create())
        }
            ,
            f.prototype._create = function () {
                if (this.options.offcanvas = this.options.offcanvas || this.$element.attr("data-offcanvas-trigger"),
                    this.$offcanvas = b("#" + this.options.offcanvas),
                    this.offcanvas = this.$offcanvas.data("offcanvas-component"),
                    !this.offcanvas)
                    throw new Error("Offcanvas Element not found");
                this.button = new a.componentNamespace.Button(this.element),
                    this.button.init(),
                    this.button.controls(this.options.offcanvas),
                    this.button._isExpanded(!1),
                    this._bindbehavior()
            }
            ,
            f.prototype._bindbehavior = function () {
                function a() {
                    b.offcanvas.toggle()
                }

                var b = this;
                this.offcanvas.setButton(b),
                    e.a11yclickBind(this.$element, a, c)
            }
            ,
            f.prototype.defaults = {
                offcanvas: null
            }
    }(this, jQuery),
    function (a, b) {
        "use strict";
        var c = "offcanvasTrigger"
            , d = "[data-offcanvas-trigger],.js-" + c;
        b.fn[c] = function (b) {
            return this.each(function () {
                new a.componentNamespace.OffcanvasTrigger(this, b).init()
            })
        }
            ,
            b(a.document).on("enhance", function (a) {
                b(b(a.target).is(d) && a.target).add(d, a.target).filter(d)[c]()
            })
    }(this, jQuery);
