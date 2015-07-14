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
     * The image which represents the answer in a graphical way.
     * @var String The url to the image used according this answer. 
     */
    private $_image;
    
    /**
     * The constructor for an Answer
     * @param String $answer The sentence which is the answer
     */
    public function __construct($answer = 'BEST ANSWER EVER', $subquestion = '') {
        $this->_answer = $answer;
        $this->_subquestion = $subquestion;
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
    public function getSubquestion() {
        return $this->_subquestion;
    }

    /**
     * The setter for the subquestion of this answer.
     * 
     * @param Question $_subquestion The subquestion which follows up onto this answer.
     */
    public function setSubquestion($_subquestion) {
        $this->_subquestion = $_subquestion;
    }

    /**
     * The getter for the image of the answer.
     * @return String The url of the image of the answer.
     */
    public function getImage(){
        return $this->_image;
    }
    
    /**
     * The setter for the image of the answer.
     * @param String $url The link to the image of the answer
     */
    public function setImage($url){
        $this->_image = $url;
    }
    
}
