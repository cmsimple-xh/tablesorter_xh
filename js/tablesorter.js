/**
 * Copyright 2014-2019 Christoph M. Becker
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

    if (typeof document.visibilityState === "undefined"
            || typeof document.attachEvent !== "undefined") {
        return;
    }

    function range(start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    var each = Array.prototype.forEach;

    function setClass(element, className) {
        var newClassName = element.className.replace(/(?:^|\s)tablesorter_(?:asc|desc|ascdesc)(?!\S)/, "");
        if (newClassName !== "") {
            newClassName += " ";
        }
        newClassName += className;
        element.className = newClassName;
    }

    function Widget(table) {
        var currentPage = 0;
        var hiddenColumns = [];

        function paginate() {
            each.call(table.getElementsByClassName("tablesorter_detail"), function (row) {
                row.parentNode.removeChild(row);
            });
            each.call(table.getElementsByClassName("tablesorter_collapse"), function (button) {
                button.className = "tablesorter_expand";
                button.textContent = TABLESORTER.show;
            });
            var rows = table.tBodies[0].rows;
            var pageCount = Math.ceil(rows.length / TABLESORTER.maxPages);
            var start = currentPage * TABLESORTER.maxPages;
            var end = (currentPage + 1) * TABLESORTER.maxPages - 1;
            each.call(rows, function (row, index) {
                if (index >= start && index <= end) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
            if (pageCount > 1) {
                var pagination = document.createElement("div");
                pagination.className = "tablesorter_pagination";
                each.call(range(0, pageCount - 1), function (index) {
                    var button = document.createElement("button");
                    button.textContent = index + 1;
                    if (index === currentPage) {
                        button.disabled = true;
                    }
                    button.onclick = (function () {
                        currentPage = index;
                        paginate(table);
                    });
                    pagination.appendChild(button);
                });
                if (table.nextElementSibling && table.nextElementSibling.classList.contains("tablesorter_pagination")) {
                    table.parentNode.removeChild(table.nextElementSibling);
                }
                table.parentNode.insertBefore(pagination, table.nextElementSibling);
            }
        }

        function sort(column, desc, numeric) {
            var tbody = table.tBodies[0];
            var rows = [];
            each.call(tbody.rows, function (tr) {
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
            each.call(rows, function (value) {
                tbody.appendChild(value.element);
            });
        }

        function determineHiddenColumns() {
            var result = [];
            var classesToHide = [];
            for (var prop in Widget.breakpoints) {
                if (Widget.breakpoints.hasOwnProperty(prop) && window.innerWidth < Widget.breakpoints[prop]) {
                    classesToHide.push(prop);
                }
            }
            each.call(headings, function (heading, index) {
                if (heading.classList.contains("tablesorter_hide")) {
                    result.push(index);
                } else {
                    var alreadyHidden = false;
                    each.call(classesToHide, function (className) {
                        if (!alreadyHidden && heading.classList.contains(className)) {
                            result.push(index);
                            alreadyHidden = true;
                        }
                    });
                }
            });
            return result;
        }

        function hideColumns() {
            if (hiddenColumns.length) {
                each.call(table.getElementsByTagName("tr"), function (row) {
                    each.call(hiddenColumns, function (column) {
                        var cell = row.cells[column];
                        cell.style.display = "none";
                    });
                    row.insertCell();
                    if (row.parentNode.nodeName.toLowerCase() === "tbody") {
                        var button = document.createElement("button");
                        button.className = "tablesorter_expand";
                        button.textContent = TABLESORTER.show;
                        button.onclick = (function () {
                            if (this.className === "tablesorter_expand") {
                                var detailRow = row.parentNode.insertRow(row.sectionRowIndex + 1);
                                detailRow.className = "tablesorter_detail";
                                var detailCell = detailRow.insertCell();
                                detailCell.colSpan = row.cells.length;
                                var defList = document.createElement("dl");
                                each.call(hiddenColumns, function (column) {
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
                                this.textContent = TABLESORTER.hide;
                            } else {
                                row.parentNode.deleteRow(row.sectionRowIndex + 1);
                                this.className = "tablesorter_expand";
                                this.textContent = TABLESORTER.show;
                            }
                        });
                        var lastColumn = row.cells.length - 1;
                        row.cells[lastColumn].insertBefore(button, row.cells[lastColumn].firstChild);
                    }
                });
            }
        }

        function unhideColumns() {
            if (hiddenColumns.length) {
                each.call(table.getElementsByTagName("tr"), function (row) {
                    each.call(hiddenColumns, function (column) {
                        var cell = row.cells[column];
                        cell.style.display = "";
                    });
                    row.deleteCell(row.cells.length - 1);
                });
            }
            hiddenColumns = [];
        }

        var headings = table.querySelectorAll("thead th");
        each.call(headings, function (heading, index) {
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
                each.call(table.getElementsByClassName("tablesorter_detail"), function (row) {
                    row.parentNode.removeChild(row);
                });
                each.call(table.getElementsByClassName("tablesorter_collapse"), function (button) {
                    button.className = "tablesorter_expand";
                    button.textContent = TABLESORTER.show;
                });
                each.call(headings, function (heading2) {
                    if (heading2.firstChild !== heading.firstChild) {
                        setClass(heading2.firstChild, "tablesorter_ascdesc");
                    }
                });
                if (heading.firstChild.classList.contains("tablesorter_asc")) {
                    setClass(heading.firstChild, "tablesorter_desc");
                    sort(index, true, heading.classList.contains("tablesorter_numeric"));
                } else {
                    setClass(heading.firstChild, "tablesorter_asc");
                    sort(index, false, heading.classList.contains("tablesorter_numeric"));
                }
                paginate();
            });
        });

        window.addEventListener("resize", function () {
            var newHiddenColumns;

            each.call(table.getElementsByClassName("tablesorter_detail"), function (row) {
                row.parentNode.removeChild(row);
            });
            each.call(table.getElementsByClassName("tablesorter_collapse"), function (button) {
                button.className = "tablesorter_expand";
                button.textContent = TABLESORTER.show;
            });
            newHiddenColumns = determineHiddenColumns();
            if (newHiddenColumns.length !== hiddenColumns.length) {
                unhideColumns();
                hiddenColumns = newHiddenColumns;
                hideColumns();
            }
        });
        hiddenColumns = determineHiddenColumns();
        hideColumns();
        paginate();
    }

    Widget.breakpoints = ({
        "tablesorter_large": 1200,
        "tablesorter_medium": 992,
        "tablesorter_small": 768,
        "tablesorter_x_small": 480
    });

    function init() {
        each.call(document.getElementsByClassName("tablesorter"), function (table) {
            new Widget(table);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}());
