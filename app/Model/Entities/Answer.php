<?php

namespace App\Model\Entities;

/**
 * This class is the respresentation of a answer to a certain question. It
 * has a value to which this answer is accounted for in the algorithm to 
 * determine the ecolabel.
 *
 * @author Pieter - #oSoc15
 */
class Answer extends \Identifier {

    /**
     *  The answer to be displayed to the user.
     */
    private $_answer;

    /**
     * The possible question which will follow up on this answer.
     * @var Question the question which goes further upon this answer.
     */
    private $_subquestion;

    /**
     * The constructor for an Answer
     * @param String $answer The sentence which is the answer
     */
    public function __construct($answer = 'BEST ANSWER EVER') {
        $this->_answer = $answer;
    }

    /**
     * The setter for the anwer
     * @param The sentence of the answer
     */
    public function setAnswer($answer) {
        $this->_answer = $answer;
    }

    /**
     * The getter for the answer.
     * @return The sentence of the answer
     */
    public function getAnswer() {
        return $this->_answer;
    }

    /**
     * The getter for the subquestion of this answer.
     * @return Question The subquestion which follows up on this answer.
     */
    public function get_subquestion() {
        return $this->_subquestion;
    }

    /**
     * The setter for the subquestion of this answer.
     * 
     * @param Question $_subquestion The subquestion which follows up onto this answer.
     */
    public function set_subquestion($_subquestion) {
        $this->_subquestion = $_subquestion;
    }

}
