<?php

/**
 * Front-end of Tablesorter_XH.
 *
 * Copyright (c) 2012-2015 Christoph M. Becker (see license.txt)
 */


if (!defined('CMSIMPLE_XH_VERSION')) {
    header('HTTP/1.0 403 Forbidden');
    exit;
}


define('TABLESORTER_VERSION', '1beta1');


/**
 * Makes all <table class="sortable"> sortable.
 *
 * @access public
 * @return void
 */
function Tablesorter()
{
    global $hjs, $pth, $plugin_cf;
    static $again = false;

    if ($again) {
        return;
    }
    $again = true;
    $pcf = $plugin_cf['tablesorter'];

    require_once $pth['folder']['plugins'] . 'jquery/jquery.inc.php';
    include_jQuery();
    include_jQueryPlugin('tablesorter', $pth['folder']['plugins']
                         . 'tablesorter/tablesorter/js/jquery.tablesorter.js');
    $theme = is_readable("{$pth['folder']['plugins']}tablesorter/tablesorter/css/theme.$pcf[theme].css")
        ? $pcf['theme']
        : 'default';
    $css = $theme == 'default'
        ? "{$pth['folder']['plugins']}tablesorter/tablesorter/css/theme.default.css"
        : "{$pth['folder']['plugins']}tablesorter/tablesorter/css/theme.$pcf[theme].css";
    $widgets = $pcf['zebra'] ? ', widgets: ["zebra"]' : '';
    $hjs .= tag('link rel="stylesheet" href="' . $css . '" type="text/css"')
        . '<script type="text/javascript">/* <![CDATA[ */jQuery(function()'
        . ' {jQuery("table.sortable").tablesorter({theme: "' . $theme
        . '", sortLocaleCompare: true' . $widgets . '})})/* ]]> */</script>';
}


/*
 * Handle auto mode.
 */
if ($plugin_cf['tablesorter']['auto']) {
    Tablesorter();
}

?>
