<?php

/**
 * The repository where all Residences are located.
 *
 * @author Pieter - #oSoc15
 */
class ResidenceRepository implements IRepository {

    /**
     * An associative array which represents the repository. The key is the id 
     * of the residence and the value is the actual residencerobject.
     * @var array
     */
    private $_residences;

    /**
     * The private constructor according to the Singleton-pattern.
     */
    private function __construct() {
        $this->_residences = array();
    }

    /**
     * Private clone method to prevent cloning of the instance of the
     * *Singleton* instance.
     *
     * @return void
     */
    private function __clone() {}

    /**
     * The only way to get the repository.
     * @staticvar type $inst The repository for the residences
     * @return \ResidenceRepository
     */
    public static function getInstance() {
        static $inst = null;
        if ($inst === null) {
            $inst = new ResidenceRepository();
        }
        return $inst;
    }
    
    /**
     * The method to add an residence to the repository.
     */
    public function add($residence) {
        if(empty($residence)){
            throw new Exception("NULL OBJECT RESIDENCE SPECIFIED");
        }
        $this->_residences[$residence->getId()] = $residence;
    }

    /**
     * The method to get an residence from the repository.
     */
    public function get($residenceId) {
        return $this->_residences[$residenceId];
    }

    /**
     * The method to get all the residences from the repository.
     */
    public function getAll() {
        return $this->_residences;
    }

    /**
     * The method to delete a residence from the repository. 
     */
    public function delete($residenceId) {
        unset($this->_residences[$residenceId]);
    }

}
