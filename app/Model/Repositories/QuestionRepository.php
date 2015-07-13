<?php

/**
 * The repository where all Question are located.
 *
 * @author Pieter - #oSoc15
 */
class QuestionRepository implements IRepostitory {

    /**
     * An associative array which represents the repository. The key is the id 
     * of the question and the value is the actual questionobject.
     * @var array
     */
    private $_questions;

    /**
     * The private constructor according to the Singleton-pattern.
     */
    private function __construct() {
        $this->_questions = array();
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
     * @staticvar type $inst The repository for the questions
     * @return \QuestionRepository
     */
    public static function getInstance() {
        static $inst = null;
        if ($inst === null) {
            $inst = new QuestionRepository();
        }
        return $inst;
    }
    
    /**
     * The method to add an question to the repository.
     */
    public function add($question){
        $this->_questions[$question->getId()] = $question;
    }

    /**
     * The method to get an question from the repository.
     */
    public function get($questionId){
        return $this->_questions[$questionId];
    }

    /**
     * The method to get all the questions from the repository.
     */
    public function getAll(){
        return $this->_questions;
    }

    /**
     * The method to delete a question from the repository. 
     */
    public function delete($questionId){
        unset($this->_questions[$questionId]);
    }
}
