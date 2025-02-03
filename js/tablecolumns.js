/**
 * Copyright 2014-2024 Christoph M. Becker
 * Copyright 2025 CMSimple_XH developers
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

function each(items, func) {
    for (var i = 0; i < items.length; i++) {
        func(items[i], i);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    function widget(table) {
        var headings = table.tHead.getElementsByTagName("th");

        var selectionList = document.createElement("ul");
        each(headings, function (heading, index) {
            var li = document.createElement("li");
            var label = document.createElement("label");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = index;
            checkbox.checked = true;
            checkbox.onchange = (function () {
                toggleColumn(this.value);
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(heading.textContent));
            li.appendChild(label);
            selectionList.appendChild(li);
        });
        selectionList.className = "tablecolumns_selection";
        selectionList.style.display = "none";
        table.parentNode.insertBefore(selectionList, table);

        var columnsButton = document.createElement("button");
        columnsButton.className = "tablecolumns_button";
        //columnsButton.appendChild(document.createTextNode("Columns …"));
        let tstc_button = TABLECOLUMNS.tstc_button;
        columnsButton.appendChild(document.createTextNode(tstc_button));
        columnsButton.onclick = (function () {
            if (selectionList.style.display === "none") {
                selectionList.style.display = "";
            } else {
                selectionList.style.display = "none";
            }
        });
        table.parentNode.insertBefore(columnsButton, table);

        var toggleColumn = function (index) {
            var rows = table.getElementsByTagName("tr");
            each(rows, function (row) {
                var style = row.cells[index].style;
                if (style.display === "none") {
                    style.display = "";
                } else {
                    style.display = "none";
                }
            });
        };
    }

    each(document.getElementsByClassName("tablecolumns"), widget);
    console.log("asd")
});
