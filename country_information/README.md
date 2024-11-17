Country Explorer
Overview

Country Explorer is a React application that uses the AG Grid component to display data about countries. It fetches data from https://restcountries.com/ API and provides functionalities like:

    Viewing country details.
    Searching countries by name, language, or currency.
    Adding/removing countries from a favorites list.
    Pagination for smoother browsing.

Features

    Dynamic Country Grid:
        Displays country information in a responsive grid.
        Includes columns for country flag, name, population, languages, and currencies.

    Search Functionality:
        Search by country name, language, or currency.

    Favorites Management:
        Mark/unmark countries as favorites.
        View a list of favorite countries.

    Detailed View:
        Click on any country to view more detailed information (e.g., capital, borders, timezones).

Installation
- Prerequisites

    Node.js (v14 or higher)
    npm or yarn

- Steps

    - Clone the repository:
        - git clone https://github.com/vsham20/db_assignment.git
        - cd db_assignment/country_information 
    - Install dependencies:
        - npm install 
    - Run the app:
        - npm start
Usage
Search

    Use the search bar to filter countries by name, language, or currency.

Favorites

    Click on the "View Favorites" button to view your list of favorite countries.
    Mark/unmark countries as favorites in the detailed view.

Country Details

    Click on any row in the grid to see detailed information about the selected country.

