import { U as computed, Yn as shallowRef, er as toValue, gn as watch } from "./vue.runtime.esm-bundler-D4M2X7UN.js";
import { notNullish, toArray, tryOnScopeDispose, unrefElement } from "./vitepress_n_@vueuse_core.js";
//#region node_modules/tabbable/dist/index.esm.js
/*!
* tabbable 6.5.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = [
	"input:not([inert]):not([inert] *)",
	"select:not([inert]):not([inert] *)",
	"textarea:not([inert]):not([inert] *)",
	"a[href]:not([inert]):not([inert] *)",
	"area[href]:not([inert]):not([inert] *)",
	"button:not([inert]):not([inert] *)",
	"[tabindex]:not(slot):not([inert]):not([inert] *)",
	"audio[controls]:not([inert]):not([inert] *)",
	"video[controls]:not([inert]):not([inert] *)",
	"[contenteditable]:not([contenteditable=\"false\"]):not([inert]):not([inert] *)",
	"details>summary:first-of-type:not([inert]):not([inert] *)",
	"details:not([inert]):not([inert] *)"
];
var candidateSelector = /* #__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
	var _element$getRootNode;
	return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
	return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
/**
* Determines if a node is inert or in an inert ancestor.
* @param {Node} [node]
* @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
*  see if any of them are inert. If false, only `node` itself is considered.
* @returns {boolean} True if inert itself or by way of being in an inert ancestor.
*  False if `node` is falsy.
*/
var _isInert = function isInert(node, lookUp) {
	var _node$getAttribute;
	if (lookUp === void 0) lookUp = true;
	var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
	return inertAtt === "" || inertAtt === "true" || lookUp && node && (typeof node.closest === "function" ? node.closest("[inert]") : _isInert(node.parentNode));
};
/**
* Determines if a node's content is editable.
* @param {Element} [node]
* @returns True if it's content-editable; false if it's not or `node` is falsy.
*/
var isContentEditable = function isContentEditable(node) {
	var _node$getAttribute2;
	var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
	return attValue === "" || attValue === "true";
};
/**
* @param {Element} el container to check in
* @param {boolean} includeContainer add container to check
* @param {(node: Element) => boolean} filter filter candidates
* @returns {Element[]}
*/
var getCandidates = function getCandidates(el, includeContainer, filter) {
	if (_isInert(el)) return [];
	var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
	if (includeContainer && matches.call(el, candidateSelector)) candidates.unshift(el);
	candidates = candidates.filter(filter);
	return candidates;
};
/**
* @callback GetShadowRoot
* @param {Element} element to check for shadow root
* @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
*/
/**
* @callback ShadowRootFilter
* @param {Element} shadowHostNode the element which contains shadow content
* @returns {boolean} true if a shadow root could potentially contain valid candidates.
*/
/**
* @typedef {Object} CandidateScope
* @property {Element} scopeParent contains inner candidates
* @property {Element[]} candidates list of candidates found in the scope parent
*/
/**
* @typedef {Object} IterativeOptions
* @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
*  if a function, implies shadow support is enabled and either returns the shadow root of an element
*  or a boolean stating if it has an undisclosed shadow root
* @property {(node: Element) => boolean} filter filter candidates
* @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
* @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
*/
/**
* @param {Element[]} elements list of element containers to match candidates from
* @param {boolean} includeContainer add container list to check
* @param {IterativeOptions} options
* @returns {Array.<Element|CandidateScope>}
*/
var _getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
	var candidates = [];
	var elementsToCheck = Array.from(elements);
	while (elementsToCheck.length) {
		var element = elementsToCheck.shift();
		if (_isInert(element, false)) continue;
		if (element.tagName === "SLOT") {
			var assigned = element.assignedElements();
			var nestedCandidates = _getCandidatesIteratively(assigned.length ? assigned : element.children, true, options);
			if (options.flatten) candidates.push.apply(candidates, nestedCandidates);
			else candidates.push({
				scopeParent: element,
				candidates: nestedCandidates
			});
		} else {
			if (matches.call(element, candidateSelector) && options.filter(element) && (includeContainer || !elements.includes(element))) candidates.push(element);
			var shadowRoot = element.shadowRoot || typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
			var validShadowRoot = !_isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
			if (shadowRoot && validShadowRoot) {
				var _nestedCandidates = _getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
				if (options.flatten) candidates.push.apply(candidates, _nestedCandidates);
				else candidates.push({
					scopeParent: element,
					candidates: _nestedCandidates
				});
			} else elementsToCheck.unshift.apply(elementsToCheck, element.children);
		}
	}
	return candidates;
};
/**
* @private
* Determines if the node has an explicitly specified `tabindex` attribute.
* @param {HTMLElement} node
* @returns {boolean} True if so; false if not.
*/
var hasTabIndex = function hasTabIndex(node) {
	return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
/**
* Determine the tab index of a given node.
* @param {HTMLElement} node
* @returns {number} Tab order (negative, 0, or positive number).
* @throws {Error} If `node` is falsy.
*/
var getTabIndex = function getTabIndex(node) {
	if (!node) throw new Error("No node provided");
	if (node.tabIndex < 0) {
		if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) return 0;
	}
	return node.tabIndex;
};
/**
* Determine the tab index of a given node __for sort order purposes__.
* @param {HTMLElement} node
* @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
*  has tabIndex -1, but needs to be sorted by document order in order for its content to be
*  inserted into the correct sort position.
* @returns {number} Tab order (negative, 0, or positive number).
*/
var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
	var tabIndex = getTabIndex(node);
	if (tabIndex < 0 && isScope && !hasTabIndex(node)) return 0;
	return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
	return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput(node) {
	return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput(node) {
	return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
	return node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
		return child.tagName === "SUMMARY";
	});
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
	for (var i = 0; i < nodes.length; i++) if (nodes[i].checked && nodes[i].form === form) return nodes[i];
};
var isTabbableRadio = function isTabbableRadio(node) {
	if (!node.name) return true;
	var radioScope = node.form || getRootNode(node);
	var queryRadios = function queryRadios(name) {
		return radioScope.querySelectorAll("input[type=\"radio\"][name=\"" + name + "\"]");
	};
	var radioSet;
	if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") radioSet = queryRadios(window.CSS.escape(node.name));
	else try {
		radioSet = queryRadios(node.name);
	} catch (err) {
		console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
		return false;
	}
	var checked = getCheckedRadio(radioSet, node.form);
	return !checked || checked === node;
};
var isRadio = function isRadio(node) {
	return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
	return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached(node) {
	var _nodeRoot;
	var nodeRoot = node && getRootNode(node);
	var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
	var attached = false;
	if (nodeRoot && nodeRoot !== node) {
		var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
		attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
		while (!attached && nodeRootHost) {
			var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
			nodeRoot = getRootNode(nodeRootHost);
			nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
			attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
		}
	}
	return attached;
};
var isZeroArea = function isZeroArea(node) {
	var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
	return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
	var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
	if (displayCheck === "full-native") {
		if ("checkVisibility" in node) return !node.checkVisibility({
			checkOpacity: false,
			opacityProperty: false,
			contentVisibilityAuto: true,
			visibilityProperty: true,
			checkVisibilityCSS: true
		});
	}
	var visibility = getComputedStyle(node).visibility;
	if (visibility === "hidden" || visibility === "collapse") return true;
	var nodeUnderDetails = matches.call(node, "details>summary:first-of-type") ? node.parentElement : node;
	if (matches.call(nodeUnderDetails, "details:not([open]) *")) return true;
	if (!displayCheck || displayCheck === "full" || displayCheck === "full-native" || displayCheck === "legacy-full") {
		if (typeof getShadowRoot === "function") {
			var originalNode = node;
			while (node) {
				var parentElement = node.parentElement;
				var rootNode = getRootNode(node);
				if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) return isZeroArea(node);
				else if (node.assignedSlot) node = node.assignedSlot;
				else if (!parentElement && rootNode !== node.ownerDocument) node = rootNode.host;
				else node = parentElement;
			}
			node = originalNode;
		}
		if (isNodeAttached(node)) return !node.getClientRects().length;
		if (displayCheck !== "legacy-full") return true;
	} else if (displayCheck === "non-zero-area") return isZeroArea(node);
	return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
		var parentNode = node.parentElement;
		while (parentNode) {
			if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
				for (var i = 0; i < parentNode.children.length; i++) {
					var child = parentNode.children.item(i);
					if (child.tagName === "LEGEND") return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
				}
				return true;
			}
			parentNode = parentNode.parentElement;
		}
	}
	return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
	if (node.disabled || isHiddenInput(node) || isHidden(node, options) || isDetailsWithSummary(node) || isDisabledFromFieldset(node)) return false;
	return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
	if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) return false;
	return true;
};
var isShadowRootTabbable = function isShadowRootTabbable(shadowHostNode) {
	var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
	if (isNaN(tabIndex) || tabIndex >= 0) return true;
	return false;
};
/**
* @param {Array.<Element|CandidateScope>} candidates
* @returns Element[]
*/
var _sortByOrder = function sortByOrder(candidates) {
	var regularTabbables = [];
	var orderedTabbables = [];
	candidates.forEach(function(item, i) {
		var isScope = !!item.scopeParent;
		var element = isScope ? item.scopeParent : item;
		var candidateTabindex = getSortOrderTabIndex(element, isScope);
		var elements = isScope ? _sortByOrder(item.candidates) : element;
		if (candidateTabindex === 0) isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
		else orderedTabbables.push({
			documentOrder: i,
			tabIndex: candidateTabindex,
			item,
			isScope,
			content: elements
		});
	});
	return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
		sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
		return acc;
	}, []).concat(regularTabbables);
};
var tabbable = function tabbable(container, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = _getCandidatesIteratively([container], options.includeContainer, {
		filter: isNodeMatchingSelectorTabbable.bind(null, options),
		flatten: false,
		getShadowRoot: options.getShadowRoot,
		shadowRootFilter: isShadowRootTabbable
	});
	else candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
	return _sortByOrder(candidates);
};
var focusable = function focusable(container, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = _getCandidatesIteratively([container], options.includeContainer, {
		filter: isNodeMatchingSelectorFocusable.bind(null, options),
		flatten: true,
		getShadowRoot: options.getShadowRoot
	});
	else candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
	return candidates;
};
var isTabbable = function isTabbable(node, options) {
	options = options || {};
	if (!node) throw new Error("No node provided");
	if (matches.call(node, candidateSelector) === false) return false;
	return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* #__PURE__ */ candidateSelectors.concat("iframe:not([inert]):not([inert] *)").join(",");
var isFocusable = function isFocusable(node, options) {
	options = options || {};
	if (!node) throw new Error("No node provided");
	if (matches.call(node, focusableCandidateSelector) === false) return false;
	return isNodeMatchingSelectorFocusable(options, node);
};
//#endregion
//#region node_modules/focus-trap/dist/focus-trap.esm.js
/*!
* focus-trap 8.2.2
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _createForOfIteratorHelper(r, e) {
	var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (!t) {
		if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
			t && (r = t);
			var n = 0, F = function() {};
			return {
				s: F,
				n: function() {
					return n >= r.length ? { done: true } : {
						done: false,
						value: r[n++]
					};
				},
				e: function(r) {
					throw r;
				},
				f: F
			};
		}
		throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	var o, a = true, u = false;
	return {
		s: function() {
			t = t.call(r);
		},
		n: function() {
			var r = t.next();
			return a = r.done, r;
		},
		e: function(r) {
			u = true, o = r;
		},
		f: function() {
			try {
				a || null == t.return || t.return();
			} finally {
				if (u) throw o;
			}
		}
	};
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: true,
		configurable: true,
		writable: true
	}) : e[r] = t, e;
}
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), true).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r);
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
var activeFocusTraps = {
	getActiveTrap: function getActiveTrap(trapStack) {
		if ((trapStack === null || trapStack === void 0 ? void 0 : trapStack.length) > 0) return trapStack[trapStack.length - 1];
		return null;
	},
	activateTrap: function activateTrap(trapStack, trap) {
		if (trap !== activeFocusTraps.getActiveTrap(trapStack)) activeFocusTraps.pauseTrap(trapStack);
		var trapIndex = trapStack.indexOf(trap);
		if (trapIndex === -1) trapStack.push(trap);
		else {
			trapStack.splice(trapIndex, 1);
			trapStack.push(trap);
		}
	},
	deactivateTrap: function deactivateTrap(trapStack, trap) {
		var trapIndex = trapStack.indexOf(trap);
		if (trapIndex !== -1) trapStack.splice(trapIndex, 1);
		activeFocusTraps.unpauseTrap(trapStack);
	},
	pauseTrap: function pauseTrap(trapStack) {
		var activeTrap = activeFocusTraps.getActiveTrap(trapStack);
		activeTrap === null || activeTrap === void 0 || activeTrap._setPausedState(true);
	},
	unpauseTrap: function unpauseTrap(trapStack) {
		var activeTrap = activeFocusTraps.getActiveTrap(trapStack);
		if (activeTrap && !activeTrap._isManuallyPaused()) activeTrap._setPausedState(false);
	}
};
var isSelectableInput = function isSelectableInput(node) {
	return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
};
var isEscapeEvent = function isEscapeEvent(e) {
	return (e === null || e === void 0 ? void 0 : e.key) === "Escape" || (e === null || e === void 0 ? void 0 : e.key) === "Esc" || (e === null || e === void 0 ? void 0 : e.keyCode) === 27;
};
var isTabEvent = function isTabEvent(e) {
	return (e === null || e === void 0 ? void 0 : e.key) === "Tab" || (e === null || e === void 0 ? void 0 : e.keyCode) === 9;
};
var isKeyForward = function isKeyForward(e) {
	return isTabEvent(e) && !e.shiftKey;
};
var isKeyBackward = function isKeyBackward(e) {
	return isTabEvent(e) && e.shiftKey;
};
var delay = function delay(fn) {
	return setTimeout(fn, 0);
};
/**
* Get an option's value when it could be a plain value, or a handler that provides
*  the value.
* @param {*} value Option's value to check.
* @param {...*} [params] Any parameters to pass to the handler, if `value` is a function.
* @returns {*} The `value`, or the handler's returned value.
*/
var valueOrHandler = function valueOrHandler(value) {
	for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) params[_key - 1] = arguments[_key];
	return typeof value === "function" ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget(event) {
	return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
};
var internalTrapStack = [];
var createFocusTrap = function createFocusTrap(elements, userOptions) {
	var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
	var trapStack = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.trapStack) || internalTrapStack;
	var config = _objectSpread2({
		returnFocusOnDeactivate: true,
		escapeDeactivates: true,
		delayInitialFocus: true,
		delayReturnFocus: true,
		isolateSubtrees: false,
		isKeyForward,
		isKeyBackward
	}, userOptions);
	var state = {
		/** @type {Array<HTMLElement>} */
		containers: [],
		/** @type {Array<{
		*    container: HTMLElement,
		*    tabbableNodes: Array<HTMLElement>, // empty if none
		*    focusableNodes: Array<HTMLElement>, // empty if none
		*    posTabIndexesFound: boolean,
		*    firstTabbableNode: HTMLElement|undefined,
		*    lastTabbableNode: HTMLElement|undefined,
		*    firstDomTabbableNode: HTMLElement|undefined,
		*    lastDomTabbableNode: HTMLElement|undefined,
		*    nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
		*  }>}
		*/
		containerGroups: [],
		tabbableGroups: [],
		/** @type {Set<HTMLElement>} */
		adjacentElements: /* @__PURE__ */ new Set(),
		/** @type {Set<HTMLElement>} */
		alreadySilent: /* @__PURE__ */ new Set(),
		nodeFocusedBeforeActivation: null,
		mostRecentlyFocusedNode: null,
		active: false,
		paused: false,
		manuallyPaused: false,
		delayInitialFocusTimer: void 0,
		recentNavEvent: void 0
	};
	var trap;
	/**
	* Gets a configuration option value.
	* @param {Object|undefined} configOverrideOptions If true, and option is defined in this set,
	*  value will be taken from this object. Otherwise, value will be taken from base configuration.
	* @param {string} optionName Name of the option whose value is sought.
	* @param {string|undefined} [configOptionName] Name of option to use __instead of__ `optionName`
	*  IIF `configOverrideOptions` is not defined. Otherwise, `optionName` is used.
	*/
	var getOption = function getOption(configOverrideOptions, optionName, configOptionName) {
		return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
	};
	/**
	* Finds the index of the container that contains the element.
	* @param {HTMLElement} element
	* @param {Event} [event] If available, and `element` isn't directly found in any container,
	*  the event's composed path is used to see if includes any known trap containers in the
	*  case where the element is inside a Shadow DOM.
	* @returns {number} Index of the container in either `state.containers` or
	*  `state.containerGroups` (the order/length of these lists are the same); -1
	*  if the element isn't found.
	*/
	var findContainerIndex = function findContainerIndex(element, event) {
		var composedPath = typeof (event === null || event === void 0 ? void 0 : event.composedPath) === "function" ? event.composedPath() : void 0;
		return state.containerGroups.findIndex(function(_ref) {
			var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
			return container.contains(element) || (composedPath === null || composedPath === void 0 ? void 0 : composedPath.includes(container)) || tabbableNodes.find(function(node) {
				return node === element;
			});
		});
	};
	/**
	* Gets the node for the given option, which is expected to be an option that
	*  can be either a DOM node, a string that is a selector to get a node, `false`
	*  (if a node is explicitly NOT given), or a function that returns any of these
	*  values.
	* @param {string} optionName
	* @param {Object} options
	* @param {boolean} [options.hasFallback] True if the option could be a selector string
	*  and the option allows for a fallback scenario in the case where the selector is
	*  valid but does not match a node (i.e. the queried node doesn't exist in the DOM).
	* @param {Array} [options.params] Params to pass to the option if it's a function.
	* @returns {undefined | null | false | HTMLElement | SVGElement} Returns
	*  `undefined` if the option is not specified; `null` if the option didn't resolve
	*  to a node but `options.hasFallback=true`, `false` if the option resolved to `false`
	*  (node explicitly not given); otherwise, the resolved DOM node.
	* @throws {Error} If the option is set, not `false`, and is not, or does not
	*  resolve to a node, unless the option is a selector string and `options.hasFallback=true`.
	*/
	var getNodeForOption = function getNodeForOption(optionName) {
		var _ref2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref2$hasFallback = _ref2.hasFallback, hasFallback = _ref2$hasFallback === void 0 ? false : _ref2$hasFallback, _ref2$params = _ref2.params, params = _ref2$params === void 0 ? [] : _ref2$params;
		var optionValue = config[optionName];
		if (typeof optionValue === "function") optionValue = optionValue.apply(void 0, _toConsumableArray(params));
		if (optionValue === true) optionValue = void 0;
		if (!optionValue) {
			if (optionValue === void 0 || optionValue === false) return optionValue;
			throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
		}
		var node = optionValue;
		if (typeof optionValue === "string") {
			try {
				node = doc.querySelector(optionValue);
			} catch (err) {
				throw new Error("`".concat(optionName, "` appears to be an invalid selector; error=\"").concat(err.message, "\""));
			}
			if (!node) {
				if (!hasFallback) throw new Error("`".concat(optionName, "` as selector refers to no known node"));
			}
		}
		return node;
	};
	/**
	* Gets the current activeElement. If it's a web-component and has open shadow-root
	* it will recursively search inside shadow roots for the "true" activeElement.
	*
	* @param {Document | ShadowRoot} el
	*
	* @returns {HTMLElement|null} The element that currently has the focus. `null` if a focused element isn't found.
	**/
	var _getActiveElement = function getActiveElement(el) {
		var activeElement = el.activeElement;
		if (!activeElement) return null;
		if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) return _getActiveElement(activeElement.shadowRoot);
		return activeElement;
	};
	var getInitialFocusNode = function getInitialFocusNode() {
		var node = getNodeForOption("initialFocus", { hasFallback: true });
		if (node === false) return false;
		if (node === void 0 || node && !isFocusable(node, config.tabbableOptions)) {
			var activeElement = _getActiveElement(doc);
			if (findContainerIndex(activeElement) >= 0) node = activeElement;
			else {
				var firstTabbableGroup = state.tabbableGroups[0];
				node = firstTabbableGroup && firstTabbableGroup.firstTabbableNode || getNodeForOption("fallbackFocus");
			}
		} else if (node === null) node = getNodeForOption("fallbackFocus");
		if (!node) throw new Error("Your focus-trap needs to have at least one focusable element");
		return node;
	};
	var updateTabbableNodes = function updateTabbableNodes() {
		state.containerGroups = state.containers.map(function(container) {
			var tabbableNodes = tabbable(container, config.tabbableOptions);
			var focusableNodes = focusable(container, config.tabbableOptions);
			var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : void 0;
			var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : void 0;
			var firstDomTabbableNode = focusableNodes.find(function(node) {
				return isTabbable(node);
			});
			var lastDomTabbableNode = focusableNodes.slice().reverse().find(function(node) {
				return isTabbable(node);
			});
			return {
				container,
				tabbableNodes,
				focusableNodes,
				/** True if at least one node with positive `tabindex` was found in this container. */
				posTabIndexesFound: !!tabbableNodes.find(function(node) {
					return getTabIndex(node) > 0;
				}),
				/** First tabbable node in container, __tabindex__ order; `undefined` if none. */
				firstTabbableNode,
				/** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
				lastTabbableNode,
				/** First tabbable node in container, __DOM__ order; `undefined` if none. */
				firstDomTabbableNode,
				/** Last tabbable node in container, __DOM__ order; `undefined` if none. */
				lastDomTabbableNode,
				/**
				* Finds the __tabbable__ node that follows the given node in the specified direction,
				*  in this container, if any.
				* @param {HTMLElement} node
				* @param {boolean} [forward] True if going in forward tab order; false if going
				*  in reverse.
				* @returns {HTMLElement|undefined} The next tabbable node, if any.
				*/
				nextTabbableNode: function nextTabbableNode(node) {
					var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
					var nodeIdx = tabbableNodes.indexOf(node);
					if (nodeIdx < 0) {
						if (forward) return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function(el) {
							return isTabbable(el);
						});
						return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function(el) {
							return isTabbable(el);
						});
					}
					return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
				}
			};
		});
		state.tabbableGroups = state.containerGroups.filter(function(group) {
			return group.tabbableNodes.length > 0;
		});
		if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
		if (state.containerGroups.find(function(g) {
			return g.posTabIndexesFound;
		}) && state.containerGroups.length > 1) throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
	};
	var _tryFocus = function tryFocus(node) {
		if (node === false) return;
		if (node === _getActiveElement(document)) return;
		if (!node || !node.focus) {
			_tryFocus(getInitialFocusNode());
			return;
		}
		node.focus({ preventScroll: !!config.preventScroll });
		state.mostRecentlyFocusedNode = node;
		if (isSelectableInput(node)) node.select();
	};
	var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
		var node = getNodeForOption("setReturnFocus", { params: [previousActiveElement] });
		return node ? node : node === false ? false : previousActiveElement;
	};
	/**
	* Finds the next node (in either direction) where focus should move according to a
	*  keyboard focus-in event.
	* @param {Object} params
	* @param {Node} [params.target] Known target __from which__ to navigate, if any.
	* @param {KeyboardEvent|FocusEvent} [params.event] Event to use if `target` isn't known (event
	*  will be used to determine the `target`). Ignored if `target` is specified.
	* @param {boolean} [params.isBackward] True if focus should move backward.
	* @returns {Node|undefined} The next node, or `undefined` if a next node couldn't be
	*  determined given the current state of the trap.
	*/
	var findNextNavNode = function findNextNavNode(_ref3) {
		var target = _ref3.target, event = _ref3.event, _ref3$isBackward = _ref3.isBackward, isBackward = _ref3$isBackward === void 0 ? false : _ref3$isBackward;
		target = target || getActualTarget(event);
		updateTabbableNodes();
		var destinationNode = null;
		if (state.tabbableGroups.length > 0) {
			var containerIndex = findContainerIndex(target, event);
			var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
			if (containerIndex < 0) {
				if (isBackward) destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
				else destinationNode = state.tabbableGroups[0].firstTabbableNode;
			} else if (isBackward) {
				var startOfGroupIndex = state.tabbableGroups.findIndex(function(_ref4) {
					var firstTabbableNode = _ref4.firstTabbableNode;
					return target === firstTabbableNode;
				});
				if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) startOfGroupIndex = containerIndex;
				if (startOfGroupIndex >= 0) {
					var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
					var destinationGroup = state.tabbableGroups[destinationGroupIndex];
					destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
				} else if (!isTabEvent(event)) destinationNode = containerGroup.nextTabbableNode(target, false);
			} else {
				var lastOfGroupIndex = state.tabbableGroups.findIndex(function(_ref5) {
					var lastTabbableNode = _ref5.lastTabbableNode;
					return target === lastTabbableNode;
				});
				if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) lastOfGroupIndex = containerIndex;
				if (lastOfGroupIndex >= 0) {
					var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
					var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
					destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
				} else if (!isTabEvent(event)) destinationNode = containerGroup.nextTabbableNode(target);
			}
		} else destinationNode = getNodeForOption("fallbackFocus");
		return destinationNode;
	};
	var checkPointerDown = function checkPointerDown(e) {
		if (findContainerIndex(getActualTarget(e), e) >= 0) return;
		if (valueOrHandler(config.clickOutsideDeactivates, e)) {
			trap.deactivate({ returnFocus: config.returnFocusOnDeactivate });
			return;
		}
		if (valueOrHandler(config.allowOutsideClick, e)) return;
		e.preventDefault();
	};
	var checkFocusIn = function checkFocusIn(event) {
		var target = getActualTarget(event);
		var targetContained = findContainerIndex(target, event) >= 0;
		if (targetContained || target instanceof Document) {
			if (targetContained) state.mostRecentlyFocusedNode = target;
		} else {
			event.stopImmediatePropagation();
			var nextNode;
			var navAcrossContainers = true;
			if (state.mostRecentlyFocusedNode) {
				if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
					var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
					var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
					if (tabbableNodes.length > 0) {
						var mruTabIdx = tabbableNodes.findIndex(function(node) {
							return node === state.mostRecentlyFocusedNode;
						});
						if (mruTabIdx >= 0) {
							if (config.isKeyForward(state.recentNavEvent)) {
								if (mruTabIdx + 1 < tabbableNodes.length) {
									nextNode = tabbableNodes[mruTabIdx + 1];
									navAcrossContainers = false;
								}
							} else if (mruTabIdx - 1 >= 0) {
								nextNode = tabbableNodes[mruTabIdx - 1];
								navAcrossContainers = false;
							}
						}
					}
				} else if (!state.containerGroups.some(function(g) {
					return g.tabbableNodes.some(function(n) {
						return getTabIndex(n) > 0;
					});
				})) navAcrossContainers = false;
			} else navAcrossContainers = false;
			if (navAcrossContainers) nextNode = findNextNavNode({
				target: state.mostRecentlyFocusedNode,
				isBackward: config.isKeyBackward(state.recentNavEvent)
			});
			if (nextNode) _tryFocus(nextNode);
			else _tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
		}
		state.recentNavEvent = void 0;
	};
	var checkKeyNav = function checkKeyNav(event) {
		var isBackward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
		state.recentNavEvent = event;
		var destinationNode = findNextNavNode({
			event,
			isBackward
		});
		if (destinationNode) {
			if (isTabEvent(event)) event.preventDefault();
			_tryFocus(destinationNode);
		}
	};
	var checkTabKey = function checkTabKey(event) {
		if (config.isKeyForward(event) || config.isKeyBackward(event)) checkKeyNav(event, config.isKeyBackward(event));
	};
	var checkEscapeKey = function checkEscapeKey(event) {
		if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
			event.preventDefault();
			trap.deactivate();
		}
	};
	var checkClick = function checkClick(e) {
		if (findContainerIndex(getActualTarget(e), e) >= 0) return;
		if (valueOrHandler(config.clickOutsideDeactivates, e)) return;
		if (valueOrHandler(config.allowOutsideClick, e)) return;
		e.preventDefault();
		e.stopImmediatePropagation();
	};
	/**
	* Adds listeners to the document necessary for trapping focus and attempts to set focus
	*  to the configured initial focus node. Does nothing if the trap isn't active.
	* @returns {Promise<void> | undefined} A promise resolved once the initial focus node has
	*  been focused when `delayInitialFocus=true`; `undefined` when focus is set synchronously
	*  or the trap isn't active.
	*/
	var addListeners = function addListeners() {
		if (!state.active) return;
		activeFocusTraps.activateTrap(trapStack, trap);
		/** @type {Promise<void> | undefined} */
		var promise;
		if (config.delayInitialFocus) promise = new Promise(function(resolve) {
			state.delayInitialFocusTimer = delay(function() {
				_tryFocus(getInitialFocusNode());
				resolve();
			});
		});
		else _tryFocus(getInitialFocusNode());
		doc.addEventListener("focusin", checkFocusIn, true);
		doc.addEventListener("mousedown", checkPointerDown, {
			capture: true,
			passive: false
		});
		doc.addEventListener("touchstart", checkPointerDown, {
			capture: true,
			passive: false
		});
		doc.addEventListener("click", checkClick, {
			capture: true,
			passive: false
		});
		doc.addEventListener("keydown", checkTabKey, {
			capture: true,
			passive: false
		});
		doc.addEventListener("keydown", checkEscapeKey);
		return promise;
	};
	/**
	* Traverses up the DOM from each of `containers`, collecting references to
	* the elements that are siblings to `container` or an ancestor of `container`.
	* @param {Array<HTMLElement>} containers
	*/
	var collectAdjacentElements = function collectAdjacentElements(containers) {
		if (state.active && !state.paused) trap._setSubtreeIsolation(false);
		state.adjacentElements.clear();
		state.alreadySilent.clear();
		var containerAncestors = /* @__PURE__ */ new Set();
		var adjacentElements = /* @__PURE__ */ new Set();
		var _iterator = _createForOfIteratorHelper(containers), _step;
		try {
			for (_iterator.s(); !(_step = _iterator.n()).done;) {
				var container = _step.value;
				containerAncestors.add(container);
				var insideShadowRoot = typeof ShadowRoot !== "undefined" && container.getRootNode() instanceof ShadowRoot;
				var current = container;
				while (current) {
					containerAncestors.add(current);
					var parent = current.parentElement;
					var siblings = [];
					if (parent) siblings = parent.children;
					else if (!parent && insideShadowRoot) {
						siblings = current.getRootNode().children;
						parent = current.getRootNode().host;
						insideShadowRoot = typeof ShadowRoot !== "undefined" && parent.getRootNode() instanceof ShadowRoot;
					}
					var _iterator2 = _createForOfIteratorHelper(siblings), _step2;
					try {
						for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
							var child = _step2.value;
							adjacentElements.add(child);
						}
					} catch (err) {
						_iterator2.e(err);
					} finally {
						_iterator2.f();
					}
					current = parent;
				}
			}
		} catch (err) {
			_iterator.e(err);
		} finally {
			_iterator.f();
		}
		containerAncestors.forEach(function(el) {
			adjacentElements["delete"](el);
		});
		state.adjacentElements = adjacentElements;
	};
	var removeListeners = function removeListeners() {
		if (!state.active) return;
		doc.removeEventListener("focusin", checkFocusIn, true);
		doc.removeEventListener("mousedown", checkPointerDown, true);
		doc.removeEventListener("touchstart", checkPointerDown, true);
		doc.removeEventListener("click", checkClick, true);
		doc.removeEventListener("keydown", checkTabKey, true);
		doc.removeEventListener("keydown", checkEscapeKey);
		return trap;
	};
	var mutationObserver = typeof window !== "undefined" && "MutationObserver" in window ? new MutationObserver(function checkDomRemoval(mutations) {
		var focusedNode = state.mostRecentlyFocusedNode;
		if (!focusedNode) return;
		if (mutations.some(function(mutation) {
			return Array.from(mutation.removedNodes).some(function(node) {
				return node === focusedNode || typeof node.contains === "function" && node.contains(focusedNode);
			});
		}) && state.containers.some(function(container) {
			return container === null || container === void 0 ? void 0 : container.isConnected;
		})) {
			updateTabbableNodes();
			_tryFocus(getInitialFocusNode());
		}
	}) : void 0;
	var updateObservedNodes = function updateObservedNodes() {
		if (!mutationObserver) return;
		mutationObserver.disconnect();
		if (state.active && !state.paused) state.containers.map(function(container) {
			mutationObserver.observe(container, {
				subtree: true,
				childList: true
			});
		});
	};
	trap = {
		get active() {
			return state.active;
		},
		get paused() {
			return state.paused;
		},
		activate: function activate(activateOptions) {
			if (state.active) return this;
			var onActivate = getOption(activateOptions, "onActivate");
			var onPostActivate = getOption(activateOptions, "onPostActivate");
			var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
			var preexistingTrap = activeFocusTraps.getActiveTrap(trapStack);
			var revertState = false;
			if (preexistingTrap && !preexistingTrap.paused) {
				var _preexistingTrap$_set;
				(_preexistingTrap$_set = preexistingTrap._setSubtreeIsolation) === null || _preexistingTrap$_set === void 0 || _preexistingTrap$_set.call(preexistingTrap, false);
				revertState = true;
			}
			try {
				if (!checkCanFocusTrap) updateTabbableNodes();
				state.active = true;
				state.paused = false;
				state.nodeFocusedBeforeActivation = _getActiveElement(doc);
				onActivate === null || onActivate === void 0 || onActivate({ trap });
				var finishActivation = function finishActivation() {
					if (checkCanFocusTrap) updateTabbableNodes();
					var afterListeners = function afterListeners() {
						trap._setSubtreeIsolation(true);
						updateObservedNodes();
						onPostActivate === null || onPostActivate === void 0 || onPostActivate({ trap });
					};
					var listenersPromise = addListeners();
					if (listenersPromise) listenersPromise.then(afterListeners);
					else afterListeners();
				};
				if (checkCanFocusTrap) {
					checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
					return this;
				}
				finishActivation();
			} catch (error) {
				if (preexistingTrap === activeFocusTraps.getActiveTrap(trapStack) && revertState) {
					var _preexistingTrap$_set2;
					(_preexistingTrap$_set2 = preexistingTrap._setSubtreeIsolation) === null || _preexistingTrap$_set2 === void 0 || _preexistingTrap$_set2.call(preexistingTrap, true);
				}
				throw error;
			}
			return this;
		},
		deactivate: function deactivate(deactivateOptions) {
			if (!state.active) return this;
			var options = _objectSpread2({
				onDeactivate: config.onDeactivate,
				onPostDeactivate: config.onPostDeactivate,
				checkCanReturnFocus: config.checkCanReturnFocus
			}, deactivateOptions);
			clearTimeout(state.delayInitialFocusTimer);
			state.delayInitialFocusTimer = void 0;
			if (!state.paused) trap._setSubtreeIsolation(false);
			state.alreadySilent.clear();
			removeListeners();
			state.active = false;
			state.paused = false;
			updateObservedNodes();
			activeFocusTraps.deactivateTrap(trapStack, trap);
			var onDeactivate = getOption(options, "onDeactivate");
			var onPostDeactivate = getOption(options, "onPostDeactivate");
			var checkCanReturnFocus = getOption(options, "checkCanReturnFocus");
			var delayReturnFocus = getOption(options, "delayReturnFocus");
			var returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
			onDeactivate === null || onDeactivate === void 0 || onDeactivate({ trap });
			var completeDeactivation = function completeDeactivation() {
				if (returnFocus) _tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
				onPostDeactivate === null || onPostDeactivate === void 0 || onPostDeactivate({ trap });
			};
			var finishDeactivation = function finishDeactivation() {
				if (delayReturnFocus && returnFocus) delay(completeDeactivation);
				else completeDeactivation();
			};
			if (returnFocus && checkCanReturnFocus) {
				checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
				return this;
			}
			finishDeactivation();
			return this;
		},
		pause: function pause(pauseOptions) {
			if (!state.active) return this;
			state.manuallyPaused = true;
			return this._setPausedState(true, pauseOptions);
		},
		unpause: function unpause(unpauseOptions) {
			if (!state.active) return this;
			state.manuallyPaused = false;
			if (trapStack[trapStack.length - 1] !== this) return this;
			return this._setPausedState(false, unpauseOptions);
		},
		updateContainerElements: function updateContainerElements(containerElements) {
			state.containers = [].concat(containerElements).filter(Boolean).map(function(element) {
				return typeof element === "string" ? doc.querySelector(element) : element;
			});
			if (config.isolateSubtrees) collectAdjacentElements(state.containers);
			if (state.active) {
				updateTabbableNodes();
				if (!state.paused) trap._setSubtreeIsolation(true);
			}
			updateObservedNodes();
			return this;
		}
	};
	Object.defineProperties(trap, {
		_isManuallyPaused: { value: function value() {
			return state.manuallyPaused;
		} },
		_setPausedState: { value: function value(paused, options) {
			if (state.paused === paused) return this;
			state.paused = paused;
			if (paused) {
				var onPause = getOption(options, "onPause");
				var onPostPause = getOption(options, "onPostPause");
				onPause === null || onPause === void 0 || onPause({ trap });
				removeListeners();
				trap._setSubtreeIsolation(false);
				updateObservedNodes();
				onPostPause === null || onPostPause === void 0 || onPostPause({ trap });
			} else {
				var onUnpause = getOption(options, "onUnpause");
				var onPostUnpause = getOption(options, "onPostUnpause");
				onUnpause === null || onUnpause === void 0 || onUnpause({ trap });
				(function finishUnpause() {
					updateTabbableNodes();
					var afterListeners = function afterListeners() {
						trap._setSubtreeIsolation(true);
						updateObservedNodes();
						onPostUnpause === null || onPostUnpause === void 0 || onPostUnpause({ trap });
					};
					var listenersPromise = addListeners();
					if (listenersPromise) listenersPromise.then(afterListeners);
					else afterListeners();
				})();
			}
			return this;
		} },
		_setSubtreeIsolation: { value: function value(isEnabled) {
			if (config.isolateSubtrees) state.adjacentElements.forEach(function(el) {
				var _el$getAttribute;
				if (isEnabled) switch (config.isolateSubtrees) {
					case "aria-hidden":
						if (el.ariaHidden === "true" || ((_el$getAttribute = el.getAttribute("aria-hidden")) === null || _el$getAttribute === void 0 ? void 0 : _el$getAttribute.toLowerCase()) === "true") state.alreadySilent.add(el);
						el.setAttribute("aria-hidden", "true");
						break;
					default:
						if (el.inert || el.hasAttribute("inert")) state.alreadySilent.add(el);
						el.setAttribute("inert", true);
				}
				else if (state.alreadySilent.has(el));
				else switch (config.isolateSubtrees) {
					case "aria-hidden":
						el.removeAttribute("aria-hidden");
						break;
					default: el.removeAttribute("inert");
				}
			});
		} }
	});
	trap.updateContainerElements(elements);
	return trap;
};
//#endregion
//#region node_modules/@vueuse/integrations/dist/useFocusTrap.js
/**
* Reactive focus-trap
*
* @see https://vueuse.org/useFocusTrap
*/
function useFocusTrap(target, options = {}) {
	let trap;
	const { immediate, ...focusTrapOptions } = options;
	const hasFocus = shallowRef(false);
	const isPaused = shallowRef(false);
	const activate = (opts) => trap && trap.activate(opts);
	const deactivate = (opts) => trap && trap.deactivate(opts);
	const pause = () => {
		if (trap) {
			trap.pause();
			isPaused.value = true;
		}
	};
	const unpause = () => {
		if (trap) {
			trap.unpause();
			isPaused.value = false;
		}
	};
	watch(computed(() => {
		return toArray(toValue(target)).map((el) => {
			const _el = toValue(el);
			return typeof _el === "string" ? _el : unrefElement(_el);
		}).filter(notNullish);
	}), (els) => {
		if (!els.length) return;
		if (!trap) {
			trap = createFocusTrap(els, {
				...focusTrapOptions,
				onActivate(params) {
					hasFocus.value = true;
					if (options.onActivate) options.onActivate(params);
				},
				onDeactivate(params) {
					hasFocus.value = false;
					if (options.onDeactivate) options.onDeactivate(params);
				}
			});
			if (immediate) activate();
		} else {
			const isActive = trap === null || trap === void 0 ? void 0 : trap.active;
			trap === null || trap === void 0 || trap.updateContainerElements(els);
			if (!isActive && immediate) activate();
		}
	}, { flush: "post" });
	tryOnScopeDispose(() => deactivate());
	return {
		hasFocus,
		isPaused,
		activate,
		deactivate,
		pause,
		unpause
	};
}
//#endregion
export { useFocusTrap };
