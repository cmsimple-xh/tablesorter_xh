<?php

/**
 * The plugin controllers.
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
 * The plugin controllers.
 *
 * @category CMSimple_XH
 * @package  Tablesorter
 * @author   Christoph M. Becker <cmbecker69@gmx.de>
 * @license  http://www.gnu.org/licenses/gpl-3.0.en.html GNU GPLv3
 * @link     http://3-magi.net/?CMSimple_XH/Tablesorter_XH
 */
class Tablesorter_Controller
{
    /**
     * Dispatches on plugin related requests.
     *
     * @return void
     *
     * @global array The configuration of the plugins.
     */
    public function dispatch()
    {
        global $plugin_cf;

        if ($plugin_cf['tablesorter']['auto']) {
            tablesorter();
        }
        if (defined('XH_ADM') && XH_ADM) {
            if (function_exists('XH_registerStandardPluginMenuItems')) {
                XH_registerStandardPluginMenuItems(false);
            }
            if ($this->isAdministrationRequested()) {
                $this->handleAdministration();
            }
        }
    }

    /**
     * Returns whether the plugin administration is requested.
     *
     * @return bool
     *
     * @global string Whether the plugin administration is requested.
     */
    protected function isAdministrationRequested()
    {
        global $tablesorter;
        
        return function_exists('XH_wantsPluginAdministration')
            && XH_wantsPluginAdministration('tablesorter')
            || isset($tablesorter) && $tablesorter == 'true';
    }

    /**
     * Handles the plugin administration.
     *
     * @return void
     *
     * @global string The value of the admin GP parameter.
     * @global string The value of the action GP parameter.
     * @global string The (X)HTML fragment to insert into the contents area.
     */
    protected function handleAdministration()
    {
        global $admin, $action, $o;

        $o .= print_plugin_admin('off');
        switch ($admin) {
        case '':
            $o .= $this->renderVersion() . tag('hr')
                . $this->renderSystemCheck();
            break;
        default:
            $o .= plugin_admin_common($action, $admin, 'tablesorter');
        }
    }

    /**
     * Returns the version information view.
     *
     * @return string (X)HTML
     *
     * @global array The paths of system files and folders.
     */
    protected function renderVersion()
    {
        global $pth;

        return '<h1><a href="http://3-magi.net/?CMSimple_XH/Tablesorter_XH">'
            . 'Tablesorter_XH</a></h1>'
            . tag(
                'img style="float:left; margin-right:10px" src="'
                . $pth['folder']['plugins']
                . 'tablesorter/tablesorter.png" alt="Plugin icon"'
            )
            . '<p style="margin-top: 1em">Version: ' . TABLESORTER_VERSION . '</p>'
            . '<p>Copyright &copy; 2012-2017 <a href="http://3-magi.net/">'
            . 'Christoph M. Becker</a></p>'
            . '<p>Tablesorter_XH is powered by the <a href="https://github.com/'
            . 'Mottie/tablesorter">jQuery tablesorter plugin</a>.</p>'
            . '<p style="text-align: justify">'
            . 'This program is free software: you can redistribute it and/or modify'
            . ' it under the terms of the GNU General Public License as published by'
            . ' the Free Software Foundation, either version 3 of the License, or'
            . ' (at your option) any later version.</p>'
            . '<p style="text-align: justify">'
            . 'This program is distributed in the hope that it will be useful,'
            . ' but WITHOUT ANY WARRANTY; without even the implied warranty of'
            . ' MERCHAN&shy;TABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the'
            . ' GNU General Public License for more details.</p>'
            . '<p style="text-align: justify">'
            . 'You should have received a copy of the GNU General Public License'
            . ' along with this program.  If not, see'
            . ' <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/'
            . '</a>.</p>';
    }

    /**
     * Returns the requirements information view.
     *
     * @return string (X)HTML
     *
     * @global array The paths of system files and folders.
     * @global array The localization of the plugins.
     */
    protected function renderSystemCheck()
    {
        global $pth, $plugin_tx;
    
        $phpVersion =  '5.1.2';
        $ptx = $plugin_tx['tablesorter'];
        $imgdir = $pth['folder']['plugins'] . 'tablesorter/images/';
        $ok = tag('img src="' . $imgdir . 'ok.png" alt="ok"');
        $warn = tag('img src="' . $imgdir . 'warn.png" alt="warning"');
        $fail = tag('img src="' . $imgdir . 'fail.png" alt="failure"');
        $o = tag('hr') . '<h4>' . $ptx['syscheck_title'] . '</h4>'
            . (version_compare(PHP_VERSION, $phpVersion) >= 0 ? $ok : $fail)
            . '&nbsp;&nbsp;'
            . sprintf($ptx['syscheck_phpversion'], $phpVersion)
            . tag('br') . tag('br');
        $o .= (!get_magic_quotes_runtime() ? $ok : $fail)
            . '&nbsp;&nbsp;' . $ptx['syscheck_magic_quotes'] . tag('br') . tag('br');
        foreach (array('config/', 'languages/') as $folder) {
            $folders[] = $pth['folder']['plugins'] . 'tablesorter/' . $folder;
        }
        foreach ($folders as $folder) {
            $o .= (is_writable($folder) ? $ok : $warn)
                . '&nbsp;&nbsp;' . sprintf($ptx['syscheck_writable'], $folder)
                . tag('br');
        }
        return $o;
    }
}

?>
