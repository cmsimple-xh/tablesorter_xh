<?php

/**
 * The autoloader.
 *
 * PHP version 5
 *
 * @category  CMSimple_XH
 * @package   Tablesorter
 * @author    Christoph M. Becker <cmbecker69@gmx.de>
 * @copyright 2014-2017 Christoph M. Becker <http://3-magi.net/>
 * @license   http://www.gnu.org/licenses/gpl-3.0.en.html GNU GPLv3
 * @link      http://3-magi.net/?CMSimple_XH/Tablesorter_XH
 */

namespace Tablesorter;

spl_autoload_register(function ($class) {
    $parts = explode('\\', $class, 2);
    if ($parts[0] == 'Tablesorter') {
        include_once __DIR__ . '/' . $parts[1] . '.php';
    }
});

?>
