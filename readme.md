Leiedal Questionnaire API
=====================================

An API for [leiedal-questionnaire](https://github.com/oSoc15/leiedal-questionnaire).
For partner [Leiedal](http://www.leiedal.be/).

[Leiedal-questionnaire-api](https://github.com/oSoc15/leiedal-questionnaire-api), [leiedal-map](https://github.com/oSoc15/leiedal-map) and this repository form an application.

[View contributors](https://github.com/oSoc15/leiedal-questionnaire-api/graphs/contributors)

---

### Getting up and running

1. Clone this repo from `https://github.com/oSoc15/leiedal-leiedal-api`
2. Run `composer install` from the root directory
3. Change your environment to your credentials
3. Run `php artisan migrate`


---

### API Routes

#### GET /api/sections

This shows all the sections of the API.
The sections consist of multiple questions.

#### GET /api/sections/id

Gives the specific information of the section.


#### GET /api/questions

This shows all the questions in the API.
A question consist of multiple answers.

#### GET /api/questions/id

Gives the specific information of the section.
The answers bound to this question will also be shown.


#### POST/api/residence

Creates a residence.

parameters:

- city 
- postalCode
- street
- number
- lat
- long



This project uses the [laravel framework](https://github.com/laravel/framework).
