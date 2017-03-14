/*!
 * Copyright 2014-2017 Christoph M. Becker
 *
 * This file is part of Tablesorter_XH.
 *
 * Tablesorter_XH is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Tablesorter_XH is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Tablesorter_XH.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {

    function find(selector, target) {
        target = target || document;
        if (typeof target.querySelectorAll !== "undefined") {
            return target.querySelectorAll(selector);
        } else {
            return [];
        }
    }

    function each(elements, func) {
        for (var i = 0, len = elements.length; i < len; i += 1) {
            func(elements[i], i);
        }
    }

    function on(element, type, listener) {
        if (typeof element.addEventListener !== "undefined") {
            element.addEventListener(type, listener, false);
        } else if (typeof element.attachEvent !== "undefined") {
            element.attachEvent("on" + type, listener);
        }
    }

    function hasClass(element, className) {
        return new RegExp("(^|\\b)" + className + "(\\b|$)").test(element.className);
    }

    function setClass(element, className) {
        var newClassName = element.className.replace(/(?:^|\s)tablesorter_[a-z]+(?!\S)/, "");
        if (newClassName !== "") {
            newClassName += " ";
        }
        newClassName += className;
        element.className = newClassName;
    }

    on(window, "load", function () {
        var sort = (function (table, column, desc) {
            var tbody = table.tBodies[0];
            var rows = [];
            each(tbody.rows, function (tr) {
                var td = tr.getElementsByTagName("td")[column];
                rows.push({
                    value: (td.textContent || td.innerText).toLowerCase(),
                    element: tr
                });
            });
            rows = rows.sort(function (a, b) {
                var xor = (function (a, b) {
                    return (a || b) && !(a && b);
                });
                return a.value === b.value ? 0 : xor(a.value < b.value, desc) ? -1 : 1;
            });
            each(rows, function (value) {
                tbody.appendChild(value.element);
            });
        });

        var headings = find(".tablesorter thead th");
        each(headings, function (heading, index) {
            setClass(heading, "tablesorter_ascdesc");
            on(heading, "click", function () {
                var table = heading;
                while (table.nodeName.toLowerCase() !== "table") {
                    table = table.parentNode;
                }
                each(headings, function (heading2) {
                    if (heading2 !== heading) {
                        setClass(heading2, "tablesorter_ascdesc");
                    }
                });
                if (hasClass(heading, "tablesorter_asc")) {
                    setClass(heading, "tablesorter_desc");
                    sort(table, index, true);
                } else {
                    setClass(heading, "tablesorter_asc");
                    sort(table, index, false);
                }
            });
        });
    });
}());
