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

namespace Tablesorter;

class Plugin
{
    public function run()
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
     * @return bool
     */
    protected function isAdministrationRequested()
    {
        global $tablesorter;
        
        return function_exists('XH_wantsPluginAdministration')
            && XH_wantsPluginAdministration('tablesorter')
            || isset($tablesorter) && $tablesorter == 'true';
    }

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
     * @return string
     */
    protected function renderVersion()
    {
        global $pth, $plugin_tx;

        return '<h1>Tablesorter</h1>'
            . tag(
                'img class="tablesorter_logo" src="' . $pth['folder']['plugins']
                . 'tablesorter/tablesorter.png" alt="' . $plugin_tx['tablesorter']['alt_logo'] . '"'
            )
            . '<p style="margin-top: 1em">Version: ' . TABLESORTER_VERSION . '</p>'
            . '<p>Copyright &copy; 2012-2017 Christoph M. Becker</p>'
            . '<p class="tablesorter_license">'
            . 'Tablesorter_XH is free software: you can redistribute it and/or modify'
            . ' it under the terms of the GNU General Public License as published by'
            . ' the Free Software Foundation, either version 3 of the License, or'
            . ' (at your option) any later version.</p>'
            . '<p class="tablesorter_license">'
            . 'Tablesorter_XH is distributed in the hope that it will be useful,'
            . ' but <em>without any warranty</em>; without even the implied warranty of'
            . ' <em>merchantability</em> or <em>fitness for a particular purpose</em>.  See the'
            . ' GNU General Public License for more details.</p>'
            . '<p class="tablesorter_license">'
            . 'You should have received a copy of the GNU General Public License'
            . ' along with Tablesorter_XH.  If not, see'
            . ' <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/'
            . '</a>.</p>';
    }

    /**
     * @return string
     */
    protected function renderSystemCheck()
    {
        global $pth, $plugin_tx;
    
        $phpVersion =  '5.3.0';
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
        foreach (array('config/', 'css/', 'languages/') as $folder) {
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
