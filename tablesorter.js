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

    function range (start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
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
        var newClassName = element.className.replace(/(?:^|\s)tablesorter_(?:asc|desc|ascdesc)(?!\S)/, "");
        if (newClassName !== "") {
            newClassName += " ";
        }
        newClassName += className;
        element.className = newClassName;
    }

    function setTextContent(element, content) {
        if (typeof element.textContent !== "undefined") {
            element.textContent = content;
        } else {
            element.innerText = content;
        }
    }

    function getViewportWidth() {
        if (typeof window.innerWidth !== "undefined") {
            return window.innerWidth;
        } else if (document.compatMode === "CSS1Compat") {
            return document.documentElement.clientWidth;
        } else {
            document.body.clientWidth;
        }
    }

    function ready(handler) {
        if (typeof document.addEventListener !== "undefined") {
            document.addEventListener("DOMContentLoaded", handler, false);
        } else if (typeof document.attachEvent !== "undefined") {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState === "complete") {
                    handler.call(document);
                }
            });
        }
    }

    var currentPage = 0;

    function paginate(table) {
        each(find(".tablesorter_detail", table), function (row) {
            row.parentNode.removeChild(row);
        });
        each(find(".tablesorter_collapse", table), function (button) {
            button.className = "tablesorter_expand";
            setTextContent(button, TABLESORTER.show);
        });
        var rows = table.tBodies[0].rows;
        var pageCount = Math.ceil(rows.length / TABLESORTER.maxPages);
        var start = currentPage * TABLESORTER.maxPages;
        var end = (currentPage + 1) * TABLESORTER.maxPages - 1;
        each(rows, function (row, index) {
            if (index >= start && index <= end) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
        if (pageCount > 1) {
            var pagination = document.createElement("div");
            pagination.className = "tablesorter_pagination";
            each(range(0, pageCount - 1), function (index) {
                var button = document.createElement("button");
                setTextContent(button, index + 1);
                if (index === currentPage) {
                    button.disabled = true;
                }
                button.onclick = (function () {
                    currentPage = index;
                    paginate(table);
                });
                pagination.appendChild(button);
            });
            if (hasClass(table.nextSibling, "tablesorter_pagination")) {
                table.parentNode.removeChild(table.nextSibling);
            }
            table.parentNode.insertBefore(pagination, table.nextSibling);
        }
    }

    ready(function () {
        var sort = (function (table, column, desc, numeric) {
            var tbody = table.tBodies[0];
            var rows = [];
            each(tbody.rows, function (tr) {
                var td = tr.getElementsByTagName("td")[column];
                var value = td.textContent || td.innerText;
                value = numeric ? +value : value.toLowerCase();
                rows.push({
                    value: value,
                    element: tr
                });
            });
            rows = rows.sort(function (a, b) {
                var order = desc ? -1 : 1;
                if (numeric) {
                    return (a.value - b.value) * order;
                } else {
                    return a.value.localeCompare(b.value) * order;
                }
            });
            each(rows, function (value) {
                tbody.appendChild(value.element);
            });
        });

        var headings = find(".tablesorter thead th");
        var hiddenColumns = [];
        var viewportWidth = getViewportWidth();
        var breakpoints = ({
            "tablesorter_large": 1200,
            "tablesorter_medium": 992,
            "tablesorter_small": 768,
            "tablesorter_x_small": 480
        });
        var classesToHide = [];
        for (var prop in breakpoints) {
            if (breakpoints.hasOwnProperty(prop) && viewportWidth < breakpoints[prop]) {
                classesToHide.push(prop);
            }
        }
        each(headings, function (heading, index) {
            if (hasClass(heading, "tablesorter_hide")) {
                hiddenColumns.push(index);
            } else {
                var alreadyHidden = false;
                each(classesToHide, function (className) {
                    if (!alreadyHidden && hasClass(heading, className)) {
                        hiddenColumns.push(index);
                        alreadyHidden = true;
                    }
                });
            }
            if (!TABLESORTER.sortable) {
                return;
            }
            var button = document.createElement("button");
            while (heading.firstChild) {
                button.appendChild(heading.firstChild);
            }
            heading.appendChild(button);
            setClass(heading.firstChild, "tablesorter_ascdesc");
            heading.firstChild.onclick = (function () {
                var table = heading;
                while (table.nodeName.toLowerCase() !== "table") {
                    table = table.parentNode;
                }
                each(find(".tablesorter_detail", table), function (row) {
                    row.parentNode.removeChild(row);
                });
                each(find(".tablesorter_collapse", table), function (button) {
                    button.className = "tablesorter_expand";
                    setTextContent(button, TABLESORTER.show);
                });
                each(headings, function (heading2) {
                    if (heading2.firstChild !== heading.firstChild) {
                        setClass(heading2.firstChild, "tablesorter_ascdesc");
                    }
                });
                if (hasClass(heading.firstChild, "tablesorter_asc")) {
                    setClass(heading.firstChild, "tablesorter_desc");
                    sort(table, index, true, hasClass(heading, "tablesorter_numeric"));
                } else {
                    setClass(heading.firstChild, "tablesorter_asc");
                    sort(table, index, false, hasClass(heading, "tablesorter_numeric"));
                }
                paginate(table);
            });
        });

        if (hiddenColumns.length) {
            each(find(".tablesorter tr"), function (row) {
                each(hiddenColumns, function (column) {
                    var cell = row.cells[column];
                    cell.style.display = "none";
                });
                row.insertCell();
                if (row.parentNode.nodeName.toLowerCase() === "tbody") {
                    var button = document.createElement("button");
                    button.className = "tablesorter_expand";
                    setTextContent(button, TABLESORTER.show);
                    button.onclick = (function () {
                        if (this.className === "tablesorter_expand") {
                            var detailRow = row.parentNode.insertRow(row.sectionRowIndex + 1);
                            detailRow.className = "tablesorter_detail";
                            var detailCell = detailRow.insertCell();
                            detailCell.colSpan = row.cells.length;
                            var defList = document.createElement("dl");
                            each(hiddenColumns, function (column) {
                                var dt = document.createElement("dt");
                                var headingElement = headings[column];
                                if (TABLESORTER.sortable) {
                                    headingElement = headingElement.firstChild;
                                }
                                dt.innerHTML = headingElement.innerHTML;
                                defList.appendChild(dt);
                                var dd = document.createElement("dd");
                                dd.innerHTML = row.cells[column].innerHTML;
                                defList.appendChild(dd);
                            });
                            detailCell.appendChild(defList);
                            this.className = "tablesorter_collapse";
                            setTextContent(this, TABLESORTER.hide);
                        } else {
                            row.parentNode.deleteRow(row.sectionRowIndex + 1);
                            this.className = "tablesorter_expand";
                            setTextContent(this, TABLESORTER.show);
                        }
                    });
                    var lastColumn = row.cells.length - 1;
                    row.cells[lastColumn].insertBefore(button, row.cells[lastColumn].firstChild);
                }
            });
        }

        each(find(".tablesorter"), paginate);
    });
}());
