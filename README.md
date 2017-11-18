# Hacking For Humanity

## Problem to Solve:

Topic: Anonymity-friendly Case Management System

Contact: Merel Swartz (merel.swartz@childline.gi)

Description:

Childline Gibraltar is a local charity which aims primarily to end cruelty to children in Gibraltar. We offer various services but the main 2 services are a Helpline (phone, live chat and e-mail) and an Appropriate Adult service, where we accompany detained juveniles to the police station and support them through the interview process. The case management tool is basically a database where we log all our contacts (so all telephone calls, emails, chats and appropriate adult call-outs).

Bear in mind, we offer an anonymous and confidential service so young people can contact us and don't have to give us any identifying details.

Until June of this year, when it crashed, we used a system called Frameworki (by a company called Corelogic). This is a program (database) that was devised for social services in the UK and was basically too "big" for our needs and not totally relevant to our work. We were using an ancient version of the program and that has been one of the main barriers to getting it fixed - the technicians barely remember how it worked as it is so old. So we've been without a database since June and have only been logging calls on paper. This means we can't easily check if someone has called before, or see if a Helpline volunteer has left any notes or questions to ask someone should they call again.

We need a system where we can log call details (fields would be based on personal details, family details, nature/category of problem, whether or not we will to social services etc.) but also where we can easily obtain statistics on a monthly basis. For example, calculate the number of calls received about suicidal thoughts, or self-harm.

# To install:

## Dependencies

You'll need the following installed:

* [NodeJS](https://nodejs.org)
* [XAMPP](https://www.apachefriends.org/)
* [Git](https://git-for-windows.github.io/) (if you're on Windows)

## Setup

Firstly, the site runs a PHP API, so you'll need to set up Apache to run in the directory you're installing the site in. Here we'll assume we're installing on `C:/xampp/supercars.gi/` but edit this to taste for your local configuration:

1)
Edit your hosts file to point a test domain to your localhost (`C:\Windows\System32\drivers\etc\hosts`) in Windows. Add the lines:

```
127.0.0.1 phpmyadmin.local
127.0.0.1 childline.local
```

2)
Edit your Apache virtual hosts file (`C:\xampp\apache\conf\extra\httpd-vhosts.conf` in Windows with XAMPP). Firstly make sure the line:

`NameVirtualHost *:80`

is not commented out and that the line:

`#NameVirtualHost 127.0.0.1:80`

*is* commented out (as in the # above)

Now at the bottom, add the records:

```
<VirtualHost *:80>
  DocumentRoot "C:\xampp\phpmyadmin"
  ServerName phpmyadmin.local

  CustomLog "C:\xampp\phpmyadmin\phpmyadmin.access.log" combined
  ErrorLog "C:\xampp\phpmyadmin\phpmyadmin.log"

  <Directory "C:\xampp\phpmyadmin">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    Order allow,deny
    Allow from all
  </Directory>
</VirtualHost>

<VirtualHost *:80>
  DocumentRoot "C:\xampp\h4h\www"
  ServerName childline.local
  AllowEncodedSlashes NoDecode

  <Directory "C:\xampp\h4h\www">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    Order allow,deny
    Allow from all
  </Directory>
</VirtualHost>
```

3)
Restart Apache.

4)
Set up a database. Look in the db config file (`./src/api/classes/class.db.php`) for the current database name, as well as the current user name and password. Set these up in your MySql database ([PHPMyAdmin](http://phpmyadmin.local)). Then run the current minimum setup in the root sql file (`./db.sql`).

# Install / Build

```sh
$ cd /c/xampp/
$ git clone https://stutippett@bitbucket.org/stutippett/h4h.git
$ cd h4h
$ npm install
$ gulp build
```

The site should load in your browser, and the build will be in the `./www` folder

The source files are in the `./src` folder