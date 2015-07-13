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

    /**
     * The info supplied about this residence stored in a associative array with
     * the questionId as key and the answerId as value.
     * @var array   The given input for each question. 
     */
    private $_info;

    public function __construct($longitude = 0, $latitude = 0, $info = array()) {
        $this->_latitude = $latitude;
        $this->_longitude = $longitude;
        $this->_info = $info;
    }

    /**
     * The getter for the longitude of the residence
     * @return Integer The longitude of the residence
     */
    public function getLongitude() {
        return $this->_longitude;
    }

    /**
     * The setter for the longitude of the residence.
     * @param Integer $longitude The longitude of the residence
     */
    public function setLongitude($longitude) {
        $this->_longitude = $longitude;
    }

    /**
     * The getter for the latitude of the residence.
     * @return Integer $latitude The latitude of the residence
     */
    public function getLatitude() {
        return $this->_latitude;
    }

    /**
     * The setter for the latitude of the residence.
     * @param Integer $latitude The latitude of the residence
     */
    public function setLatitude($latitude) {
        $this->_latitude = $latitude;
    }

    /**
     * A method which returns all the answered question about this residence.
     * @return array with the questionId as key and the answerId as value.
     */
    public function getAllInfo() {
        return $this->_info;
    }

    /**
     * A method which returns the answer given to a given question.
     * @param Integer $questionId The id of the question you want
     */
    public function getInfo($questionId) {
        return $this->_info[$questionId];
    }

}
