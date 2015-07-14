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

    /**
     * The class which provides the Strategy approach to calculate the energyLabelValue.
     * @var ILabelCalculator
     */
    private $_labelCalculator;

    public function __construct() {
        $this->_questionRepository = \QuestionRepository::getInstance();
        $this->_answerRepository = \AnswerRepository::getInstance();
        $this->_residenceRepository = \ResidenceRepository::getInstance();
        $this->_labelCalculator = new SimpleLabelCalculator();
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
     * The method to delete an answer from the repository.
     */
    public function deleteAnswer($answerId) {
        $this->_answerRepository->delete($answerId);
    }

    /**
     * The method to add a residence to the repository.
     */
    public function addResidence($residence) {
        $this->_residenceRepository->add($residence);
    }

    /**
     * The method which returns the residence object with that certain id.
     * @param Integer $residenceId The id of the residence
     * @return Residence The residence for the given id 
     */
    public function getResidence($residenceId) {
        return $this->_residenceRepository->get($residenceId);
    }

    /**
     * The method which return all the residences in the repository.
     * @return array
     */
    public function getAllResidences() {
        return $this->_residenceRepository->getAll();
    }

    /**
     * The method which removes a residence from the repository.
     * @param Integer $residenceId The id of the residence to be removed
     */
    public function deleteResidences($residenceId) {
        $this->_residenceRepository->delete($residenceId);
    }

    /**
     * A method which adds the information from an answered question to the
     * residence.
     * @param Residence $rid The id of the residence
     * @param Integer $qid  The id of the question
     * @param Integer $aid  The id of the answer
     */
    public function answerQuestion($rid, $qid, $aid){
        $this->getResidence($rid)->addInfo($qid, $aid);
    }
    
    /**
     * The Strategy method which calculates the value for the energylabel.
     * @param Integer $rid The id of the residence
     * @return double The value for the energylabel
     */
    public function calculateEnergyLabel($rid){
        return $this->_labelCalculator->calculateLabel($this->getResidence($rid), $this->getAllQuestions(), $this->getAllQuestions());
    }
    
}
