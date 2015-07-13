<?php

/**
 * The repository where all Answers are located.
 * 
 * @author Pieter - #oSoc15
 */
class AnswerRepository implements IRepostitory {

    /**
     * An associative array which represents the repository. The key is the id 
     * of the answer and the value is the actual answerobject.
     * @var array
     */
    private $_answers;

    /**
     * The private constructor according to the Singleton-pattern.
     */
    private function __construct() {
        $this->_answers = array();
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
     * @staticvar type $inst The repository for the answers
     * @return \AnswerRepository
     */
    public static function getInstance() {
        static $inst = null;
        if ($inst === null) {
            $inst = new AnswerRepository();
        }
        return $inst;
    }

    /**
     * The method to add an answer to the repository.
     */
    public function add($answer) {
        $this->_answers[$answer->getId()] = $answer;
    }

    /**
     * The method to get an answer from the repository.
     */
    public function get($answerId) {
        return $this->_answers[$answerId];
    }

    /**
     * The method to get all the answers from the repository.
     */
    public function getAll() {
        return $this->_answers;
    }

    /**
     * The method to delete a answer from the repository. 
     */
    public function delete($answerId) {
        unset($this->_answers[$answerId]);
    }

}
