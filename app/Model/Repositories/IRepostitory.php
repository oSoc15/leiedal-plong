<?php

/**
 * The interface which defines the required methods for a respository
 *
 * @author Pieter - #oSoc15
 */
class IRepostitory {
    
    /**
     * The method to add an entity to the repository.
     */
    public function add($entity);
    
    /**
     * The method to get an entity from the repository.
     */
    public function get($entityId);
    
    /**
     * The method to get all the entities from the repository.
     */
    public function getAll();
    
    /**
     * The method to delete an entity from the repository. 
     */
    public function delete($entityId);
    
}
