<?php

use Illuminate\Database\Eloquent\Model;

/**
 * A abstract class to profide a identifier for a subclass.
 *
 * @author Pieter - #oSoc15
 */
abstract class Identifier extends Model {
    
    /**
     * The identifier.
     */
    private $_id;
    
    /**
     * The getter for the identifier.
     * @return the identifier
     */
    function getId() {
        return $this->_id;
    }

    /**
     * The setter for the identifier.
     * @param the identifier
     */
    function setId($id) {
        $this->_id = $id;
    }

}