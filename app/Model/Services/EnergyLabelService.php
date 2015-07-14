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

    /**
     * The method to add an question to the repository.
     */
    public function addQuestion($question) {
        $this->_questionRepository->add($question);
    }

    /**
     * The method to get an question from the repository.
     */
    public function getQuestionById($questionid) {
        return $this->_questionRepository->get($questionId);
    }

    /**
     * The method to get all the questions from the repository.
     */
    public function getAllQuestions() {
        return $this->_questionRepository->getAll();
    }

    /**
     * The method to delete a question from the repository. 
     */
    public function deleteQuestion($questionId) {
        $this->_questionRepository->delete($questionId);
    }

    /**
     * The method to add an answer to the repository.
     */
    public function addAnswer($answer) {
        $this->_answerRepository->add($answer);
    }

    /**
     * The method to get an answer from the repository.
     */
    public function getAnswer($answerId) {
        return $this->_answerRepository->get($answerId);
    }

    /**
     * The method to get all answers from the repository.
     */
    public function getAllAnswers() {
        return $this->_answerRepository->getAll();
    }

    /**
     * The method to add an question to the repository.
     */
    public function deleteAnswer() {
        $this->_answerRepository->delete($answerId);
    }

    public function addResidence() {
        $this->_residenceRepository->add($residence);
    }

    public function getResidence($residenceId) {
        return $this->_residenceRepository->get($residenceId);
    }

    public function getAllResidences() {
        return $this->_residenceRepository->getAll();
    }

    public function deleteResidences($residenceId) {
        $this->_residenceRepository->delete($residenceId);
    }

}
