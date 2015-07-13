<?php

namespace App\Model\Entities;

/**
 * This class represents the residence of the user. Each question that is 
 * answered updates the info in this residence improving the rate to calculate 
 * the correct energylabel.
 * 
 * @author Pieter - #oSoc15
 */
class Residence extends \Identifier {
    
    /**
     * The longitude coordinate of the residence.
     * @var Integer The longitude coordinate of the residence 
     */
    private $_longitude;
    
    /**
     * The latitude coordinate of the residence.
     * @var Integer The latitude coordinate of the residence 
     */
    private $_latitude;
    
    public function __construct($longitude = 0, $latitude = 0) {
        $this->_latitude = $latitude;
        $this->_longitude = $longitude;
        //TODO: implementation
    }
    
    /**
     * The getter for the longitude of the residence
     * @return Integer The longitude of the residence
     */
    public function getLongitude(){
        return $this->_longitude;
    }
    
    /**
     * The setter for the longitude of the residence.
     * @param Integer $longitude The longitude of the residence
     */
    public function setLongitude($longitude){
        $this->_longitude = $longitude;
    }
    
    /**
     * The getter for the latitude of the residence.
     * @return Integer $latitude The latitude of the residence
     */
    public function getLatitude(){
        return $this->_latitude;
    }
    
    /**
     * The setter for the latitude of the residence.
     * @param Integer $latitude The latitude of the residence
     */
    public function setLatitude($latitude){
        $this->_latitude = $latitude;
    }
    
}
