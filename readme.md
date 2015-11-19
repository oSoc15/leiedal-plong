Leiedal plong
=====================================

Determine your energy label through an interactive platform

---

### Getting up and running
If this is the first time that you use laravel, check out the [getting started guide](http://laravel.com/docs/5.1/installation) from laravel.

A good PHP development environment is [Homestead](http://laravel.com/docs/5.1/homestead).

1. Clone this repo from `https://github.com/oSoc15/leiedal-plong`
2. Run `composer install` from the root directory of the cloned repository 
3. Change your environment to your credentials (located in rootfolder/.env)
3. Run `php artisan migrate` to create the database tables and relationships
4. Run `php artisan db:seed` to seed the tables
5. Run `npm install -g gulp bower` to install to build system and client package manager
6. Run `npm install` to pull the dependencies
7. Run `bower install` to pull the client dependencies
8. Run `gulp` to monitor the changes in CSS and JS files. Has to be launched to develop the frontend

---

### Important application file structure (Back End)

**Root**
- **app/** (the Laravel application)
  - Http/
    - **Controllers/** (folder with all the Laravel Controllers)
    - **routes.php** (file where URL routes are defined)
  - **Models/** (folder where are the database Models are defined)
- config/ 
  - **app.php** (file where some configurations can to be made)
- database/
  - **migrations/** (database migrations are stored here)
  - **seeds/** (database seeds are stored here)
- resources/
  - db
    - **plong_default.sql** (default database schema)
  - views/
    - **map.blade.php** (map view, Laravel based)
    - **questionnaire.blade.php** (questionnaire view, Laravel + AngularJS)
    - **tips.blade.php** (tips view, Laravel + AngularJS)
- storage/
  - app/
    - **questions.json** (file where the questions and answers are stored, this file is used when reseeding a database)
- **.env** (environment file where you define your database credentials)

---

### Important application file structure (Front End)

**Root**
- public/
  - **assets/** (folder containing all the assets, such as the images for the house)
  - **css/** (folder containing CSS files, generated with from the Sass files)
  - **sass/** (folder containing all Sass files, these are concatinated to CSS files)
  - js/
    - controllers/ (folder containing the AngularJS controllers)
      - **mainCtrl.js** (controller used in the questionnaire view)
      - **tipCtrl.js** (controller used in the tips view)
    - **plugin/** (folder containing the extra plugins such as LeafletSRI and LeafletWMS)
  - **app.js** (base AngularJS module is defined here, loaded on all views that use AngularJS)
- resources/
  - views/
    - **map.blade.php** (map view, Laravel based)
    - **questionnaire.blade.php** (questionnaire view, Laravel + AngularJS)
    - **tips.blade.php** (tips view, Laravel + AngularJS)

---

### API Routes

#### GET /api/questions

This shows all the questions in the API.
A question consist of multiple answers.

#### GET /api/questions/id

Gives the specific information of the section.
The answers bound to this question will also be shown.

#### GET /api/residences

Gives an overview of all residences that are in the system, with their score and other information.

#### POST/api/residence

Creates a residence.

parameters:

- city : string
- postalCode : integer
- street : string
- number : integer
- lat : float
- long : float

This returns the instance of residence with all attributes with the provided hashids for identification.

#### POST/api/residence/reply

Post the choosen answer to the question. 

parameters:

- residence (the returned hashids when you created the residence) : string
- question (the id of the current question) : integer
- answer (the id of the choosen answer) : integer
- unknown (has the user choosen the 'Weet ik niet' reply) : boolean
- input (the input from the user, set answer and unknown to null)

Returns the updated residence, the current question and the possible answers.

This project uses the [laravel framework](https://github.com/laravel/framework) and [AngularJS](https://angularjs.org/).

[View contributors](https://github.com/oSoc15/leiedal-plong/graphs/contributors)
