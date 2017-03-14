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
    global $hjs, $pth, $plugin_cf;
    static $again = false;

    if ($again) {
        return;
    }
    $again = true;
    $pcf = $plugin_cf['tablesorter'];

    include_once $pth['folder']['plugins'] . 'jquery/jquery.inc.php';
    include_jQuery();
    include_jQueryPlugin(
        'tablesorter',
        $pth['folder']['plugins']
        . 'tablesorter/lib/js/jquery.tablesorter.min.js'
    );
    $theme = $pcf['theme'];
    $filename = $pth['folder']['plugins'] . 'tablesorter/lib/css/theme.'
        . $pcf['theme'] . '.min.css';
    if (!is_readable($filename)) {
        $theme = 'default';
        $filename = $pth['folder']['plugins']
            . 'tablesorter/lib/css/theme.default.min.css';
    }
    $widgets = $pcf['zebra'] ? ', widgets: ["zebra"]' : '';
    $hjs .= tag('link rel="stylesheet" href="' . $filename . '" type="text/css"')
        . '<script type="text/javascript">/* <![CDATA[ */jQuery(function()'
        . ' {jQuery("table.tablesorter").tablesorter({theme: "' . $theme
        . '", sortLocaleCompare: true' . $widgets . '})})/* ]]> */</script>';
}

/**
 * @return array
 */
function Tablesorter_findThemes()
{
    global $pth;

    $themes = array();
    $filename = $pth['folder']['plugins'] . 'tablesorter/lib/css';
    $files = new DirectoryIterator($filename);
    foreach ($files as $file) {
        if (preg_match('/theme\.(.*)\.min\.css$/', $file, $matches)) {
            $themes[] = $matches[1];
        }
    }
    return $themes;
}

$temp = new Tablesorter\Controller();
$temp->dispatch();
