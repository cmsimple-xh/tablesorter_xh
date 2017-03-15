<?php

/**
 * Copyright 2012-2017 Christoph M. Becker
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

define('TABLESORTER_VERSION', '@TABLESORTER_VERSION@');

function tablesorter()
{
    global $bjs, $pth, $plugin_cf, $plugin_tx;
    static $again = false;

    if ($again) {
        return;
    }
    $again = true;
    $pcf = $plugin_cf['tablesorter'];
    $ptx = $plugin_tx['tablesorter'];
    $config = array('sortable' => (bool) $pcf['sortable'], 'show' => $ptx['label_show'], 'hide' => $ptx['label_hide']);
    $bjs .= '<script type="text/javascript">var TABLESORTER = ' . json_encode($config) . '</script>'
        . '<script type="text/javascript" src="' . $pth['folder']['plugins']
        . 'tablesorter/tablesorter.js"></script>';
}

$temp = new Tablesorter\Controller();
$temp->dispatch();
