# lms

This project was created using create-payload-app using the ts-blank template.

## Requirements

- Node.js 14.x
- Yarn 1.x
- MongoDB 4.x


## How to Use

`yarn dev` will start up your application and reload on any changes.

### Docker

If you have docker and docker-compose installed, you can run `docker-compose up`
To build the docker image, run `docker build -t my-tag .`
Ensure you are passing all needed environment variables when starting up your container via `--env-file` or setting them with your deployment.
The 3 typical env vars will be `MONGODB_URI`, `PAYLOAD_SECRET`, and `PAYLOAD_CONFIG_PATH`
`docker run --env-file .env -p 3000:3000 my-tag`

# :computer: The app
This app is a simple LMS (Learning Management System) that allows users to:

## Courses and Lessons

- :mortar_board: Create courses and lessons
- :bookmark_tabs: Enroll in courses and view lessons

## Subscriptions and Products

- :moneybag: Create plans for subscriptions with x amount of courses and x amount of lessons per course
- :calendar: Set the periodicity of the subscription to monthly, bi-monthly, quarterly, semi-annually or annually
- :package: Create products to sell courses, plans and other products
- :shopping_cart: Buy a product and generate an order with order details
- :mag_right: View all orders and order details (admin only)
- :money_with_wings: Set an order as paid (admin only)

## Viewing Courses and Lessons

- :book: View a course and the lessons in the course (if the product was a course type)
- :books: View the courses in a plan and the lessons in the courses (if the product was a plan type) as long as the subscription is active

## Subscriptions and Renewals

- :alarm_clock: Receive a new order of type subscription renewal when the subscription expires
- :credit_card: Pay for the subscription again (user only)
- :eyes: View all subscriptions and subscription renewals (admin only)
- :heavy_check_mark: Set subscriptions and subscription renewals as paid (admin only)
- :hourglass: Have a cron job run every day to check if the subscription has expired and set it to inactive if it has (user only)

## Lesson Content

- :pencil2: Add the lesson content with a rich text editor
- :link: Add links to different resources in the lesson

## Evaluations

- :clipboard: Option to create an evaluation for the lesson
- :pencil: The evaluation could be type homework or exam
- :hammer_and_wrench: If it's type exam, a form builder will be added so you can add the forms to the evaluation
- :ballot_box_with_check: The form could be an input, select, checkbox, radio, etc.
- :pencil: Once added, the students could submit the exam and the teacher could see student answers and grade them
- :speech_balloon: The teacher could add a comment to the student and if they pass or not
- :pencil: For the homework type, the teacher could add a comment to the student and if they pass or not (work in progress)

## Reviews and Ratings

- :speech_balloon: Add comments to the lesson
- :star: Add reviews to the product
- :star2: Add a rating to the product

## Payments

- :moneybag: User can check their payment history
- :moneybag: User can have multiple payment methods

## Generals

- :bust_in_silhouette: User can edit their profile
- :pencil: Add categories to the courses, plans, products and lessons
- :mag_right: upload images to the courses, plans, products and lessons

This app provides a comprehensive set of features for managing courses, subscriptions, and orders, and is designed to be easy to use for both users and administrators.
this is a work in progress, so there are still some features to be added and some bugs to be fixed.
for the bugs you can check the issues section of this repo.
for the issues that are not listed, you can create a new issue and I will try to fix it as soon as possible.

## Any contributions are welcome :smile:

