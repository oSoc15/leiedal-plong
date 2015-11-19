CREATE DATABASE  IF NOT EXISTS `plong` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `plong`;
-- MySQL dump 10.13  Distrib 5.6.13, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: plong
-- ------------------------------------------------------
-- Server version	5.6.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `weight` int(11) NOT NULL,
  `question_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `answers_question_id_index` (`question_id`),
  CONSTRAINT `answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,'Open','n',2,1),(2,'Gesloten','n',6,1),(3,'Halfopen','n',4,1),(4,'Voor 1920','n',1,2),(5,'1921-1945','n',2,2),(6,'1946-1970','n',3,2),(7,'1971-1985','n',4,2),(8,'1986-1995','n',5,2),(9,'1996-2005','n',6,2),(10,'Na 2005','n',7,2),(11,'Klein','n',1,3),(12,'Middel','n',2,3),(13,'Groot','n',3,3),(14,'Enkel gelijkvloers','y',1,4),(15,'1 verdieping','y',3,4),(16,'2 of meer verdiepingen','y',5,4),(17,'Schuin dak','y',1,5),(18,'Plat dak','y',3,5),(19,'Gemengd dak','y',5,5),(20,'Ja','y',3,6),(21,'Nee','y',1,6),(22,'Niet geïsoleerd','y',1,7),(23,'Slecht geïsoleerd','y',2,7),(24,'Matig geïsoleerd','y',3,7),(25,'Goed geïsoleerd','y',4,7),(26,'Perfect geïsoleerd','y',5,7),(27,'Niet geïsoleerd','y',1,8),(28,'Beperkt geïsoleerd','y',3,8),(29,'Goed geïsoleerd','y',5,8),(30,'Aardgas','y',1,9),(31,'Stookolie','y',2,9),(32,'Hernieuwbare energie (warmtepomp, houtpellets)','y',5,9),(33,'Hout','y',3,9),(34,'Elektriciteit','y',4,9),(35,'Andere','y',1,9),(36,'Enkelvoudig glas','n',1,10),(37,'Gewoon dubbel glas','n',3,10),(38,'Hoogrendementsglas voor 2000','n',4,10),(39,'Hoogrendementsglas na 2000','n',5,10),(40,'Driedubbel glas','n',6,10),(41,'Weet ik niet','n',1,10),(42,'Geen bijzonder systeem','n',1,11),(43,'Ventilatieroosters aan ramen','n',2,11),(44,'Mechanische ventilatie','n',5,11),(45,'Balansventilatie met warmte recup','n',3,11),(46,'Weet ik niet','n',4,11),(47,'Zonneboiler','n',3,12),(48,'Zonnepanelen','n',3,12),(49,'Beide','n',6,12),(50,'Geen','n',1,12);
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('2015_07_14_205621_create_questiontype_table',1),('2015_07_14_205919_create_questions_table',1),('2015_07_14_210401_create_answers_table',1),('2015_07_16_131827_create_section_table',1),('2015_07_16_164056_create_residence_table',1),('2015_07_28_091629_create_reply_table',1),('2015_07_29_122203_create_real_answer_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_types`
--

DROP TABLE IF EXISTS `question_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_types`
--

LOCK TABLES `question_types` WRITE;
/*!40000 ALTER TABLE `question_types` DISABLE KEYS */;
INSERT INTO `question_types` VALUES (1,'yes_no'),(2,'button'),(3,'slider'),(4,'input'),(5,'multi');
/*!40000 ALTER TABLE `question_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `unknown` tinyint(1) NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `from` int(11) DEFAULT NULL,
  `till` int(11) DEFAULT NULL,
  `question_type` int(10) unsigned NOT NULL,
  `section_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_question_type_foreign` (`question_type`),
  KEY `questions_section_id_index` (`section_id`),
  CONSTRAINT `questions_question_type_foreign` FOREIGN KEY (`question_type`) REFERENCES `question_types` (`id`),
  CONSTRAINT `questions_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'beb',1,'Soort bebouwing?',NULL,NULL,2,1),(2,'bouwjaar',1,'Wat is het bouwjaar van uw huis?',NULL,NULL,2,1),(3,'opp',1,'Wat is de bewoonbare oppervlakte?',NULL,NULL,2,1),(4,'f',1,'Hoeveel verdiepingen telt uw huis?',NULL,NULL,2,1),(5,'r',1,'Welk soort dak heeft u?',NULL,NULL,2,1),(6,'basement',1,'Heeft u een kelder?',NULL,NULL,2,1),(7,'insulation-wall',1,'Hoe is uw gevel geïsoleerd?',NULL,NULL,2,2),(8,'insulation-floor',1,'Hoe is uw vloer geïsoleerd?',NULL,NULL,2,2),(9,'heating',1,'Hoe verwarmt u uw huis hoofdzakelijk?',NULL,NULL,2,2),(10,'ramen',1,'Wat voor ramen heeft uw huis?',NULL,NULL,2,2),(11,'ventilatie',1,'Hoe ventileert u uw huis hoofdzakelijk?',NULL,NULL,2,2),(12,'renewable',1,'Maakt u gebruik van hernieuwbare energie?',NULL,NULL,2,2);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `real_answers`
--

DROP TABLE IF EXISTS `real_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `real_answers` (
  `reply_id` int(10) unsigned NOT NULL,
  `answer_id` int(10) unsigned DEFAULT NULL,
  `input` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unknown` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  KEY `real_answers_reply_id_index` (`reply_id`),
  KEY `real_answers_answer_id_index` (`answer_id`),
  CONSTRAINT `real_answers_answer_id_foreign` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`),
  CONSTRAINT `real_answers_reply_id_foreign` FOREIGN KEY (`reply_id`) REFERENCES `replies` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `real_answers`
--

LOCK TABLES `real_answers` WRITE;
/*!40000 ALTER TABLE `real_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `real_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `replies`
--

DROP TABLE IF EXISTS `replies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `replies` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `residence_id` int(10) unsigned DEFAULT NULL,
  `question_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `replies_residence_id_index` (`residence_id`),
  KEY `replies_question_id_index` (`question_id`),
  CONSTRAINT `replies_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `replies_residence_id_foreign` FOREIGN KEY (`residence_id`) REFERENCES `residences` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `replies`
--

LOCK TABLES `replies` WRITE;
/*!40000 ALTER TABLE `replies` DISABLE KEYS */;
/*!40000 ALTER TABLE `replies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residences`
--

DROP TABLE IF EXISTS `residences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `residences` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `street` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ecolabel` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `postalCode` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `lat` double(8,2) NOT NULL,
  `lon` double(8,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residences`
--

LOCK TABLES `residences` WRITE;
/*!40000 ALTER TABLE `residences` DISABLE KEYS */;
/*!40000 ALTER TABLE `residences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sections` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES (1,'Gebouw'),(2,'Isolatie');
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-19 16:11:54
