<?php

/**
 * Tablesorter_XH entry point.
 *
 * PHP version 5
 *
 * @category  CMSimple_XH
 * @package   Tablesorter
 * @author    Christoph M. Becker <cmbecker69@gmx.de>
 * @copyright 2012-2017 Christoph M. Becker <http://3-magi.net/>
 * @license   http://www.gnu.org/licenses/gpl-3.0.en.html GNU GPLv3
 * @link      http://3-magi.net/?CMSimple_XH/Tablesorter_XH
 */

/**
 * The plugin version.
 */
define('TABLESORTER_VERSION', '@TABLESORTER_VERSION@');

/**
 * Makes all <table class="tablesorter"> sortable.
 *
 * @return void
 *
 * @global string The (X)HTML fragment to insert into the head element.
 * @global array  The paths of system files and folders.
 * @global array  The configuration of the plugins.
 *
 * @staticvar bool $again Whether the function has already been executed.
 */
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
 * Returns the available themes.
 *
 * @return array
 *
 * @global array The paths of system files and folders.
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

$temp = new Tablesorter_Controller();
$temp->dispatch();

?>
