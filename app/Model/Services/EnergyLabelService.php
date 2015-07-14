<?php

/**
 * Description of EnergyLabelService
 *
 * @author Pieter - #oSoc15
 */
class EnergyLabelService {

    /**
     * The repository for the questions.
     * @var QuestionRepository
     */
    private $_questionRepository;
    
    /**
     * The repository for the answers.
     * @var type 
     */
    private $_answerRepository;
    
    /**
     * The repository for the residences.
     * @var type 
     */
    private $_residenceRepository;

    public function __construct() {
        $this->_questionRepository = \QuestionRepository::getInstance();
        $this->_answerRepository = \AnswerRepository::getInstance();
        $this->_residenceRepository = \ResidenceRepository::getInstance();
    }

    public function addQuestion($question) {
        $this->_questionRepository->add($question);
    }

    public function getQuestionById($questionid) {
        return $this->_questionRepository->get($questionId);
    }

    public function getAllQuestions() {
        return $this->_questionRepository->getAll();
    }

    public function deleteQuestion($questionId) {
        $this->_questionRepository->delete($questionId);
    }

}
