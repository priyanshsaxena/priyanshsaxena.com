---
title: "CGI Programming with Python & Apache"
date: 2018-05-09T18:00:00+05:30
description: CGI Programming Tutorial
menu:
  sidebar:
    name: CGI Programming with Python & Apache
    identifier: cgi-programming
    weight: 10
---

> Apache HTTP Server is probably the best-known HTTP server, and Python the most versatile language. Using Python scripts with Apache servers using the CGI support is a quick way to get started with basic web-development, without the need to learn Python-based web-dev frameworks like Pyramid or Django. In this short tutorial, I list out the steps on how to configure your Apache server to use Python scripts.

_This tutorial assumes that you are operating on a Linux environment, with Python 2.7 installed on your system. The steps for Windows and Python 3.x will be described wherever applicable._

---

### CGI what?

![image](I-dont-know.jpg)

CGI - the Common Gateway Interface - is a set of standards that define how information is exchanged between a web server and a script. So, it essentially refers to a protocol to help a web-server understand the data sent by a script, and to request data in a format that the scripts may process. The web-server executes the scripts just as they would run in a CLI. The CGI specifications are maintained by [National Center for Supercomputing Applications](http://www.ncsa.illinois.edu/).

---

### Talk is cheap. Show me the code.

Let's complete the main-objective of this post - running our first Python script on the Apache server - first, and then come back for useful tips, tricks and trouble-shooting

#### Step 1: Modify Apache config file

The first step is to enable the execution of CGI scripts by the Apache server. Use your favourite text editor to add the following lines at the very end of `/etc/apache2/apache2.conf`.

```
<Directory /path/to/your/cgi/directory>
	Options +ExecCGI
	AddHandler cgi-script .py
</Directory>
```

You need to replace `/path/to/your/cgi/directory` with the absolute path of the directory where your Python scripts will be stored. Usually, all python scripts are kept in a folder of their own, at the root of the project.

For Windows users, the required conf files can be found in the installation directory, by default in `C:\Program Files\Apache Software Foundation`

#### Step 2: Write a test script in Python

The first step is pretty much all you need to do to get going with CGI programming. Head over to `/path/to/your/cgi/directory` from [step 1](#step-1-modify-apache-config-file), create a new file `script.py` and add the following content to it

```
#! /usr/bin/env python
print "Content-Type: text/html"
print
print "Hello World! My CGI Program works!"
```

Let's dive into this seemingly simple Python code and see why each and every line matters.

- **#! /usr/bin/env python:** To run the script as a program executing in the CLI, the Apache server needs to know what program is used to execute this script in the CLI. The hash-bang supplies this piece of information.
- **print "Content-Type: text/html":** Once the output of this script is received, it will usually be shown on a web-page rendered by the Apache server. This line acts as the header and dictates that the output be rendered as an HTML page.
- The other two lines, as is quite evident, are just the 'logic' of the script that does the work for you.

Python3 users need to adjust to the syntax of Python3 by using parentheses with print statements. Also, the first line needs to be modified to the following (assuming Python 2.7 is installed at the given directory):

```
#!c:/python27/python.exe
```

#### Step 3: Make the script executable

From the command-line, execute the following command to make the script executable. "sudo" privilege is required for this to work.

```
chmod +x script.py
```

And that concludes the changes that are needed for this to work! Let's test it out now.

#### Step 4: Restart the Apache server and go!

From the command-line, execute the following command to restart the Apache server. "sudo" privilege might be needed.

```
systemctl restart apache2
```

Next, open [http://localhost/script.py](http://localhost/script.py) URL in your favourite web-browser. If you have been attentive and truthful to this tutorial, you should see the following output on your screen.

```
Hello World! My CGI Program works!
```

And that's that. A little less difficult than **Cakewalk**, this is one way that helps you get going with Python alongside your Apache server.

---

### I am stuck! Help me out!

You might have run into a problem while following this tutorial - and that's ok! Listed below are some common errors that I have seen.

#### I can't locate the Apache conf file.

For some version of Linux, the conf file is located at `/etc/apache2/httpd.conf`

#### I get a 500 Internal Server Error, and I don't know why.

Head over to your error-log file and figure out what the problem is. The file is usually present at `/var/log/apache2/error.log`

##### I get "End of script output before header..." from the error-log.

You need to add the line specifying the content-type in your script for the server to understand the output-format.
Specify the following line in your script, and head over to [step 2](#step-2-write-a-test-script-in-python) above to find out why.

```
print "Content-Type: text/html"
```

#### Now it's "malformed header from script...", why?

This one is fun! You need to add a blank print statement just below the line that prints the header to resolve this. This is because the server is interpreting the part of your script that you intended to make the body as a continuation of your headers - you never terminated them ! The blank print statement ends the header (for that matter, any of the \r or \n would work) and solves the problem.

---

### Complementary tip!

You have seen that you need to adjust your hash-bangs in the Python script, depending upon your operating system. Now, if you are hosting your website on an ensemble of servers consisting of both Linux and Windows machines, you might not want to adjust this every time. To set this up, head over to your Apache conf file, and find the line that says:

```
#ScriptInterpreterSource Registry
```

Remove the # from this line. Now windows will use the registry to find out where Python is installed, and you are a happy person! 
