<?php

namespace App\Model\Entities;

/**
 * This class is the respresentation of a question which can be asked to 
 * determine the label of the house in the questionnairy. It has the weight in 
 * which this question's answer is accounted for in the algorithm to determine 
 * the ecolabel. It has an array of possible answers to this question.
 *
 * @author Pieter - #oSoc15
 */
class Question extends Identifier {
    /*
     * The sentence displayed to the user.
     */

    private $_question;

    /**
     * The String representation of the question which holds all the information this question posseses.
     * @var String The extended version of the question. 
     */
    private $_extendedQuestion;

    /**
     * An array with all the possible answer to this question.
     */
    private $_answer;

    /**
     * The type of the question.
     * @var QuestionTypes
     */
    private $_type;

    /**
     * Can you give an input in this question.
     * @var boolean
     */
    private $_input;

    /**
     * A constructor which creates a question with it's possible answers.
     * @param String $question    The sentence to be displayed to the user
     * @param array(Answer) $answer  The array of possible answers
     */
    public function __construct($question = 'does this work?', $extendedQuestion = "", $input = false, $answer = array('yes', 'no')) {
        $this->_question = $question;
        $this->_answer = $answer;
        $this->_extendedQuestion = $extendedQuestion;
        $this->_input = $input;
    }

    /**
     * The getter for the sentence of the question.
     * @return The sentence to be asked.
     */
    public function getQuestion() {
        return $this->_question;
    }

    /**
     * The setter for the sentence of the question.
     * @param String $question The short String representation of the question.
     */
    public function setQuestion($question) {
        $this->_question = $question;
    }

    /**
     * The getter for the extended version of the question.
     * @return The extended version of the question
     */
    public function getExtendedQuestion() {
        return $this->_extendedQuestion;
    }

    /**
     * The setter for the extended version of the question.
     * @param String $_extendedQuestion The extended version of the question.
     */
    public function setExtendedQuestion($_extendedQuestion) {
        $this->_extendedQuestion = $_extendedQuestion;
    }

    /**
     * The getter for the answer of the question.
     * @return The array of possible answers to this question.
     */
    public function getAnswer() {
        return $this->_answer;
    }

    /**
     * The setter for the answer of the question.
     * @param array(Answer) $answer The possible answer to this question.
     */
    public function setAnswer($answer) {
        $this->_answer = $answer;
    }

    /**
     * The getter for the type of the question.
     * @return QuestionTypes The type of the question
     */
    public function get_type() {
        return $this->_type;
    }

    /**
     * The setter for the type of the question.
     * @return QuestionTypes The type of the question
     */
    public function setType($_type) {
        $this->_type = $_type;
    }

    /**
     * The getter which defines if the question has an inputtype.
     * @return boolean  True if you have an inputfield. False otherwise.
     */
    public function hasInput() {
        return $this->_input;
    }

    /**
     * The setter which defines if the question has an inputtype.
     * @param $_input True if you have an inputfield. False otherwise.
     */
    public function setInput($_input) {
        $this->_input = $_input;
    }
}